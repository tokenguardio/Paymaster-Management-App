import { ApiProperty } from '@nestjs/swagger';

export class DailyUserOpsDto {
  @ApiProperty({
    description: 'The date for the data point.',
    example: '2025-11-12',
  })
  public date!: string;

  @ApiProperty({
    description: 'The total count of operations for that date.',
    example: 5,
  })
  public count!: number;
}
