import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@repo/prisma';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return healthy status when database is accessible', async () => {
      (prismaService.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.checkDatabaseHealth();
      expect(result).toEqual({ status: 'healthy' });
    });

    it('should throw an error when database is not accessible', async () => {
      const errorMessage = 'Connection refused';
      (prismaService.$queryRaw as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(service.checkDatabaseHealth()).rejects.toThrow(
        `Database health check failed: ${errorMessage}`,
      );
    });
  });
});
