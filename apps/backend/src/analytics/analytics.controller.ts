import { Controller, Get, Param, BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { DailyUserOpsByStatusDto } from './dto/daily-user-ops-by-status.dto';
import { DailyUserOpsDto } from './dto/daily-user-ops.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  public constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('policy/:id/daily-user-ops')
  @ApiOperation({ summary: 'Get daily user operation count for a policy' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier (BigInt) of the policy, as a string.',
    example: '123',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'An array of daily user operation counts.',
    type: [DailyUserOpsDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid policy ID format',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Policy not found',
  })
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
  @ApiOperation({
    summary: 'Get daily user operation count by status for a policy',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier (BigInt) of the policy, as a string.',
    example: '123',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'An array of daily user operation counts grouped by status.',
    type: [DailyUserOpsByStatusDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid policy ID format',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Policy not found',
  })
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
