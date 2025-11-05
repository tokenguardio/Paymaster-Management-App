import { ConfigService } from '@nestjs/config';
import { PrismaService, Prisma } from '@repo/prisma';
import { getRpcUrlForChain } from './rule-engine.utils';

/**
 * Configuration interface for rule evaluation context.
 */
export interface IRuleEvaluationConfig {
  rpcUrl: string;
}

export type TRule = {
  id: number;
  policy_id: number;
  metric_id: string;
  comparator_id: string;
  interval_id: string;
  scope_id: string;
  value: string; // numeric as string
  token_address?: string; // Required for TOKEN_BALANCE metric
  token_decimals?: number; // Required for TOKEN_BALANCE metric
};

export type TRuleCheckContext = {
  prisma: PrismaService;
  sender: string;
  policyId: number;
  chainId: bigint; // Required for TOKEN_BALANCE metric
  configService: ConfigService; // Required for TOKEN_BALANCE metric
};

const STATUS_SIGNED = 'SIGNED';
const STATUS_EXECUTED = 'EXECUTED';
const STATUS_PENDING = 'PENDING';

/**
 * Maps policy rule comparators to SQL comparison operators.
 * Note: Inverted logic - we're checking for violations (when rule fails).
 * Example: If rule is "LTE 100" (value should be ≤ 100), we check "value > 100" for violations.
 */
function comparatorToSqlSign(comparator: string): '>=' | '>' | '=' | '!=' | '<' | '<=' {
  switch (comparator) {
    case 'LTE':
      return '>';
    case 'LT':
      return '>=';
    case 'GTE':
      return '<';
    case 'GT':
      return '<=';
    case 'EQ':
      return '!=';
    case 'NEQ':
      return '=';
    default:
      throw new Error(`Unknown comparator: ${comparator}`);
  }
}

/**
 * Returns SQL date_trunc parameter based on interval.
 */
function getDateTruncPart(intervalId: string): string {
  switch (intervalId) {
    case 'DAILY':
      return 'day';
    case 'WEEKLY':
      return 'week';
    case 'MONTHLY':
      return 'month';
    case 'LIFETIME':
    case 'NOW':
      return 'day'; // Not used for LIFETIME/NOW, but provide default
    default:
      throw new Error(`Unknown interval: ${intervalId}`);
  }
}

/**
 * Builds SQL time filter based on interval.
 */
function buildTimeFilter(intervalId: string): Prisma.Sql | null {
  switch (intervalId) {
    case 'DAILY':
      return Prisma.sql`AND uo.created_at >= NOW() - INTERVAL '24 hours'`;
    case 'WEEKLY':
      return Prisma.sql`AND uo.created_at >= NOW() - INTERVAL '7 days'`;
    case 'MONTHLY':
      return Prisma.sql`AND uo.created_at >= NOW() - INTERVAL '1 month'`;
    case 'LIFETIME':
      return null; // No time filter
    case 'NOW':
      return null; // Used for current state checks (e.g., token balance)
    default:
      throw new Error(`Unknown interval: ${intervalId}`);
  }
}

/**
 * Evaluates all rules and returns the first one that fails (passes evaluation).
 * Returns null if all rules fail (no violation found).
 */
export async function findPassingRule(
  rules: TRule[],
  ctx: TRuleCheckContext,
): Promise<TRule | null> {
  for (const rule of rules) {
    const ok = await evaluateRule(rule, ctx);
    if (ok) return rule;
  }
  return null;
}

/**
 * Evaluates a single rule.
 * Returns true if the rule passes (no violation found).
 * Returns false if the rule fails (violation found).
 */
