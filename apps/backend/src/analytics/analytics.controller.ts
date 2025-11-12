import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DailyOpsByStatusDto } from './dto/daily-ops-by-status.dto';
import { DailyOpsDto } from './dto/daily-ops.dto';

@Controller('analytics')
export class AnalyticsController {
  public constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('policy/:id/daily-ops')
  public async getDailyOps(@Param('id') id: string): Promise<DailyOpsDto[]> {
    let policyId: bigint;

    try {
      policyId = BigInt(id);
    } catch (e) {
      const errorDetails =
        e instanceof Error ? e.message : 'The provided value could not be converted.';

      throw new BadRequestException(`Invalid policy ID. Must be a number. Reason: ${errorDetails}`);
    }

    return this.analyticsService.getDailyOpsCountWithHolesFilled(policyId);
  }

  @Get('policy/:id/daily-ops-by-status')
  public async getDailyOpsByStatus(@Param('id') id: string): Promise<DailyOpsByStatusDto[]> {
    let policyId: bigint;

    try {
      policyId = BigInt(id);
    } catch (e) {
      const errorDetails =
        e instanceof Error ? e.message : 'The provided value could not be converted.';

      throw new BadRequestException(`Invalid policy ID. Must be a number. Reason: ${errorDetails}`);
    }

    return this.analyticsService.getDailyOpsCountByStatusWithHolesFilled(policyId);
  }
}
