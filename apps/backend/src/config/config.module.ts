import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaService } from '@repo/prisma';
import { ChainConfigService } from './chain-config.service';

@Module({
  imports: [NestConfigModule],
  providers: [ChainConfigService, PrismaService],
  exports: [ChainConfigService],
})
export class ConfigModule {}
