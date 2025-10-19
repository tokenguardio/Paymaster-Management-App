import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';
import { PolicyRuleResponseDto } from './dto/policy-rule-response.dto';

@Injectable()
export class PolicyRuleService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByPolicyId(policyId: number): Promise<PolicyRuleResponseDto[]> {
    const rules = await this.prisma.policyRule.findMany({
      where: { policy_id: BigInt(policyId) },
      include: {
        metric: true,
        comparator: true,
        interval: true,
        scope: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (rules.length === 0) {
      throw new NotFoundException(`No rules found for policy ID ${policyId}`);
    }

    return rules.map((r) => ({
      id: r.id.toString(),
      policy_id: r.policy_id.toString(),
      metric: r.metric,
      comparator: r.comparator,
      interval: r.interval,
      scope: r.scope,
      value: r.value.toString(),
      token_address: r.token_address,
      valid_from: r.valid_from.toISOString(),
      valid_to: r.valid_to?.toISOString() ?? null,
      created_at: r.created_at.toISOString(),
      updated_at: r.updated_at.toISOString(),
    }));
  }
}
