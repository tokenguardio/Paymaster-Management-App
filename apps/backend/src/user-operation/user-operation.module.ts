import { Module } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';
import { UserOperationController } from './user-operation.controller';
import { UserOperationService } from './user-operation.service';

@Module({
  controllers: [UserOperationController],
  providers: [UserOperationService, PrismaService],
})
export class UserOperationModule {}
