import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@repo/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvVars } from './env-vars-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvVars,
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
