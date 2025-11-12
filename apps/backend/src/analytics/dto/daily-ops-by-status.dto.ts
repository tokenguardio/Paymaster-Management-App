export class DailyOpsByStatusDto {
  /**
   * The date for the data point.
   * @example '2025-11-12'
   */
  public date!: string;

  /**
   * The name of the status.
   * @example 'success'
   */
  public status!: string;

  /**
   * The total count of operations for that date and status.
   * @example 3
   */
  public count!: number;
}
