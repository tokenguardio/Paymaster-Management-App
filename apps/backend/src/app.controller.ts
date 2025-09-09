import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get('/')
  @Get('/health/live')
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health/ready')
  public async getReadiness(): Promise<{ status: string }> {
    return this.appService.checkDatabaseHealth();
  }
}
