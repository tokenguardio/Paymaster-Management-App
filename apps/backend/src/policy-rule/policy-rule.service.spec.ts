import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@repo/prisma';
import { PolicyRuleService } from './policy-rule.service';

describe('PolicyRuleService', () => {
  let service: PolicyRuleService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    policyRule: {
      findMany: jest.fn(),
    },
  };

  const mockPolicyRuleData = {
    id: BigInt(1),
    policy_id: BigInt(1),
    metric_id: 'MAX_GAS_COST',
    comparator_id: 'LESS_THAN',
    interval_id: 'PER_DAY',
    scope_id: 'GLOBAL',
    value: '1000000000000000000',
    token_address: '0x1234567890123456789012345678901234567890',
    valid_from: new Date('2025-01-01T00:00:00.000Z'),
    valid_to: null,
    created_at: new Date('2025-01-01T00:00:00.000Z'),
    updated_at: new Date('2025-01-01T00:00:00.000Z'),
    metric: {
      id: 'MAX_GAS_COST',
      name: 'Maximum Gas Cost',
      description: 'Maximum gas cost per operation',
      created_at: new Date(),
      updated_at: new Date(),
    },
    comparator: {
      id: 'LESS_THAN',
      name: 'Less Than',
      description: 'Value must be less than threshold',
      created_at: new Date(),
      updated_at: new Date(),
    },
    interval: {
      id: 'PER_DAY',
      name: 'Per Day',
      description: 'Daily interval',
      created_at: new Date(),
      updated_at: new Date(),
    },
    scope: {
      id: 'GLOBAL',
      name: 'Global',
      description: 'Applies globally',
      created_at: new Date(),
      updated_at: new Date(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyRuleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PolicyRuleService>(PolicyRuleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPolicyId', () => {
    it('should return policy rules for a given policy ID', async () => {
      const policyId = 1;
      mockPrismaService.policyRule.findMany.mockResolvedValue([mockPolicyRuleData]);

      const result = await service.findByPolicyId(policyId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        policy_id: '1',
        metric: mockPolicyRuleData.metric,
        comparator: mockPolicyRuleData.comparator,
        interval: mockPolicyRuleData.interval,
        scope: mockPolicyRuleData.scope,
        value: '1000000000000000000',
        token_address: '0x1234567890123456789012345678901234567890',
        valid_from: '2025-01-01T00:00:00.000Z',
        valid_to: null,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z',
      });

      expect(prismaService.policyRule.findMany).toHaveBeenCalledWith({
        where: { policy_id: BigInt(policyId) },
        include: {
          metric: true,
          comparator: true,
          interval: true,
          scope: true,
        },
        orderBy: { created_at: 'desc' },
      });
    });

    it('should return multiple policy rules', async () => {
      const policyId = 1;
      const secondRule = {
        ...mockPolicyRuleData,
        id: BigInt(2),
        metric_id: 'TRANSACTION_COUNT',
        metric: {
          id: 'TRANSACTION_COUNT',
          name: 'Transaction Count',
          description: 'Maximum number of transactions',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };

      mockPrismaService.policyRule.findMany.mockResolvedValue([mockPolicyRuleData, secondRule]);

      const result = await service.findByPolicyId(policyId);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[1].metric.name).toBe('Transaction Count');
    });

    it('should handle rules with valid_to date', async () => {
      const policyId = 1;
      const ruleWithValidTo = {
        ...mockPolicyRuleData,
        valid_to: new Date('2025-12-31T23:59:59.000Z'),
      };

      mockPrismaService.policyRule.findMany.mockResolvedValue([ruleWithValidTo]);

      const result = await service.findByPolicyId(policyId);

      expect(result[0].valid_to).toBe('2025-12-31T23:59:59.000Z');
    });

    it('should handle rules without token_address', async () => {
      const policyId = 1;
      const ruleWithoutToken = {
        ...mockPolicyRuleData,
        token_address: null,
      };

      mockPrismaService.policyRule.findMany.mockResolvedValue([ruleWithoutToken]);

      const result = await service.findByPolicyId(policyId);

      expect(result[0].token_address).toBeNull();
    });

    it('should throw NotFoundException when no rules found', async () => {
      const policyId = 999;
      mockPrismaService.policyRule.findMany.mockResolvedValue([]);

      await expect(service.findByPolicyId(policyId)).rejects.toThrow(NotFoundException);
      await expect(service.findByPolicyId(policyId)).rejects.toThrow(
        `No rules found for policy ID ${policyId}`,
      );
    });

    it('should convert BigInt IDs to strings', async () => {
      const policyId = 123;
      const ruleWithLargeId = {
        ...mockPolicyRuleData,
        id: BigInt(999999999999),
        policy_id: BigInt(123),
      };

      mockPrismaService.policyRule.findMany.mockResolvedValue([ruleWithLargeId]);

      const result = await service.findByPolicyId(policyId);

      expect(result[0].id).toBe('999999999999');
      expect(result[0].policy_id).toBe('123');
      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].policy_id).toBe('string');
    });

    it('should convert Decimal value to string', async () => {
      const policyId = 1;
      const ruleWithDecimal = {
        ...mockPolicyRuleData,
        value: '12345.6789',
      };

      mockPrismaService.policyRule.findMany.mockResolvedValue([ruleWithDecimal]);

      const result = await service.findByPolicyId(policyId);

      expect(result[0].value).toBe('12345.6789');
      expect(typeof result[0].value).toBe('string');
    });

    it('should order results by created_at desc', async () => {
      const policyId = 1;
      mockPrismaService.policyRule.findMany.mockResolvedValue([mockPolicyRuleData]);

      await service.findByPolicyId(policyId);

      expect(prismaService.policyRule.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { created_at: 'desc' },
        }),
      );
    });
  });
});
