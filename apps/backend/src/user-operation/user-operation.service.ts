import { randomUUID } from 'crypto';
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService, Prisma } from '@repo/prisma';
import {
  SignUserOperationRequestDto,
  SignUserOperationResponseDto,
  RequestUserOperationDto,
  ResponseUserOperationDto,
} from './dto/sign-user-operation.dto';
import { findPassingRule, TRule } from './rule-engine';
import { Eip712PaymasterSigner, IPaymasterSigner } from './signer';
import { computeUserOpHashV07 } from './userop-hash';

const POLICY_STATUS_ACTIVE = 'ACTIVE' as const;
const UO_STATUS_PENDING = 'PENDING' as const;
const UO_STATUS_SIGNED = 'SIGNED' as const;
const UO_STATUS_EXECUTED = 'EXECUTED' as const;
const UO_STATUS_VALIDATION_FAILED = 'VALIDATION_FAILED' as const;

type TPolicyRow = {
  id: number;
  name: string;
  paymaster_address: string;
  chain_id: bigint;
  status_id: string;
  max_budget_wei: Prisma.Decimal | string;
  is_public: boolean;
  whitelisted_addresses: string[] | null;
  valid_from: Date;
  valid_to: Date | null;
  created_at: Date;
  updated_at: Date;
};

type TSumRow = { sum: Prisma.Decimal | string | number | bigint | null };
type TRuleRow = {
  id: number;
  policy_id: number;
  metric_id: string;
  comparator_id: string;
  interval_id: string;
  scope_id: string;
  value: Prisma.Decimal | string;
  token_address?: string;
  token_decimals?: number;
  valid_from: Date;
  valid_to: Date | null;
  created_at: Date;
  updated_at: Date;
};

type TValidationFailureReason =
  | {
      type: 'BUDGET_EXCEEDED';
      policyId: number;
      policyName: string;
      required: string;
      available: string;
    }
  | {
      type: 'RULES_FAILED';
      policyId: number;
      policyName: string;
      failedRules: Array<{ ruleId: number; metric: string; reason: string }>;
    };

@Injectable()
export class UserOperationService {
  private readonly signer: IPaymasterSigner;
  private readonly entryPointAddress: string;

  public constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const privateKey = this.configService.get<string>('PAYMASTER_SIGNER_PRIVATE_KEY');
    const name = this.configService.get<string>('PAYMASTER_EIP712_DOMAIN_NAME');
    const version = this.configService.get<string>('PAYMASTER_EIP712_DOMAIN_VERSION');
    const ttlSeconds = this.configService.get<number>(
      'PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS',
    );
    const entryPointAddress = this.configService.get<string>('ENTRY_POINT_ADDRESS_V07');

    if (!privateKey) throw new Error('PAYMASTER_SIGNER_PRIVATE_KEY is required');
    if (!name) throw new Error('PAYMASTER_EIP712_DOMAIN_NAME is required');
    if (!version) throw new Error('PAYMASTER_EIP712_DOMAIN_VERSION is required');
    if (!ttlSeconds) throw new Error('PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS is required');
    if (!entryPointAddress) throw new Error('ENTRY_POINT_ADDRESS_V07 is required');

