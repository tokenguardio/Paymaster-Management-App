import { Global, Module } from '@nestjs/common';
import { SiweController } from './siwe.controller';
import { SiweService } from './siwe.service';

@Global()
@Module({
  controllers: [SiweController],
  providers: [SiweService],
  exports: [SiweService],
})
export class SiweModule {}
