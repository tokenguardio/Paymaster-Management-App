import { ApiProperty } from '@nestjs/swagger';

export class DailyUserOpsByStatusDto {
  @ApiProperty({
    description: 'The date for the data point.',
    example: '2025-11-12',
  })
  public date!: string;

  @ApiProperty({
    description: 'The name of the status.',
    example: 'Executed',
  })
  public status!: string;

  @ApiProperty({
    description: 'The total count of operations for that date and status.',
    example: 3,
  })
  public count!: number;
}
