import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { CHAINS, POLICY_STATUS } from '@repo/constants';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEthereumAddress,
  IsIn,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const VALID_CHAIN_IDS = Object.values(CHAINS).map((chain) => chain.id);
const VALID_POLICY_STATUS_IDS = Object.values(POLICY_STATUS).map((status) => status.id);

export class CreatePolicyRuleDto {
  @ApiPropertyOptional({ example: 'EQ' })
  @IsString()
  public comparator!: string;

  @ApiPropertyOptional({ example: 'NOW' })
  @IsString()
  public interval!: string;

  @ApiPropertyOptional({ example: 'WALLET' })
  @IsString()
  public scope!: string;

  @ApiPropertyOptional({ example: 'TOKEN_BALANCE' })
  @IsString()
  public metric!: string;

  @ApiPropertyOptional({ example: 25 })
  @IsNumber()
  public amount!: number;

  @ApiPropertyOptional({
    description: 'Token address for balance-based rules',
    example: '0x0000000000000000000000000000000000000000',
  })
  @IsOptional()
  @IsString()
  public token_address?: string;
}

export class CreatePolicyDto {
  @ApiProperty({
    description: 'Name of the policy',
    example: 'My First Policy',
  })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiHideProperty() // Hides from Swagger request schema
  @IsEmpty({ message: 'paymaster_address is server-managed and must not be provided' })
  public paymaster_address?: never;

  @ApiProperty({
    description: 'Blockchain chain ID',
    example: 1,
    enum: VALID_CHAIN_IDS,
    enumName: 'SupportedChainIds',
  })
  @IsNumber()
  @Type(() => Number)
  @IsIn(VALID_CHAIN_IDS)
  public chain_id!: number;

  @ApiProperty({
    description: 'Policy status ID',
    example: 'ACTIVE',
    enum: VALID_POLICY_STATUS_IDS,
    enumName: 'PolicyStatusId',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_POLICY_STATUS_IDS)
  public status_id!: string;

  @ApiProperty({
    description: 'Maximum budget in Wei (string representation for precision)',
    example: '1000000000000000000',
  })
  @Type(() => Number)
  @IsNotEmpty()
  public max_budget_wei!: number;

  @ApiProperty({
    description: 'Whether the policy is publicly accessible',
    example: true,
  })
  @IsBoolean()
  public is_public!: boolean;

  @ApiProperty({
    description: 'Array of whitelisted Ethereum addresses',
    example: ['0x1234567890123456789012345678901234567890'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsEthereumAddress({
    each: true,
  })
  public whitelisted_addresses!: string[];

  @ApiPropertyOptional({
    description: 'Policy valid from date (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  public valid_from?: string;

  @ApiPropertyOptional({
    description: 'Policy valid until date (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  public valid_to?: string;

  @ApiPropertyOptional({
    description: 'Policy rules definitions',
    type: [CreatePolicyRuleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePolicyRuleDto)
  public rules?: CreatePolicyRuleDto[];
}
