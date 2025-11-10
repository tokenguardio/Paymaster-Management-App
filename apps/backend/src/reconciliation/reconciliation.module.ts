import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '@repo/prisma';
import { ReconciliationService } from './reconciliation.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [NestConfigModule, ScheduleModule.forRoot(), ConfigModule],
  providers: [ReconciliationService, PrismaService],
})
export class ReconciliationModule {}
