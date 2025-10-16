import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyResponseDto } from './dto/policy-response.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyService } from './policy.service';
import { SiweAuthGuard } from '../auth/auth.guard';

@ApiTags('Policies')
@Controller('policies')
@UseGuards(SiweAuthGuard)
export class PolicyController {
  public constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new policy',
    description: 'Creates a new sponsorship policy with the provided parameters',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Policy successfully created',
    type: PolicyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
  })
  public async create(@Body() createPolicyDto: CreatePolicyDto): Promise<PolicyResponseDto> {
    return this.policyService.create(createPolicyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all policies',
    description: 'Retrieves all policies with optional filtering',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Policies retrieved successfully',
    type: [PolicyResponseDto],
  })
  public async findAll(): Promise<PolicyResponseDto[]> {
    return this.policyService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific policy',
    description:
      'Retrieves a single policy by its ID with full details including related chain and status information',
  })
  @ApiParam({
    name: 'id',
    description: 'Policy ID (numeric string)',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Policy retrieved successfully',
    type: PolicyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Policy not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid policy ID format',
  })
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<PolicyResponseDto> {
    return this.policyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a policy',
    description:
      'Updates an existing policy with the provided parameters. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Policy ID',
    example: '1',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Policy updated successfully',
    type: PolicyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Policy not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid policy ID format or invalid input data',
  })
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<PolicyResponseDto> {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a policy',
    description:
      'Soft deletes a policy by marking it as inactive and setting valid_to to current date.',
  })
  @ApiParam({
    name: 'id',
    description: 'Policy ID',
    example: '1',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Policy deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Policy 1 has been successfully deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Policy not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid policy ID format',
  })
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.policyService.remove(id);
  }
}
