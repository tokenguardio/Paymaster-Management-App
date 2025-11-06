import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PolicyRuleController } from './policy-rule.controller';
import { PolicyRuleService } from './policy-rule.service';
import { SiweAuthGuard } from '../auth/auth.guard';
import { PolicyRuleResponseDto } from './dto/policy-rule-response.dto';

describe('PolicyRuleController', () => {
  let controller: PolicyRuleController;
  let service: PolicyRuleService;

  const mockPolicyRuleService = {
    findByPolicyId: jest.fn(),
  };

  const mockPolicyRuleResponse: PolicyRuleResponseDto = {
    id: '1',
    policy_id: '1',
    metric: {
      id: 'MAX_GAS_COST',
      name: 'Maximum Gas Cost',
      description: 'Maximum gas cost per operation',
    },
    comparator: {
      id: 'LESS_THAN',
      name: 'Less Than',
      description: 'Value must be less than threshold',
    },
    interval: {
      id: 'PER_DAY',
      name: 'Per Day',
      description: 'Daily interval',
    },
    scope: {
      id: 'GLOBAL',
      name: 'Global',
      description: 'Applies globally',
    },
    value: '1000000000000000000',
    token_address: '0x1234567890123456789012345678901234567890',
    valid_from: '2025-01-01T00:00:00.000Z',
    valid_to: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyRuleController],
      providers: [
        {
          provide: PolicyRuleService,
          useValue: mockPolicyRuleService,
        },
      ],
    })
      .overrideGuard(SiweAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PolicyRuleController>(PolicyRuleController);
    service = module.get<PolicyRuleService>(PolicyRuleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getByPolicyId', () => {
    it('should return an array of active policy rules when active=true', async () => {
      const policyId = 1;
      const rules = [mockPolicyRuleResponse];
      mockPolicyRuleService.findByPolicyId.mockResolvedValue(rules);

      const result = await controller.getByPolicyId(policyId, 'true');

      expect(result).toEqual(rules);
      expect(service.findByPolicyId).toHaveBeenCalledWith(policyId, true);
      expect(service.findByPolicyId).toHaveBeenCalledTimes(1);
    });

    it('should return all rules when active=false', async () => {
      const policyId = 1;
      const rules = [mockPolicyRuleResponse];
      mockPolicyRuleService.findByPolicyId.mockResolvedValue(rules);

      const result = await controller.getByPolicyId(policyId, 'false');

      expect(result).toEqual(rules);
      expect(service.findByPolicyId).toHaveBeenCalledWith(policyId, false);
    });

    it('should handle missing query param (defaults to active=false)', async () => {
      const policyId = 2;
      const rules = [mockPolicyRuleResponse];
      mockPolicyRuleService.findByPolicyId.mockResolvedValue(rules);

      const result = await controller.getByPolicyId(policyId);

      expect(result).toEqual(rules);
      expect(service.findByPolicyId).toHaveBeenCalledWith(policyId, false);
    });

    it('should return an empty array when policy has no rules', async () => {
      const policyId = 3;
      mockPolicyRuleService.findByPolicyId.mockResolvedValue([]);

      const result = await controller.getByPolicyId(policyId);

      expect(result).toEqual([]);
      expect(service.findByPolicyId).toHaveBeenCalledWith(policyId, false);
    });

    it('should throw NotFoundException when policy not found', async () => {
      const policyId = 999;
      mockPolicyRuleService.findByPolicyId.mockRejectedValue(
        new NotFoundException(`No rules found for policy ID ${policyId}`),
      );

      await expect(controller.getByPolicyId(policyId)).rejects.toThrow(NotFoundException);
      await expect(controller.getByPolicyId(policyId)).rejects.toThrow(
        `No rules found for policy ID ${policyId}`,
      );
      expect(service.findByPolicyId).toHaveBeenCalledWith(policyId, false);
    });
  });
});
