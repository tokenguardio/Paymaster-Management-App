import { Test, TestingModuleBuilder } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const service: PrismaService = new PrismaService();
  service.$connect = jest.fn();
  service.$disconnect = jest.fn();

  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: service }],
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect on module load and disconnect on module destroy', async () => {
    const connectSpy = jest.spyOn(service, '$connect');
    const disconnectSpy = jest.spyOn(service, '$disconnect');

    const module = await moduleBuilder.compile();
    await module.init();
    expect(connectSpy).toHaveBeenCalled();
    await module.close();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
