import { Injectable, NotFoundException } from '@nestjs/common';
import { POLICY_STATUS } from '@repo/constants';
import { PrismaService, Prisma } from '@repo/prisma';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyResponseDto } from './dto/policy-response.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

type TPolicyWithRelations = Prisma.PolicyGetPayload<{
  include: {
    chain: true;
    status: true;
  };
}>;

@Injectable()
export class PolicyService {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(createPolicyDto: CreatePolicyDto): Promise<PolicyResponseDto> {
    const policy = await this.prisma.policy.create({
      data: {
        name: createPolicyDto.name,
        paymaster_address: createPolicyDto.paymaster_address,
        chain_id: BigInt(createPolicyDto.chain_id),
        status_id: createPolicyDto.status_id,
        max_budget_wei: createPolicyDto.max_budget_wei,
        is_public: createPolicyDto.is_public,
        whitelisted_addresses: createPolicyDto.whitelisted_addresses,
        valid_from: createPolicyDto.valid_from ? new Date(createPolicyDto.valid_from) : undefined,
        valid_to: createPolicyDto.valid_to ? new Date(createPolicyDto.valid_to) : undefined,
      },
      include: {
        chain: true,
        status: true,
      },
    });

    return this.transformPolicyResponse(policy);
  }

  public async findAll(): Promise<PolicyResponseDto[]> {
    const policies = await this.prisma.policy.findMany({
      include: {
        chain: true,
        status: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return policies.map((policy) => this.transformPolicyResponse(policy));
  }

  public async findOne(id: number): Promise<PolicyResponseDto> {
    const policy = await this.prisma.policy.findUnique({
      where: { id: BigInt(id) },
      include: { chain: true, status: true },
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return this.transformPolicyResponse(policy);
  }

  public async update(id: number, updatePolicyDto: UpdatePolicyDto): Promise<PolicyResponseDto> {
    const existingPolicy = await this.prisma.policy.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingPolicy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    const updateData: Prisma.PolicyUpdateInput = {
      ...(updatePolicyDto.paymaster_address && {
        paymaster_address: updatePolicyDto.paymaster_address,
      }),
      ...(updatePolicyDto.max_budget_wei && { max_budget_wei: updatePolicyDto.max_budget_wei }),
      ...(typeof updatePolicyDto.is_public === 'boolean' && {
        is_public: updatePolicyDto.is_public,
      }),
      ...(updatePolicyDto.whitelisted_addresses && {
        whitelisted_addresses: updatePolicyDto.whitelisted_addresses,
      }),
      ...(updatePolicyDto.valid_from && { valid_from: new Date(updatePolicyDto.valid_from) }),
      ...(updatePolicyDto.valid_to && { valid_to: new Date(updatePolicyDto.valid_to) }),
      ...(updatePolicyDto.chain_id && {
        chain: { connect: { id: BigInt(updatePolicyDto.chain_id) } },
      }),
      ...(updatePolicyDto.status_id && { status: { connect: { id: updatePolicyDto.status_id } } }),
    };

    const policy = await this.prisma.policy.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        chain: true,
        status: true,
      },
    });

    return this.transformPolicyResponse(policy);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const policy = await this.prisma.policy.findUnique({
      where: { id: BigInt(id) },
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    await this.prisma.policy.update({
      where: { id: BigInt(id) },
      data: {
        status_id: POLICY_STATUS.INACTIVE.id,
        valid_to: new Date(),
      },
    });

    return { message: `Policy ${id} has been successfully deleted` };
  }

  private transformPolicyResponse(policy: TPolicyWithRelations): PolicyResponseDto {
    return {
      name: policy.name.toString(),
      id: policy.id.toString(),
      paymaster_address: policy.paymaster_address,
      chain_id: policy.chain_id.toString(),
      status_id: policy.status_id,
      max_budget_wei: policy.max_budget_wei.toString(),
      is_public: policy.is_public,
      whitelisted_addresses: policy.whitelisted_addresses,
      valid_from: policy.valid_from.toISOString(),
      valid_to: policy.valid_to?.toISOString(),
      created_at: policy.created_at.toISOString(),
      updated_at: policy.updated_at.toISOString(),
      chain: policy.chain
        ? {
            id: policy.chain.id.toString(),
            name: policy.chain.name,
          }
        : undefined,
      status: policy.status
        ? {
            id: policy.status.id,
            name: policy.status.name,
            description: policy.status.description ?? undefined,
          }
        : undefined,
    };
  }
}
