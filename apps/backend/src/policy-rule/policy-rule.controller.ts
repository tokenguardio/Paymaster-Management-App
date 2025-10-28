import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PolicyRuleResponseDto } from './dto/policy-rule-response.dto';
import { PolicyRuleService } from './policy-rule.service';
import { SiweAuthGuard } from '../auth/auth.guard';

@ApiTags('Policy Rules')
@UseGuards(SiweAuthGuard)
@Controller('policy-rules')
export class PolicyRuleController {
  public constructor(private readonly policyRuleService: PolicyRuleService) {}

  @Get(':policyId')
  @ApiOperation({
    summary: 'Get rules for a specific policy',
    description: 'Returns all rules assigned to a given policy ID.',
  })
  @ApiParam({
    name: 'policyId',
    description: 'ID of the policy whose rules you want to fetch',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rules retrieved successfully',
    type: [PolicyRuleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No rules found for this policy',
  })
  public async getByPolicyId(
    @Param('policyId', ParseIntPipe) policyId: number,
  ): Promise<PolicyRuleResponseDto[]> {
    return this.policyRuleService.findByPolicyId(policyId);
  }

  @Delete(':policyId')
  @ApiOperation({
    summary: 'Delete all rules for a specific policy',
    description: 'Removes all rules assigned to a given policy ID.',
  })
  @ApiParam({
    name: 'policyId',
    description: 'ID of the policy whose rules you want to delete',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Rules deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No rules found for this policy',
  })
  public async deleteByPolicyId(@Param('policyId', ParseIntPipe) policyId: number): Promise<void> {
    await this.policyRuleService.deleteByPolicyId(policyId);
  }
}
