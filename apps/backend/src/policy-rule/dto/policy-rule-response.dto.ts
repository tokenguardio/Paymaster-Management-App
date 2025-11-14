import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PolicyRuleResponseDto {
  @ApiProperty({ description: 'Rule ID', example: '1' })
  public id!: string;

  @ApiProperty({ description: 'Policy ID', example: '1' })
  public policy_id!: string;

  @ApiProperty({ description: 'Metric information' })
  public metric!: {
    id: string;
    name: string;
    description: string | null;
  };

  @ApiProperty({ description: 'Comparator information' })
  public comparator!: {
    id: string;
    name: string;
    description: string | null;
  };

  @ApiProperty({ description: 'Interval information' })
  public interval!: {
    id: string;
    name: string;
    description: string | null;
  };

  @ApiPropertyOptional({ description: 'Scope information' })
  public scope!: {
    id: string;
    name: string;
    description: string | null;
  } | null;

  @ApiProperty({ description: 'Rule value', example: '1000' })
  public value!: string;

  @ApiPropertyOptional({ description: 'Token address', example: '0x123...' })
  public token_address?: string | null;

  @ApiProperty({ description: 'Valid from date', example: '2024-01-01T00:00:00.000Z' })
  public valid_from!: string;

  @ApiPropertyOptional({ description: 'Valid to date', example: '2024-12-31T23:59:59.000Z' })
  public valid_to?: string | null;

  @ApiProperty({ description: 'Created at timestamp', example: '2024-01-01T00:00:00.000Z' })
  public created_at!: string;

  @ApiProperty({ description: 'Updated at timestamp', example: '2024-01-02T00:00:00.000Z' })
  public updated_at!: string;
}
