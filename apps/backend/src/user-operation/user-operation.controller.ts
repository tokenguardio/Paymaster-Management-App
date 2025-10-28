// apps/backend/src/user-operation/user-operation.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignUserOperationRequestDto,
  SignUserOperationResponseDto,
} from './dto/sign-user-operation.dto';
import { UserOperationService } from './user-operation.service';

@ApiTags('user-operation')
@Controller('user-operation')
export class UserOperationController {
  public constructor(private readonly svc: UserOperationService) {}

  @Post('sponsor')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Sponsor a UserOperation with paymasterData.' })
  @ApiResponse({ status: 200, type: SignUserOperationResponseDto })
  public async sponsor(
    @Body() body: SignUserOperationRequestDto,
  ): Promise<SignUserOperationResponseDto> {
    return this.svc.signUserOperation(body);
  }
}
