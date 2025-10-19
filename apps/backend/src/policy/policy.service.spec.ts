import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { POLICY_STATUS } from '@repo/constants';
import { PrismaService } from '@repo/prisma';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;
  let prismaService: PrismaService;

  const mockPolicyData = {
    id: BigInt(1),
    paymaster_address: '0x1234567890123456789012345678901234567890',
    name: 'Test Policy',
    chain_id: BigInt(1),
    status_id: 'ACTIVE',
    max_budget_wei: BigInt('1000000000000000000'),
    is_public: true,
    whitelisted_addresses: ['0x1234567890123456789012345678901234567890'],
    valid_from: new Date('2025-01-01T00:00:00.000Z'),
    valid_to: null,
    created_at: new Date('2025-01-01T00:00:00.000Z'),
    updated_at: new Date('2025-01-01T00:00:00.000Z'),
    chain: {
      id: BigInt(1),
      name: 'Ethereum Mainnet',
      rpc_url: 'https://eth-mainnet.example.com',
      explorer_url: 'https://etherscan.io',
      created_at: new Date(),
      updated_at: new Date(),
    },
    status: {
      id: 'ACTIVE',
      name: 'Active',
      description: 'Policy is active',
      created_at: new Date(),
      updated_at: new Date(),
    },
  };

  const mockPrismaService = {
    policy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy', async () => {
      const createDto: CreatePolicyDto = {
        paymaster_address: '0x1234567890123456789012345678901234567890',
        name: 'Test Policy',
        chain_id: 1,
        status_id: 'ACTIVE',
        max_budget_wei: '1000000000000000000',
        is_public: true,
        whitelisted_addresses: ['0x1234567890123456789012345678901234567890'],
        valid_from: '2025-01-01T00:00:00Z',
      };

      // Mock the transaction callback
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          policy: {
            create: jest.fn().mockResolvedValue(mockPolicyData),
          },
        };
        return callback(mockTx);
      });

      const result = await service.create(createDto);

      expect(result).toEqual({
        id: '1',
        paymaster_address: '0x1234567890123456789012345678901234567890',
        name: 'Test Policy',
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
      });

      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of policies', async () => {
      mockPrismaService.policy.findMany.mockResolvedValue([mockPolicyData]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].paymaster_address).toBe('0x1234567890123456789012345678901234567890');
      expect(prismaService.policy.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          chain: true,
          status: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('should return an empty array when no policies exist', async () => {
      mockPrismaService.policy.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single policy by id', async () => {
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicyData);

      const result = await service.findOne(1);

      expect(result.id).toBe('1');
      expect(result.paymaster_address).toBe('0x1234567890123456789012345678901234567890');
      expect(prismaService.policy.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        include: { chain: true, status: true },
      });
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrismaService.policy.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Policy with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update a policy', async () => {
      const updateDto: UpdatePolicyDto = {
        max_budget_wei: '2000000000000000000',
      };

      const updatedPolicyData = {
        ...mockPolicyData,
        max_budget_wei: BigInt('2000000000000000000'),
      };

      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicyData);
      mockPrismaService.policy.update.mockResolvedValue(updatedPolicyData);

      const result = await service.update(1, updateDto);

      expect(result.max_budget_wei).toBe('2000000000000000000');
      expect(prismaService.policy.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
      });
      expect(prismaService.policy.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: {
          max_budget_wei: '2000000000000000000',
        },
        include: {
          chain: true,
          status: true,
        },
      });
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrismaService.policy.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { max_budget_wei: '2000000000000000000' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, { max_budget_wei: '2000000000000000000' })).rejects.toThrow(
        'Policy with ID 999 not found',
      );
    });

    it('should update policy status', async () => {
      const updateDto: UpdatePolicyDto = {
        status_id: 'INACTIVE',
      };

      const updatedPolicyData = {
        ...mockPolicyData,
        status_id: 'INACTIVE',
        status: {
          id: 'INACTIVE',
          name: 'Inactive',
          description: 'Policy is inactive',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };

      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicyData);
      mockPrismaService.policy.update.mockResolvedValue(updatedPolicyData);

      const result = await service.update(1, updateDto);

      expect(result.status_id).toBe('INACTIVE');
      expect(result.status?.name).toBe('Inactive');
    });
  });

  describe('remove', () => {
    it('should soft delete a policy', async () => {
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicyData);
      mockPrismaService.policy.update.mockResolvedValue({
        ...mockPolicyData,
        status_id: 'INACTIVE',
        valid_to: new Date(),
      });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Policy 1 has been successfully deleted' });
      expect(prismaService.policy.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
      });
      expect(prismaService.policy.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: {
          status_id: POLICY_STATUS.INACTIVE.id,
          valid_to: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrismaService.policy.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Policy with ID 999 not found');
    });
  });
});
