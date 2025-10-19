import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    description: 'The raw SIWE message as a string',
    example:
      'localhost:3001 wants you to sign in with your Ethereum account:\n' +
      '0x8E52493362F51bf843d1561312AFEE4794766663\n\n' +
      'Log in to app\n\n' +
      'URI: http://localhost:3001\n' +
      'Version: 1\n' +
      'Chain ID: 1\n' +
      'Nonce: XGihgnfKihRe6Mfqr\n' +
      'Issued At: 2025-10-16T22:42:36.150Z',
  })
  @IsString()
  @IsNotEmpty()
  public message!: string;

  @ApiProperty({
    description: "The signature from the user's wallet",
    example: '0xb8c40df9d2f3734e9ebf07ec045cd9b5807d922d6e9ea09281a70e86b1bfcb7a...',
  })
  @IsString()
  @IsNotEmpty()
  public signature!: string;
}

export class VerifyResponseDto {
  @ApiProperty({
    description: 'The authenticated Ethereum address',
    example: '0x1234567890123456789012345678901234567890',
  })
  public address!: string;
}

export class MeResponseDto {
  @ApiProperty({
    description: 'The authenticated Ethereum address',
    example: '0x1234567890123456789012345678901234567890',
  })
  public address!: string;
}
