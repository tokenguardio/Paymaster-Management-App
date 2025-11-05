import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
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
    description:
      'Returns all rules assigned to a given policy ID. Use ?active=true to filter only currently active ones (valid_to is null or in the future).',
  })
  @ApiParam({
    name: 'policyId',
    description: 'ID of the policy whose rules you want to fetch',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description:
      'If true, returns only active rules (valid_to is null or valid_to is in the future)',
    example: true,
    type: Boolean,
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
    @Query('active') active?: string,
  ): Promise<PolicyRuleResponseDto[]> {
    const onlyActive = active === 'true';
    return this.policyRuleService.findByPolicyId(policyId, onlyActive);
  }

  @Delete(':policyId')
  @ApiOperation({
    summary: 'Soft delete all rules for a specific policy',
    description:
      'Marks all rules for a given policy as inactive by setting valid_to to the current timestamp instead of deleting them.',
  })
  @ApiParam({
    name: 'policyId',
    description: 'ID of the policy whose rules you want to soft delete',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Rules soft-deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No rules found for this policy',
  })
  public async deleteByPolicyId(@Param('policyId', ParseIntPipe) policyId: number): Promise<void> {
    await this.policyRuleService.deleteByPolicyId(policyId);
  }
}