    this.signer = new Eip712PaymasterSigner({
      privateKey,
      name,
      version,
      ttlSeconds,
    });
    this.entryPointAddress = entryPointAddress;
  }

  public async signUserOperation(
    req: SignUserOperationRequestDto,
  ): Promise<SignUserOperationResponseDto> {
    const requestId = randomUUID();
    const nowIso = new Date().toISOString();

    const { chainId } = req;
    const chainIdBigInt = BigInt(chainId);
    const uo: RequestUserOperationDto = this.normalize(req.userOperation);

    if (!uo.paymaster?.startsWith('0x')) {
      throw new BadRequestException('userOperation.paymaster is required');
    }

    // === 1. Find policies ===
    const candidates: TPolicyRow[] = await this.prisma.$queryRaw<TPolicyRow[]>(Prisma.sql`
      SELECT p.*
      FROM core.policies p
      WHERE p.status_id = ${POLICY_STATUS_ACTIVE}
        AND lower(p.paymaster_address) = lower(${uo.paymaster})
        AND p.chain_id = ${chainIdBigInt}
        AND p.valid_from <= now()
        AND (p.valid_to IS NULL OR p.valid_to >= now())
        AND (
          p.is_public = true OR
          lower(${uo.sender}) = ANY (
            SELECT lower(addr)
            FROM unnest(p.whitelisted_addresses) AS addr
          )
        )
      ORDER BY p.created_at DESC
    `);

    if (candidates.length === 0) {
      throw new ForbiddenException(
        'No active policy found for this paymaster + chain that admits this sender.',
      );
    }

    // === 2. Insert as PENDING ===
    const estimatedMaxCostWei = this.estimateMaxCostWei(uo);
    const created = await this.prisma.userOperation.create({
      data: {
        policy_id: candidates[0].id,
        hash: null,
        sender_address: uo.sender,
        status_id: UO_STATUS_PENDING,
        status_note: 'User operation submitted and pending validation',
        payload: uo as unknown as Prisma.JsonObject,
        actual_gas_cost_wei: null,
        max_gas_cost_wei: estimatedMaxCostWei,
      },
    });
    await this.logChange(created.id, 'status_id', null, UO_STATUS_PENDING);

    // === 3. Validate policies ===
    let selectedPolicy: TPolicyRow | null = null;
    let acceptedRule: TRule | null = null;
    const failures: TValidationFailureReason[] = [];

    for (const policy of candidates) {
      const sumRows: TSumRow[] = await this.prisma.$queryRaw<TSumRow[]>(
        Prisma.sql`
          SELECT COALESCE(SUM(COALESCE(actual_gas_cost_wei, max_gas_cost_wei)), 0)::numeric AS sum
          FROM core.user_operations
          WHERE policy_id = ${policy.id}
            AND status_id IN (${Prisma.join([
              UO_STATUS_SIGNED,
              UO_STATUS_EXECUTED,
              UO_STATUS_PENDING,
            ])})
        `,
      );

      const used = this.toBigInt(sumRows[0]?.sum);
      const budget = this.toBigInt(policy.max_budget_wei);
      const remaining = budget > used ? budget - used : 0n;

      if (estimatedMaxCostWei > remaining) {
        failures.push({
          type: 'BUDGET_EXCEEDED',
          policyId: policy.id,
          policyName: policy.name,
          required: this.formatWei(estimatedMaxCostWei),
          available: this.formatWei(remaining),
        });
        continue;
      }

      const ruleRows: TRuleRow[] = await this.prisma.$queryRaw<TRuleRow[]>(
        Prisma.sql`
          SELECT r.*
          FROM core.policy_rules r
          WHERE r.policy_id = ${policy.id}
            AND r.valid_from <= now()
            AND (r.valid_to IS NULL OR r.valid_to >= now())
          ORDER BY r.created_at ASC
        `,
      );

      if (ruleRows.length === 0) {
        selectedPolicy = policy;
        acceptedRule = null;
        break;
      }

      const rules: TRule[] = ruleRows.map((r) => ({
        id: r.id,
        policy_id: r.policy_id,
        metric_id: r.metric_id,
        comparator_id: r.comparator_id,
        interval_id: r.interval_id,
        scope_id: r.scope_id,
        value: typeof r.value === 'string' ? r.value : (r.value as Prisma.Decimal).toString(),
        token_address: r.token_address,
        token_decimals: r.token_decimals,
      }));

      const passing = await findPassingRule(rules, {
        prisma: this.prisma,
        sender: uo.sender,
        policyId: policy.id,
        chainId: chainIdBigInt,
        configService: this.configService,
      });

      if (passing) {
        selectedPolicy = policy;
        acceptedRule = passing;
        break;
      }

      failures.push({
        type: 'RULES_FAILED',
        policyId: policy.id,
        policyName: policy.name,
        failedRules: rules.map((r) => ({
          ruleId: r.id,
          metric: r.metric_id,
          reason: this.formatRuleFailure(r),
        })),
      });
    }

    if (!selectedPolicy) {
      const failureDetails = this.formatValidationFailures(failures);
      await this.prisma.userOperation.update({
        where: { id: created.id },
        data: {
          status_id: UO_STATUS_VALIDATION_FAILED,
          status_note: `Validation failed: ${failureDetails}`,
        },
      });
      throw new ForbiddenException({
        message: 'User operation validation failed',
        details: failures,
      });
    }

    // === 4. Build paymasterData ===
    const { paymasterData, validAfter, validUntil } = await this.signer.buildPaymasterData(
      chainIdBigInt,
      uo,
    );

    // === 5. Format output ===
    const cleanUserOperation: ResponseUserOperationDto = {
      sender: uo.sender,
      nonce: uo.nonce,
      callData: uo.callData,
      callGasLimit: uo.callGasLimit,
      verificationGasLimit: uo.verificationGasLimit,
      preVerificationGas: uo.preVerificationGas,
      maxFeePerGas: uo.maxFeePerGas,
      maxPriorityFeePerGas: uo.maxPriorityFeePerGas,
      paymaster: uo.paymaster,
      paymasterVerificationGasLimit: uo.paymasterVerificationGasLimit,
      paymasterPostOpGasLimit: uo.paymasterPostOpGasLimit,
      paymasterData,
    };

    // === 6. Calculate user operation hash ===
    const userOpHash = computeUserOpHashV07(
      cleanUserOperation,
      this.entryPointAddress,
      chainIdBigInt,
    );

    // === 7. Update with hash and validity timestamps ===
    const validFromDate = new Date(Number(validAfter) * 1000);
    const validToDate = new Date(Number(validUntil) * 1000);

    await this.prisma.userOperation.update({
      where: { id: created.id },
      data: {
        hash: userOpHash,
        status_id: UO_STATUS_SIGNED,
        status_note: 'Signed by paymaster',
        payload: cleanUserOperation as unknown as Prisma.JsonObject,
        valid_from: validFromDate,
        valid_to: validToDate,
      },
    });

    const response: SignUserOperationResponseDto = {
      userOperation: cleanUserOperation,
      selectedPolicy: { id: selectedPolicy.id, name: selectedPolicy.name },
      acceptedRule: acceptedRule
        ? {
            id: acceptedRule.id,
            metric_id: acceptedRule.metric_id,
            comparator_id: acceptedRule.comparator_id,
            interval_id: acceptedRule.interval_id,
            scope_id: acceptedRule.scope_id,
            value: acceptedRule.value,
          }
        : undefined,
      meta: { requestId, timestamp: nowIso },
    };

    return response;
  }

  private normalize(uo: RequestUserOperationDto): RequestUserOperationDto {
    return {
      ...uo,
      sender: uo.sender.toLowerCase(),
      paymaster: uo.paymaster.toLowerCase(),
      factoryData: uo.factoryData === '' ? '0x' : (uo.factoryData ?? '0x'),
    };
  }

  private estimateMaxCostWei(uo: RequestUserOperationDto): bigint {
    const preVerificationGas = BigInt(uo.preVerificationGas);
    const callGasLimit = BigInt(uo.callGasLimit);
    const verificationGasLimit = BigInt(uo.verificationGasLimit);
    const pv = BigInt(uo.paymasterVerificationGasLimit);
    const po = BigInt(uo.paymasterPostOpGasLimit);
    const maxFeePerGas = BigInt(uo.maxFeePerGas);
    return (preVerificationGas + callGasLimit + verificationGasLimit + pv + po) * maxFeePerGas;
  }

  private async logChange(
    userOperationId: bigint,
    field: string,
    oldVal: string | null,
    newVal: string,
  ): Promise<void> {
    await this.prisma.userOperationsLog.create({
      data: {
        user_operation_id: userOperationId,
        field_changed: field,
        old_value: oldVal,
        new_value: newVal,
      },
    });
  }

  private toBigInt(val: unknown): bigint {
    if (val === null || val === undefined) return 0n;
    if (typeof val === 'bigint') return val;
    if (typeof val === 'number') return BigInt(Math.trunc(val));
    const s = typeof val === 'string' ? val : (val as Prisma.Decimal).toString();
    return BigInt(s.split('.')[0] || '0');
  }

  private formatWei(wei: bigint): string {
    return `${(Number(wei) / 1e18).toFixed(6)} ETH (${wei.toString()} wei)`;
  }

  private formatRuleFailure(rule: TRule): string {
    const compMap: Record<string, string> = {
      LTE: '≤',
      LT: '<',
      GTE: '≥',
      GT: '>',
      EQ: '=',
      NEQ: '≠',
    };
    const intMap: Record<string, string> = {
      NOW: 'current',
      DAILY: 'last 24h',
      WEEKLY: 'last 7d',
      MONTHLY: 'last 30d',
      LIFETIME: 'lifetime',
    };
    return `${rule.metric_id} (${rule.scope_id}, ${
      intMap[rule.interval_id] || rule.interval_id
    }) must be ${compMap[rule.comparator_id] || rule.comparator_id} ${rule.value}`;
  }

  private formatValidationFailures(failures: TValidationFailureReason[]): string {
    return failures
      .map((f) =>
        f.type === 'BUDGET_EXCEEDED'
          ? `Policy "${f.policyName}": Budget exceeded (need ${f.required}, available ${f.available})`
          : `Policy "${f.policyName}": Rules failed - ${f.failedRules
              .map((r) => r.reason)
              .join('; ')}`,
      )
      .join(' | ');
  }
}
