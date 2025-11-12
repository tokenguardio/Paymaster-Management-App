import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DailyUserOpsByStatusDto } from './dto/daily-user-ops-by-status.dto';
import { DailyUserOpsDto } from './dto/daily-user-ops.dto';

@Controller('analytics')
export class AnalyticsController {
  public constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('policy/:id/daily-user-ops')
  public async getDailyUserOps(@Param('id') id: string): Promise<DailyUserOpsDto[]> {
    let policyId: bigint;

    try {
      policyId = BigInt(id);
    } catch (e) {
      const errorDetails =
        e instanceof Error ? e.message : 'The provided value could not be converted.';

      throw new BadRequestException(`Invalid policy ID. Must be a number. Reason: ${errorDetails}`);
    }

    return this.analyticsService.getDailyUserOpsCountWithHolesFilled(policyId);
  }

  @Get('policy/:id/daily-user-ops-by-status')
  public async getDailyUserOpsByStatus(
    @Param('id') id: string,
  ): Promise<DailyUserOpsByStatusDto[]> {
    let policyId: bigint;

    try {
      policyId = BigInt(id);
    } catch (e) {
      const errorDetails =
        e instanceof Error ? e.message : 'The provided value could not be converted.';

      throw new BadRequestException(`Invalid policy ID. Must be a number. Reason: ${errorDetails}`);
    }

    return this.analyticsService.getDailyUserOpsCountByStatusWithHolesFilled(policyId);
  }
}
