import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNumber, IsObject, IsString, ValidateNested, IsOptional } from 'class-validator';

export class RequestUserOperationDto {
  @ApiProperty() @IsString() public sender!: string;
  @ApiProperty() @IsString() public nonce!: string;
  @ApiProperty() @IsString() public callData!: string;

  @ApiProperty() @IsString() public callGasLimit!: string;
  @ApiProperty() @IsString() public verificationGasLimit!: string;
  @ApiProperty() @IsString() public preVerificationGas!: string;
  @ApiProperty() @IsString() public maxFeePerGas!: string;
  @ApiProperty() @IsString() public maxPriorityFeePerGas!: string;

  @ApiProperty() @IsString() public paymaster!: string;
  @ApiProperty() @IsString() public paymasterVerificationGasLimit!: string;
  @ApiProperty() @IsString() public paymasterPostOpGasLimit!: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: 'initCode; omit or send "0x" when not used',
  })
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsString()
  public factoryData?: string; // optional "0x"-hex or omitted
}

export class SignUserOperationRequestDto {
  @ApiProperty() @IsNumber() public chainId!: number;

  @ValidateNested()
  @Type(() => RequestUserOperationDto)
  @IsObject()
  public userOperation!: RequestUserOperationDto;
}

export class ResponseUserOperationDto {
  @ApiProperty() public sender!: string;
  @ApiProperty() public nonce!: string;
  @ApiProperty() public callData!: string;

  @ApiProperty() public callGasLimit!: string;
  @ApiProperty() public verificationGasLimit!: string;
  @ApiProperty() public preVerificationGas!: string;
  @ApiProperty() public maxFeePerGas!: string;
  @ApiProperty() public maxPriorityFeePerGas!: string;

  @ApiProperty() public paymaster!: string;
  @ApiProperty() public paymasterVerificationGasLimit!: string;
  @ApiProperty() public paymasterPostOpGasLimit!: string;

  @ApiProperty() public paymasterData!: string;
}

export class SignUserOperationResponseDto {
  @ApiProperty() public userOperation!: ResponseUserOperationDto;
  @ApiProperty() public selectedPolicy!: { id: number; name: string };
  @ApiProperty({ required: false })
  public acceptedRule?: {
    id: number;
    metric_id: string;
    comparator_id: string;
    interval_id: string;
    scope_id: string;
    value: string;
  };
  @ApiProperty() public meta!: { requestId: string; timestamp: string };
}
