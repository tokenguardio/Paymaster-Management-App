// In src/analytics/dto/daily-ops.dto.ts

export class DailyOpsDto {
  /**
   * The date for the data point.
   * @example '2025-11-12'
   */
  public date!: string;

  /**
   * The total count of operations for that date.
   * @example 5
   */
  public count!: number;
}
