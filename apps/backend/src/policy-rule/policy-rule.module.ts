import { Module } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';
import { PolicyRuleController } from './policy-rule.controller';
import { PolicyRuleService } from './policy-rule.service';

@Module({
  controllers: [PolicyRuleController],
  providers: [PolicyRuleService, PrismaService],
})
export class PolicyRuleModule {}
