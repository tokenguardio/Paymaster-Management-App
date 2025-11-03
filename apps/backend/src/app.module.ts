import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@repo/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvVars } from './env-vars-validation';
import { PolicyModule } from './policy/policy.module';
import { PolicyRuleModule } from './policy-rule/policy-rule.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { SiweModule } from './siwe/siwe.module';
import { UserOperationModule } from './user-operation/user-operation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvVars,
      isGlobal: true,
    }),
    PrismaModule,
    PolicyModule,
    SiweModule,
    PolicyRuleModule,
    UserOperationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
