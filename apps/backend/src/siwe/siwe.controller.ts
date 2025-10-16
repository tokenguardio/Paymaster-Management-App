import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  UnauthorizedException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { MeResponseDto, VerifyDto, VerifyResponseDto } from './dto/verify.dto';
import { SiweService } from './siwe.service';
import { ISessionData } from '../shared/interfaces/session.interface';

@ApiTags('Authentication')
@Controller('siwe')
export class SiweController {
  public constructor(private readonly siweService: SiweService) {}

  @Get('nonce')
  @ApiOperation({
    summary: 'Get nonce for SIWE authentication',
    description:
      "Generates a unique nonce for the Sign-In with Ethereum flow. This nonce must be included in the message signed by the user's wallet.",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a unique nonce string',
    type: String,
  })
  public async getNonce(@Session() session: ISessionData): Promise<string> {
    const nonce = this.siweService.generateNonce();
    session.nonce = nonce;
    return nonce;
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify SIWE signature',
    description:
      "Verifies the signed message from the user's Ethereum wallet and establishes an authenticated session.",
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully verified signature and authenticated user',
    type: VerifyResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Message expired',
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid signature',
  })
  @ApiResponse({
    status: 500,
    description: 'Verification failed',
  })
  public async verify(
    @Body() verifyDto: VerifyDto,
    @Session() session: ISessionData,
  ): Promise<VerifyResponseDto> {
    try {
      const result = await this.siweService.verify(
        verifyDto.message,
        verifyDto.signature,
        session.nonce,
      );

      // Store the verified message in session
      session.siwe = result.data;
      session.nonce = null;

      if (result.data.expirationTime) {
        session.cookie.expires = new Date(result.data.expirationTime);
      }

      return { address: result.data.address };
    } catch (error) {
      session.siwe = null;
      session.nonce = null;

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('Expired message')) {
        throw new UnauthorizedException('Message expired');
      } else if (errorMessage.includes('Invalid signature')) {
        throw new UnprocessableEntityException('Invalid signature');
      } else {
        throw new InternalServerErrorException(errorMessage || 'Verification failed');
      }
    }
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user info',
    description: "Returns the authenticated user's Ethereum address. Requires an active session.",
  })
  @ApiResponse({
    status: 200,
    description: "Returns the authenticated user's address",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or invalid session',
  })
  @ApiExcludeEndpoint()
  public async getMe(@Session() session: ISessionData): Promise<MeResponseDto> {
    if (!this.siweService.isAuthenticated(session)) {
      throw new UnauthorizedException('Not authenticated');
    }

    const address = this.siweService.getAuthenticatedAddress(session);
    if (!address) {
      throw new UnauthorizedException('Invalid session');
    }

    return { address };
  }
}
