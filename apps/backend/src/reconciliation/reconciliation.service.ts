import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService, Prisma } from '@repo/prisma';
import { findUserOperationOnchain, IUserOpOnchainResult } from './find-user-op-onchain';
import { ChainConfigService } from '../config/chain-config.service';

type TUserOperationWithPolicy = Prisma.UserOperationGetPayload<{
  include: { policy: true };
}>;

type TReconciliationJob = Prisma.ReconciliationJobGetPayload<Prisma.ReconciliationJobDefaultArgs>;

const STALE_JOB_MINUTES = 15;

function toBigIntOrNull(v: string | number | bigint | null | undefined): bigint | null {
  if (v == null) return null;
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number') return BigInt(v);
  const s = v.trim();
  // BigInt() natively accepts "0x..." or decimal strings
  return BigInt(s);
}

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);
  private readonly batchSize: number;
  private readonly maxBlockRange: number;
  private readonly entryPointAddress: string;

  public constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly chainConfig: ChainConfigService,
  ) {
    // Load config from .env
    this.batchSize = this.configService.get<number>('RECONCILIATION_BATCH_SIZE', 100);
    this.maxBlockRange = this.configService.get<number>('RECONCILIATION_MAX_BLOCK_RANGE', 50000);
    this.entryPointAddress = this.configService.getOrThrow<string>('ENTRY_POINT_ADDRESS_V07');

    this.logger.log(
      `ReconciliationService initialized: batchSize=${this.batchSize}, maxBlockRange=${this.maxBlockRange}`,
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async handleCron(): Promise<void> {
    this.logger.log('Triggering reconciliation job...');
    await this.reconcilePendingUserOps();
  }

  public async reconcilePendingUserOps(): Promise<void> {
    let job: TReconciliationJob | null = null;
    try {
      job = await this.acquireLock();
      if (!job) {
        return; // Job is already running
      }

      const pendingOps = await this.fetchPendingUserOps();
      if (pendingOps.length === 0) {
        this.logger.log('No pending operations to reconcile.');
        await this.releaseLock(job.id, { status: 'completed' });
        return;
      }

      this.logger.log(`Found ${pendingOps.length} operations to process.`);
      await this.prisma.reconciliationJob.update({
        where: { id: job.id },
        data: { user_ops_total: pendingOps.length },
      });

      let processedCount = 0;
      let failedCount = 0;

      for (const userOp of pendingOps) {
        try {
          await this.processUserOp(userOp);
          processedCount++;
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Failed to process UserOp ${userOp.id}: ${errorMessage}`);

          // Update status_note on the UserOp itself
          await this.prisma.userOperation.update({
            where: { id: userOp.id },
            data: {
              status_note: `Reconciliation Error: ${errorMessage}`,
            },
          });
        }

        // Send heartbeat after every operation
        await this.sendHeartbeat(job.id, processedCount, failedCount);
      }

      this.logger.log(
        `Reconciliation complete. Processed: ${processedCount}, Failed: ${failedCount}.`,
      );
      await this.releaseLock(job.id, { status: 'completed' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Fatal error in reconciliation job: ${errorMessage}`);
      if (job) {
        await this.releaseLock(job.id, {
          status: 'failed',
          notes: errorMessage,
        });
      }
    }
  }

  private async acquireLock(): Promise<TReconciliationJob | null> {
    const staleTime = new Date(Date.now() - 1000 * 60 * STALE_JOB_MINUTES);

    // Using transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      const runningJob = await tx.reconciliationJob.findFirst({
        where: { status: 'running' },
      });

      if (runningJob) {
        if (runningJob.last_heartbeat > staleTime) {
          this.logger.warn('Reconciliation job already in progress.');
          return null;
        } else {
          this.logger.error(`Found stale job (ID: ${runningJob.id}), marking as failed.`);
          await tx.reconciliationJob.update({
            where: { id: runningJob.id },
            data: {
              status: 'failed',
              end_time: new Date(),
              notes: 'Job went stale and was terminated.',
            },
          });
        }
      }

      // Create new job
      this.logger.log('Acquired lock, starting new job.');
      const newJob = await tx.reconciliationJob.create({
        data: {
          status: 'running',
          start_time: new Date(),
          last_heartbeat: new Date(),
        },
      });
      return newJob;
    });
  }

  private async sendHeartbeat(jobId: bigint, processed: number, failed: number): Promise<void> {
    await this.prisma.reconciliationJob.update({
      where: { id: jobId },
      data: {
        last_heartbeat: new Date(),
        user_ops_processed: processed,
        user_ops_failed: failed,
      },
    });
  }

  private async releaseLock(
    jobId: bigint,
    finalState: { status: 'completed' | 'failed'; notes?: string },
  ): Promise<void> {
    this.logger.log(`Releasing lock for job ${jobId} with status ${finalState.status}`);
    await this.prisma.reconciliationJob.update({
      where: { id: jobId },
      data: {
        status: finalState.status,
        notes: finalState.notes,
        end_time: new Date(),
      },
    });
  }

  private async fetchPendingUserOps(): Promise<TUserOperationWithPolicy[]> {
    return this.prisma.userOperation.findMany({
      where: {
        status: { is: { id: 'SIGNED' } },
      },
      take: this.batchSize,
      orderBy: {
        created_at: 'asc',
      },
      include: {
        policy: true, // Need this to get the chain_id
      },
    });
  }

  private async processUserOp(userOp: TUserOperationWithPolicy): Promise<void> {
    this.logger.log(`Processing UserOp: ${userOp.id} (Hash: ${userOp.hash})`);

    // Get chain config
    const chainConfig = await this.chainConfig.getConfigForChain(userOp.policy.chain_id);

    // Query the blockchain
    const result = await findUserOperationOnchain({
      userOpHash: userOp.hash as `0x${string}`,
      rpcUrl: chainConfig.rpcUrl,
      entryPointAddress: this.entryPointAddress as `0x${string}`,
      createdAt: userOp.created_at,
      validTo: userOp.valid_to,
      maxBlockRange: this.maxBlockRange,
    });

    // Update database based on result
    if (result.transactionHash) {
      if (result.success) {
        await this.updateUserOpStatus(userOp.id, 'EXECUTED', result);
      } else {
        await this.updateUserOpStatus(userOp.id, 'FAILED', result);
      }
    } else {
      // If it's not found, we check expiration.
      // If not found and not expired, we do nothing.
      // It remains 'SIGNED' and will be re-checked next cycle.
      if (userOp.valid_to && new Date(userOp.valid_to) < new Date()) {
        await this.prisma.userOperation.update({
          where: { id: userOp.id },
          data: {
            status: { connect: { id: 'EXPIRED' } },
            status_note: 'Operation not found and expired.',
          },
        });
      }
      this.logger.log(`UserOp ${userOp.id} not found on-chain, will retry next cycle.`);
    }
  }

  private async updateUserOpStatus(
    userOpId: bigint,
    status: 'EXECUTED' | 'FAILED',
    result: IUserOpOnchainResult,
  ): Promise<void> {
    const data: Prisma.UserOperationUpdateInput = {
      status: { connect: { id: status } },
      transaction_hash: result.transactionHash,
      block_number: toBigIntOrNull(result.blockNumber),
      actual_gas_cost_wei: toBigIntOrNull(result.actualGasCost),
      gas_used_wei: toBigIntOrNull(result.gasUsed),
      gas_price_wei: toBigIntOrNull(result.gasPrice),
      bundler_address: result.bundlerAddress,
      status_note: status === 'FAILED' ? 'Operation failed on-chain.' : 'Executed successfully.',
    };

    await this.prisma.userOperation.update({
      where: { id: userOpId },
      data: data,
    });
    this.logger.log(`UserOp ${userOpId} updated to status: ${status}`);
  }
}