async function evaluateRule(rule: TRule, ctx: TRuleCheckContext): Promise<boolean> {
  const { metric_id, scope_id, interval_id } = rule;

  // Route to appropriate evaluator based on metric and scope
  if (metric_id === 'GAS_SPENT_WEI') {
    if (scope_id === 'USER_OPERATION') {
      return evaluateGasSpentUserOperation(rule, ctx);
    } else if (scope_id === 'WALLET') {
      return evaluateGasSpentWallet(rule, ctx);
    } else if (scope_id === 'POLICY') {
      return evaluateGasSpentPolicy(rule, ctx);
    }
  } else if (metric_id === 'TRANSACTION_COUNT') {
    if (scope_id === 'WALLET') {
      return evaluateTransactionCountWallet(rule, ctx);
    } else if (scope_id === 'POLICY') {
      return evaluateTransactionCountPolicy(rule, ctx);
    }
  } else if (metric_id === 'TOKEN_BALANCE') {
    if (scope_id === 'WALLET' && interval_id === 'NOW') {
      return evaluateTokenBalanceWallet(rule, ctx);
    }
  }

  throw new Error(
    `Unsupported rule combination: metric=${metric_id}, scope=${scope_id}, interval=${interval_id}`,
  );
}

/**
 * GAS_SPENT_WEI - USER_OPERATION scope
 * Checks cumulative gas spent per user operation within the specified interval.
 * Uses COALESCE(actual_gas_cost_wei, max_gas_cost_wei) to calculate total gas.
 *
 * NOTE: Includes PENDING operations to ensure the limit won't be crossed after
 * the current operation completes.
 */
async function evaluateGasSpentUserOperation(
  rule: TRule,
  ctx: TRuleCheckContext,
): Promise<boolean> {
  const { prisma, sender, policyId } = ctx;
  const op = comparatorToSqlSign(rule.comparator_id);
  const value = Number(rule.value);
  const timeFilter = buildTimeFilter(rule.interval_id);

  // For rolling intervals (DAILY, WEEKLY, MONTHLY), check if ANY individual operation violated
  if (rule.interval_id !== 'LIFETIME' && rule.interval_id !== 'NOW') {
    const rows = await prisma.$queryRaw<Array<{ gas_cost: bigint }>>(
      Prisma.sql`
        SELECT COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)::bigint AS gas_cost
        FROM core.user_operations uo
        WHERE uo.sender_address = ${sender}
          AND uo.policy_id = ${policyId}
          AND uo.status_id IN (${Prisma.join([STATUS_SIGNED, STATUS_EXECUTED, STATUS_PENDING])})
          ${timeFilter ? timeFilter : Prisma.empty}
          AND COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0) ${Prisma.raw(op)} ${value}
        LIMIT 1
      `,
    );

    return rows.length === 0;
  }

  // For LIFETIME, check if ANY operation ever violated
  const rows = await prisma.$queryRaw<Array<{ gas_cost: bigint }>>(
    Prisma.sql`
      SELECT COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)::bigint AS gas_cost
      FROM core.user_operations uo
      WHERE uo.sender_address = ${sender}
        AND uo.policy_id = ${policyId}
        AND uo.status_id IN (${Prisma.join([STATUS_SIGNED, STATUS_EXECUTED, STATUS_PENDING])})
        AND COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0) ${Prisma.raw(op)} ${value}
      LIMIT 1
    `,
  );

  return rows.length === 0;
}

/**
 * GAS_SPENT_WEI - WALLET scope
 * Checks cumulative gas spent by a wallet within the specified interval.
 * Uses COALESCE(actual_gas_cost_wei, max_gas_cost_wei) to calculate total gas.
 *
 * NOTE: Includes PENDING operations to ensure the limit won't be crossed after
 * the current operation completes.
 */
async function evaluateGasSpentWallet(rule: TRule, ctx: TRuleCheckContext): Promise<boolean> {
  const { prisma, sender, policyId } = ctx;
  const op = comparatorToSqlSign(rule.comparator_id);
  const value = Number(rule.value);
  const timeFilter = buildTimeFilter(rule.interval_id);

  const rows = await prisma.$queryRaw<Array<{ total: bigint }>>(
    Prisma.sql`
      SELECT COALESCE(SUM(COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)), 0)::bigint AS total
      FROM core.user_operations uo
      WHERE uo.sender_address = ${sender}
        AND uo.policy_id = ${policyId}
        AND uo.status_id IN (${Prisma.join([STATUS_SIGNED, STATUS_EXECUTED, STATUS_PENDING])})
        ${timeFilter ? timeFilter : Prisma.empty}
      HAVING COALESCE(SUM(COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)), 0) ${Prisma.raw(op)} ${value}
    `,
  );

  return rows.length === 0;
}

