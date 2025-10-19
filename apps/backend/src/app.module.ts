import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@repo/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvVars } from './env-vars-validation';
import { PolicyModule } from './policy/policy.module';
import { PolicyRuleModule } from './policy-rule/policy-rule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvVars,
      isGlobal: true,
    }),
    PrismaModule,
    PolicyModule,
    PolicyRuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
