import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class PolicyRuleService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByPolicyId(policyId: number): Promise<
    {
      id: string;
      policy_id: string;
      metric: { id: string; name: string; description: string | null };
      comparator: { id: string; name: string; description: string | null };
      interval: { id: string; name: string; description: string | null };
      scope: { id: string; name: string; description: string | null };
      value: string;
      token_address: string | null;
      valid_from: string;
      valid_to: string | null;
      created_at: string;
      updated_at: string;
    }[]
  > {
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
      metric: {
        id: r.metric.id,
        name: r.metric.name,
        description: r.metric.description,
      },
      comparator: {
        id: r.comparator.id,
        name: r.comparator.name,
        description: r.comparator.description,
      },
      interval: {
        id: r.interval.id,
        name: r.interval.name,
        description: r.interval.description,
      },
      scope: {
        id: r.scope.id,
        name: r.scope.name,
        description: r.scope.description,
      },
      value: r.value.toString(),
      token_address: r.token_address,
      valid_from: r.valid_from.toISOString(),
      valid_to: r.valid_to?.toISOString() ?? null,
      created_at: r.created_at.toISOString(),
      updated_at: r.updated_at.toISOString(),
    }));
  }
}