/**
 * GAS_SPENT_WEI - POLICY scope
 * Checks cumulative gas spent across all wallets in a policy within the specified interval.
 * Uses COALESCE(actual_gas_cost_wei, max_gas_cost_wei) to calculate total gas.
 *
 * NOTE: Includes PENDING operations to ensure the limit won't be crossed after
 * the current operation completes.
 */
async function evaluateGasSpentPolicy(rule: TRule, ctx: TRuleCheckContext): Promise<boolean> {
  const { prisma, policyId } = ctx;
  const op = comparatorToSqlSign(rule.comparator_id);
  const value = Number(rule.value);
  const timeFilter = buildTimeFilter(rule.interval_id);

  const rows = await prisma.$queryRaw<Array<{ total: bigint }>>(
    Prisma.sql`
      SELECT COALESCE(SUM(COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)), 0)::bigint AS total
      FROM core.user_operations uo
      WHERE uo.policy_id = ${policyId}
        AND uo.status_id IN (${Prisma.join([STATUS_SIGNED, STATUS_EXECUTED, STATUS_PENDING])})
        ${timeFilter ? timeFilter : Prisma.empty}
      HAVING COALESCE(SUM(COALESCE(uo.actual_gas_cost_wei, uo.max_gas_cost_wei, 0)), 0) ${Prisma.raw(op)} ${value}
    `,
  );

  return rows.length === 0;
}

/**
 * TRANSACTION_COUNT - WALLET scope
 * Checks transaction count for a wallet within the specified interval.
 */
async function evaluateTransactionCountWallet(
  rule: TRule,
  ctx: TRuleCheckContext,
): Promise<boolean> {
  const { prisma, sender, policyId } = ctx;
  const op = comparatorToSqlSign(rule.comparator_id);
  const value = Number(rule.value);
  const timeFilter = buildTimeFilter(rule.interval_id);

  // For rolling intervals (DAILY, WEEKLY, MONTHLY), check if ANY period violated the threshold
  if (rule.interval_id !== 'LIFETIME') {
    const dateTrunc = getDateTruncPart(rule.interval_id);

    const rows = await prisma.$queryRaw<Array<{ count: bigint }>>(
      Prisma.sql`
        SELECT COUNT(*)::bigint AS count
        FROM core.user_operations uo
        WHERE uo.sender_address = ${sender}
          AND uo.policy_id = ${policyId}
          AND uo.status_id IN (${Prisma.join([STATUS_PENDING, STATUS_SIGNED, STATUS_EXECUTED])})
          ${timeFilter ? timeFilter : Prisma.empty}
        GROUP BY date_trunc(${dateTrunc}, uo.created_at AT TIME ZONE 'UTC')
        HAVING COUNT(*) ${Prisma.raw(op)} ${value}
        LIMIT 1
      `,
    );

    return rows.length === 0;
  }

  // For LIFETIME, check total count
  const rows = await prisma.$queryRaw<Array<{ count: bigint }>>(
    Prisma.sql`
      SELECT COUNT(*)::bigint AS count
      FROM core.user_operations uo
      WHERE uo.sender_address = ${sender}
        AND uo.policy_id = ${policyId}
        AND uo.status_id IN (${Prisma.join([STATUS_PENDING, STATUS_SIGNED, STATUS_EXECUTED])})
      HAVING COUNT(*) ${Prisma.raw(op)} ${value}
    `,
  );

  return rows.length === 0;
}

/**
 * TRANSACTION_COUNT - POLICY scope
 * Checks transaction count across all wallets in a policy within the specified interval.
 */
