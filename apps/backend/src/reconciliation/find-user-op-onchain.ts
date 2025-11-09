import { JsonRpcProvider, Contract } from 'ethers';

type THex = `0x${string}`;

// Result of searching for a UserOperation on-chain
export interface IUserOpOnchainResult {
  success: boolean;
  transactionHash: string | null;
  blockNumber: number | null;
  gasUsed: string | null;
  actualGasCost: string | null;
  gasPrice: string | null;
  bundlerAddress: string | null;
}

// Parameters for finding a UserOperation on-chain
export interface IFindUserOpParams {
  userOpHash: THex;
  rpcUrl: string;
  entryPointAddress: string;
  createdAt: Date;
  validTo: Date | null;
  maxBlockRange?: number;
}

const ENTRY_POINT_ABI = [
  'event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)',
];

// Estimates the block number at a given timestamp using linear interpolation
// based on recent block time averages.
async function estimateBlockByTimestamp(
  provider: JsonRpcProvider,
  targetTimestamp: number,
  latestBlock: number,
  latestBlockTimestamp: number,
): Promise<number> {
  // Sample a block from ~1000 blocks ago to calculate average block time
  const sampleBlock = await provider.getBlock(Math.max(0, latestBlock - 1000));
  if (!sampleBlock) {
    throw new Error('Could not fetch sample block for timestamp estimation');
  }

  const avgBlockTime = (latestBlockTimestamp - sampleBlock.timestamp) / 1000;
  const blocksDiff = Math.floor((latestBlockTimestamp - targetTimestamp) / avgBlockTime);
  const estimatedBlock = Math.max(0, latestBlock - blocksDiff);

  // Add safety buffer of 500 blocks before the estimate
  return Math.max(0, estimatedBlock - 500);
}

// Searches the blockchain for a UserOperation's execution status by querying
// UserOperationEvent logs from the EntryPoint contract.
export async function findUserOperationOnchain(
  params: IFindUserOpParams,
): Promise<IUserOpOnchainResult> {
  const {
    userOpHash,
    rpcUrl,
    entryPointAddress,
    createdAt,
    validTo,
    maxBlockRange = 50000,
  } = params;

  const provider = new JsonRpcProvider(rpcUrl);
  const entryPoint = new Contract(entryPointAddress, ENTRY_POINT_ABI, provider);

  // Get latest block information
  const latestBlock = await provider.getBlockNumber();
  const latestBlockData = await provider.getBlock(latestBlock);
  if (!latestBlockData) {
    throw new Error('Could not fetch latest block');
  }

  const createdTimestamp = Math.floor(createdAt.getTime() / 1000);
  const validToTimestamp = validTo
    ? Math.floor(validTo.getTime() / 1000)
    : Math.floor(Date.now() / 1000);
  const now = Math.floor(Date.now() / 1000);

  // Estimate fromBlock based on user op createdAt timestamp
  const fromBlock = await estimateBlockByTimestamp(
    provider,
    createdTimestamp,
    latestBlock,
    latestBlockData.timestamp,
  );

  // Calculate toBlock - search until validTo or current time, whichever is earlier
  const searchUntilTimestamp = Math.min(validToTimestamp, now);
  const toBlock =
    searchUntilTimestamp < latestBlockData.timestamp
      ? (await estimateBlockByTimestamp(
          provider,
          searchUntilTimestamp,
          latestBlock,
          latestBlockData.timestamp,
        )) + 500
      : latestBlock;

  console.log(`Searching blocks ${fromBlock} to ${toBlock} (${toBlock - fromBlock} blocks)`);

  // Verify fromBlock is before createdAt (sanity check)
  const fromBlockData = await provider.getBlock(fromBlock);
  if (!fromBlockData) {
    throw new Error(`Block ${fromBlock} not found`);
  }

  if (fromBlockData.timestamp > createdTimestamp) {
    console.warn(
      `Warning: fromBlock ${fromBlock} (${new Date(fromBlockData.timestamp * 1000).toISOString()}) ` +
        `is after createdAt (${createdAt.toISOString()}). This is unexpected.`,
    );
  }

  // Create filter for UserOperationEvent with our specific userOpHash
  const filter = entryPoint.filters.UserOperationEvent(userOpHash);

  // Query in chunks to avoid RPC limits (e.g., "query returned more than 10000 results")
  for (let currentFrom = fromBlock; currentFrom <= toBlock; currentFrom += maxBlockRange) {
    const currentTo = Math.min(currentFrom + maxBlockRange - 1, toBlock);
    console.log(`Querying blocks ${currentFrom} to ${currentTo}...`);

    const events = await entryPoint.queryFilter(filter, currentFrom, currentTo);

    if (events.length > 0) {
      const event = events[0];
      if (!('args' in event)) {
        throw new Error('Unexpected log type');
      }

      // Fetch transaction details to get gas price and bundler address
      const tx = await provider.getTransaction(event.transactionHash);

      return {
        success: event.args.success,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        gasUsed: event.args.actualGasUsed.toString(),
        actualGasCost: event.args.actualGasCost.toString(),
        gasPrice: tx?.gasPrice?.toString() ?? null,
        bundlerAddress: tx?.from ?? null,
      };
    }
  }

  // UserOperation not found on-chain
  return {
    success: false,
    transactionHash: null,
    blockNumber: null,
    gasUsed: null,
    actualGasCost: null,
    gasPrice: null,
    bundlerAddress: null,
  };
}
