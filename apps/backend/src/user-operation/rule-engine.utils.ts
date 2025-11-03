// rule-evaluation.utils.ts
import { ConfigService } from '@nestjs/config';
import { CHAINS } from '@repo/constants';

/**
 * Maps chain configurations to their corresponding RPC URL environment variable names.
 */
const CHAIN_RPC_CONFIG = {
  [CHAINS.ETHEREUM_MAINNET.id]: 'ETHEREUM_RPC_URL',
  [CHAINS.SEPOLIA_TESTNET.id]: 'SEPOLIA_RPC_URL',
} as const;

/**
 * Maps chain ID to the appropriate RPC URL from environment configuration.
 */
export function getRpcUrlForChain(chainId: bigint, configService: ConfigService): string {
  const chainIdNum = Number(chainId);
  const rpcConfigKey = CHAIN_RPC_CONFIG[chainIdNum as keyof typeof CHAIN_RPC_CONFIG];

  if (!rpcConfigKey) {
    const supportedChains = Object.values(CHAINS)
      .map((chain) => `${chain.name} (${chain.id})`)
      .join(', ');
    throw new Error(`Unsupported chain ID: ${chainIdNum}. Supported chains: ${supportedChains}`);
  }

  const rpcUrl = configService.get<string>(rpcConfigKey);
  if (!rpcUrl) {
    throw new Error(`${rpcConfigKey} is not configured`);
  }

  return rpcUrl;
}
