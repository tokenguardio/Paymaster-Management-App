import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@repo/prisma';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;

  const mockPrismaService = {
    policy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
