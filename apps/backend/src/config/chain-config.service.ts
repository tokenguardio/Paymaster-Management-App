import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@repo/prisma';

export interface IChainConfig {
  rpcUrl: string;
}

@Injectable()
export class ChainConfigService {
  private readonly logger = new Logger(ChainConfigService.name);

  public constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Gets the RPC URL for a given chainId.
   * Fetches the chain record from the DB, finds its rpc_env_var key,
   * and retrieves the URL from environment variables.
   */
  public async getConfigForChain(chainId: bigint): Promise<IChainConfig> {
    const chain = await this.prisma.chain.findUnique({
      where: { id: chainId },
    });

    if (!chain) {
      this.logger.error(`Configuration not found for chainId: ${chainId}`);
      throw new NotFoundException(`Configuration not found for chainId: ${chainId}`);
    }

    const envKey = chain.rpc_env_var;

    if (!envKey) {
      this.logger.error(
        `RPC environment variable not configured for chain ${chain.name} (ID: ${chainId})`,
      );
      throw new NotFoundException(
        `RPC URL configuration missing: no environment variable configured for chain ${chain.name}`,
      );
    }

    let rpcUrl: string;

    try {
      rpcUrl = this.configService.getOrThrow<string>(envKey);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.logger.error(
        `Environment variable '${envKey}' not found for chain ${chain.name} (ID: ${chainId})`,
      );
      throw new NotFoundException(
        `RPC URL configuration missing: environment variable '${envKey}' not found for chain ${chain.name}`,
      );
    }

    return {
      rpcUrl,
    };
  }
}
