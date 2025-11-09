import { validateEnvVars } from './env-vars-validation';

describe(validateEnvVars.name, function () {
  it('should return config object with parsed env vars when provided with env vars valid', async function () {
    const result = validateEnvVars({
      NODE_ENV: 'development',
      PORT: '3000',
      BIND_ADDRESS: '127.0.0.1',
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      ETHEREUM_RPC_URL: 'https://ethereum-rpc.publicnode.com',
      SEPOLIA_RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
      PAYMASTER_SIGNER_PRIVATE_KEY:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      PAYMASTER_SIGNER_ADDRESS: '0x1234567890123456789012345678901234567890',
      PAYMASTER_ADDRESS: '0x1234567890123456789012345678901234567890',
      PAYMASTER_EIP712_DOMAIN_NAME: 'TestPaymaster',
      PAYMASTER_EIP712_DOMAIN_VERSION: '1',
      PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS: '300',
      RECONCILIATION_BATCH_SIZE: '100',
      RECONCILIATION_MAX_BLOCK_RANGE: '50000',
      ENTRY_POINT_ADDRESS_V07: '0x1234567890123456789012345678901234567890',
    });

    expect(result).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      BIND_ADDRESS: '127.0.0.1',
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
      SWAGGER_UI_PATH: 'docs',
      ETHEREUM_RPC_URL: 'https://ethereum-rpc.publicnode.com',
      SEPOLIA_RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
      PAYMASTER_SIGNER_PRIVATE_KEY:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      PAYMASTER_SIGNER_ADDRESS: '0x1234567890123456789012345678901234567890',
      PAYMASTER_ADDRESS: '0x1234567890123456789012345678901234567890',
      PAYMASTER_EIP712_DOMAIN_NAME: 'TestPaymaster',
      PAYMASTER_EIP712_DOMAIN_VERSION: '1',
      PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS: 300,
      RECONCILIATION_BATCH_SIZE: 100,
      RECONCILIATION_MAX_BLOCK_RANGE: 50000,
      ENTRY_POINT_ADDRESS_V07: '0x1234567890123456789012345678901234567890',
    });
  });

  it('should throw an error when env vars invalid', async function () {
    try {
      validateEnvVars({
        NODE_ENV: 'dev',
        PORT: '0',
        BIND_ADDRESS: '1127.0.0.1',
        DATABASE_URL: 'postgress://user:pass@localhost:5432/db',
        ETHEREUM_RPC_URL: 'https://ethereum-rpc.publicnode.com',
        SEPOLIA_RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
        PAYMASTER_SIGNER_PRIVATE_KEY:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        PAYMASTER_SIGNER_ADDRESS: '0x1234567890123456789012345678901234567890',
        PAYMASTER_ADDRESS: '0x1234567890123456789012345678901234567890',
        PAYMASTER_EIP712_DOMAIN_NAME: 'TestPaymaster',
        PAYMASTER_EIP712_DOMAIN_VERSION: '1',
        PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS: '300',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (!(error instanceof Error)) throw new Error('this should not be reached');
      expect(error.message).toContain('"NODE_ENV" must be one of [development, production, test]');
      expect(error.message).toContain('"PORT" must be a positive number');
      expect(error.message).toContain(
        '"DATABASE_URL" must be a valid uri with a scheme matching the postgres pattern',
      );
      expect(error.message).toContain('"BIND_ADDRESS" must be a valid ip address');
    }
  });
});
