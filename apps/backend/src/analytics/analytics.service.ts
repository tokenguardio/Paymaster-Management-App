import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';
import { DailyOpsByStatusDto } from './dto/daily-ops-by-status.dto';
import { DailyOpsDto } from './dto/daily-ops.dto';

interface IDailyOpsResult {
  date: Date;
  count: bigint;
}

interface IDailyOpsByStatusResult {
  date: Date;
  status: string;
  count: bigint;
}

@Injectable()
export class AnalyticsService {
  public constructor(private prisma: PrismaService) {}

  /**
   * Gets the daily count of user operations for a policy,
   * filling in '0' for days with no operations.
   */
  public async getDailyOpsCountWithHolesFilled(policyId: bigint): Promise<DailyOpsDto[]> {
    // First, check if the policy actually exists
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
      select: { created_at: true },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    const result: IDailyOpsResult[] = await this.prisma.$queryRaw`
      WITH date_series AS (
        -- Generate a series of all days from policy creation until today
        SELECT generate_series(
          ${policy.created_at}::date,
          CURRENT_DATE,
          '1 day'::interval
        ) AS "date"
      )
      
      SELECT
        ds."date",
        COALESCE(COUNT(uo."id"), 0) AS "count"
      FROM date_series AS ds
        LEFT JOIN "core"."user_operations" AS uo 
          ON DATE(uo."created_at") = ds."date" 
            AND uo."policy_id" = ${policyId}
      GROUP BY 
        ds."date"
      ORDER BY 
        ds."date" ASC;
    `;

    // Convert BigInt to Number for a JSON-friendly response
    return result.map((row) => ({
      date: row.date.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
      count: Number(row.count),
    }));
  }

  /**
   * Gets the daily count of user operations by status for a policy,
   * filling in '0' for missing date/status combinations.
   */
  public async getDailyOpsCountByStatusWithHolesFilled(
    policyId: bigint,
  ): Promise<DailyOpsByStatusDto[]> {
    // First, check if the policy actually exists
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
      select: { created_at: true },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    const result: IDailyOpsByStatusResult[] = await this.prisma.$queryRaw`
      WITH date_series AS (
        SELECT generate_series(
          ${policy.created_at}::date,
          CURRENT_DATE,
          '1 day'::interval
        ) AS "date"
      ),
      all_statuses AS (
        SELECT 
          "id", 
          "name" 
        FROM "core"."user_operation_statuses"
      ),
      date_status_grid AS (
        SELECT
          ds."date",
          s."id" AS "status_id",
          s."name" AS "status_name"
        FROM date_series ds
        CROSS JOIN all_statuses s
      )
      
      SELECT
        grid."date",
        grid."status_name" AS "status",
        COALESCE(COUNT(uo."id"), 0) AS "count"
      FROM date_status_grid AS grid
        LEFT JOIN "core"."user_operations" AS uo ON 
          DATE(uo."created_at") = grid."date"
            AND uo."status_id" = grid."status_id"
            AND uo."policy_id" = ${policyId}
      GROUP BY 
        grid."date", 
        grid."status_name"
      ORDER BY 
        grid."date" ASC, 
        grid."status_name" ASC;
    `;

    // Convert BigInt to Number for a JSON-friendly response
    return result.map((row) => ({
      date: row.date.toISOString().split('T')[0], // 'YYYY-MM-DD'
      status: row.status,
      count: Number(row.count),
    }));
  }
}