async function evaluateTransactionCountPolicy(
  rule: TRule,
  ctx: TRuleCheckContext,
): Promise<boolean> {
  const { prisma, policyId } = ctx;
  const op = comparatorToSqlSign(rule.comparator_id);
  const value = Number(rule.value);
  const timeFilter = buildTimeFilter(rule.interval_id);

  // For rolling intervals, check if ANY period violated the threshold
  if (rule.interval_id !== 'LIFETIME') {
    const dateTrunc = getDateTruncPart(rule.interval_id);

    const rows = await prisma.$queryRaw<Array<{ count: bigint }>>(
      Prisma.sql`
        SELECT COUNT(*)::bigint AS count
        FROM core.user_operations uo
        WHERE uo.policy_id = ${policyId}
          AND uo.status_id IN (${Prisma.join([STATUS_PENDING, STATUS_SIGNED, STATUS_EXECUTED])})
          ${timeFilter ? timeFilter : Prisma.empty}
        GROUP BY date_trunc(${dateTrunc}, uo.created_at AT TIME ZONE 'UTC')
        HAVING COUNT(*) ${Prisma.raw(op)} ${value}
        LIMIT 1
      `,
    );

    return rows.length === 0;
  }

  // For LIFETIME, check total count
  const rows = await prisma.$queryRaw<Array<{ count: bigint }>>(
    Prisma.sql`
      SELECT COUNT(*)::bigint AS count
      FROM core.user_operations uo
      WHERE uo.policy_id = ${policyId}
        AND uo.status_id IN (${Prisma.join([STATUS_PENDING, STATUS_SIGNED, STATUS_EXECUTED])})
      HAVING COUNT(*) ${Prisma.raw(op)} ${value}
    `,
  );

  return rows.length === 0;
}

/**
 * TOKEN_BALANCE - WALLET scope (NOW interval only)
 * Checks the current token balance of a wallet against the threshold.
 * Fetches live balance from blockchain using RPC endpoint.
 */
async function evaluateTokenBalanceWallet(rule: TRule, ctx: TRuleCheckContext): Promise<boolean> {
  const { sender, chainId, configService } = ctx;

  if (!rule.token_address) {
    throw new Error('token_address is required for TOKEN_BALANCE metric');
  }

  if (!chainId) {
    throw new Error('chainId is required in context for TOKEN_BALANCE metric');
  }

  if (!configService) {
    throw new Error('configService is required in context for TOKEN_BALANCE metric');
  }

  try {
    // Get the appropriate RPC URL based on chain ID
    const rpcUrl = getRpcUrlForChain(chainId, configService);

    // Fetch token balance from blockchain
    const balance = await getTokenBalance(sender, rule.token_address, rpcUrl);

    const op = comparatorToSqlSign(rule.comparator_id);
    const threshold = BigInt(rule.value);

    // Check if balance violates the threshold (inverted logic)
    switch (op) {
      case '>':
        return balance <= threshold;
      case '>=':
        return balance < threshold;
      case '<':
        return balance >= threshold;
      case '<=':
        return balance > threshold;
      case '=':
        return balance !== threshold;
      case '!=':
        return balance === threshold;
      default:
        return true;
    }
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw new Error(
      `Failed to fetch token balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Fetches ERC20 token balance for a given wallet address.
 * Uses the standard ERC20 balanceOf function.
 */
async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  rpcUrl: string,
): Promise<bigint> {
  // ERC20 balanceOf function signature: balanceOf(address)
  // Function selector: 0x70a08231
  const functionSelector = '0x70a08231';

  // Encode the wallet address parameter (pad to 32 bytes)
  const paddedAddress = walletAddress.toLowerCase().replace('0x', '').padStart(64, '0');
  const data = functionSelector + paddedAddress;

  // Make RPC call
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: data,
        },
        'latest',
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(`RPC error: ${result.error.message}`);
  }

  if (!result.result || result.result === '0x') {
    // No balance or invalid token
    return 0n;
  }

  // Parse hex string to bigint
  return BigInt(result.result);
}
