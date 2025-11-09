export const CHAINS = {
  ETHEREUM_MAINNET: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpc_env_var: 'ETHEREUM_RPC_URL',
  },
  SEPOLIA_TESTNET: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpc_env_var: 'SEPOLIA_RPC_URL',
  },
} as const;
