import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
    status: HttpStatus.OK,
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
    status: HttpStatus.OK,
    description: 'Successfully verified signature and authenticated user',
    type: VerifyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Verification failed - invalid signature, expired message, missing nonce, or other validation error',
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

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException('Verification failed');
      }
    }
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user info',
    description: "Returns the authenticated user's Ethereum address. Requires an active session.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the authenticated user's address",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated or invalid session',
  })
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

  @Post('dev-login')
  @ApiOperation({
    summary: 'Dev login (development only)',
    description:
      'Creates an authenticated session for testing purposes without requiring wallet signature. Sets a session cookie in the browser that will be used for subsequent authenticated requests. Only available in development mode.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          example: '0x8E52493362F51bf843d1561312AFEE4794766663',
          description: 'Ethereum address to authenticate as',
        },
      },
      required: ['address'],
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logged in for testing' })
  public async devLogin(
    @Body() body: { address: string },
    @Session() session: ISessionData,
  ): Promise<{ message: string }> {
    // Create fake but valid SIWE data
    session.siwe = {
      domain: 'localhost:3000',
      address: body.address,
      statement: 'Dev login',
      uri: 'http://localhost:3000',
      version: '1',
      chainId: 1,
      nonce: 'dev-nonce',
      issuedAt: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    return { message: 'Logged in for testing' };
  }
}
