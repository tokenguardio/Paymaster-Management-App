import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CHAINS, POLICY_STATUS } from '@repo/constants';

const VALID_CHAIN_IDS = Object.values(CHAINS).map((chain) => chain.id);
const VALID_POLICY_STATUS_IDS = Object.values(POLICY_STATUS).map((status) => status.id);

export class PolicyResponseDto {
  @ApiProperty({
    description: 'Policy unique identifier',
    example: '1',
  })
  public id!: string;

  @ApiProperty({
    description: 'Paymaster Ethereum address',
    example: '0x1234567890123456789012345678901234567890',
  })
  public paymaster_address!: string;

  @ApiProperty({
    description: 'Blockchain chain ID',
    example: '1',
    enum: VALID_CHAIN_IDS,
  })
  public chain_id!: string;

  @ApiProperty({
    description: 'Policy status',
    example: 'ACTIVE',
    enum: VALID_POLICY_STATUS_IDS,
  })
  public status_id!: string;

  @ApiProperty({
    description: 'Maximum budget in Wei',
    example: '1000000000000000000',
  })
  public max_budget_wei!: string;

  @ApiProperty({
    description: 'Whether policy is public',
    example: true,
  })
  public is_public!: boolean;

  @ApiProperty({
    description: 'Whitelisted addresses',
    example: ['0x1234567890123456789012345678901234567890'],
    type: [String],
  })
  public whitelisted_addresses!: string[];

  @ApiProperty({
    description: 'Policy valid from date',
    example: '2024-01-01T00:00:00.000Z',
  })
  public valid_from!: string;

  @ApiPropertyOptional({
    description: 'Policy valid until date',
    example: '2024-12-31T23:59:59.000Z',
  })
  public valid_to?: string;

  @ApiProperty({
    description: 'Policy creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  public created_at!: string;

  @ApiProperty({
    description: 'Policy last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  public updated_at!: string;

  @ApiPropertyOptional({
    description: 'Related chain information',
  })
  public chain?: {
    id: string;
    name: string;
  };

  @ApiPropertyOptional({
    description: 'Policy status information',
  })
  public status?: {
    id: string;
    name: string;
    description?: string;
  };
}
