import { Test, TestingModule } from '@nestjs/testing';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { SiweAuthGuard } from '../auth/auth.guard';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyResponseDto } from './dto/policy-response.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

describe('PolicyController', () => {
  let controller: PolicyController;
  let service: PolicyService;

  const mockPolicyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPolicyResponse: PolicyResponseDto = {
    id: '1',
    name: 'policyName',
    paymaster_address: '0x1234567890123456789012345678901234567890',
    chain_id: '1',
    status_id: 'ACTIVE',
    max_budget_wei: '1000000000000000000',
    is_public: true,
    whitelisted_addresses: ['0x1234567890123456789012345678901234567890'],
    valid_from: '2025-01-01T00:00:00.000Z',
    valid_to: undefined,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
    chain: {
      id: '1',
      name: 'Ethereum Mainnet',
    },
    status: {
      id: 'ACTIVE',
      name: 'Active',
      description: 'Policy is active',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyController],
      providers: [
        {
          provide: PolicyService,
          useValue: mockPolicyService,
        },
      ],
    })
      .overrideGuard(SiweAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PolicyController>(PolicyController);
    service = module.get<PolicyService>(PolicyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy', async () => {
      const createDto: CreatePolicyDto = {
        chain_id: 1,
        name: 'policyName',
        status_id: 'ACTIVE',
        max_budget_wei: 1000000000000000000,
        is_public: true,
        whitelisted_addresses: ['0x1234567890123456789012345678901234567890'],
        valid_from: '2025-01-01T00:00:00Z',
        valid_to: '2025-12-31T23:59:59Z',
      };

      mockPolicyService.create.mockResolvedValue(mockPolicyResponse);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockPolicyResponse);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of policies', async () => {
      const policies = [mockPolicyResponse];
      mockPolicyService.findAll.mockResolvedValue(policies);

      const result = await controller.findAll();

      expect(result).toEqual(policies);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no policies exist', async () => {
      mockPolicyService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single policy by id', async () => {
      mockPolicyService.findOne.mockResolvedValue(mockPolicyResponse);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPolicyResponse);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a policy', async () => {
      const updateDto: UpdatePolicyDto = {
        max_budget_wei: 2000000000000000000,
      };

      const updatedPolicy = { ...mockPolicyResponse, max_budget_wei: '2000000000000000000' };
      mockPolicyService.update.mockResolvedValue(updatedPolicy);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedPolicy);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update policy status', async () => {
      const updateDto: UpdatePolicyDto = {
        status_id: 'INACTIVE',
      };

      const updatedPolicy = {
        ...mockPolicyResponse,
        status_id: 'INACTIVE',
        status: {
          id: 'INACTIVE',
          name: 'Inactive',
          description: 'Policy is inactive',
        },
      };
      mockPolicyService.update.mockResolvedValue(updatedPolicy);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedPolicy);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a policy', async () => {
      const deleteResponse = { message: 'Policy 1 has been successfully deleted' };
      mockPolicyService.remove.mockResolvedValue(deleteResponse);

      const result = await controller.remove(1);

      expect(result).toEqual(deleteResponse);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
