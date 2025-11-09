import * as joi from 'joi';

/*eslint-disable import/namespace*/
const envVarsValidationSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().integer().positive().default(3000).required(),
  DATABASE_URL: joi
    .string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  BIND_ADDRESS: joi.string().ip().default('127.0.0.1').required(),
  SWAGGER_UI_PATH: joi.string().default('docs'),
  ETHEREUM_RPC_URL: joi.string().uri().required(),
  SEPOLIA_RPC_URL: joi.string().uri().required(),

  // Paymaster Signer Configuration
  PAYMASTER_SIGNER_PRIVATE_KEY: joi
    .string()
    .pattern(/^(0x)?[0-9a-fA-F]{64}$/)
    .required()
    .messages({
      'string.pattern.base':
        'PAYMASTER_SIGNER_PRIVATE_KEY must be a valid private key (64 hex characters, optionally prefixed with 0x)',
      'any.required': 'PAYMASTER_SIGNER_PRIVATE_KEY is required',
    }),

  PAYMASTER_SIGNER_ADDRESS: joi
    .string()
    .pattern(/^0x[0-9a-fA-F]{40}$/)
    .required()
    .messages({
      'string.pattern.base':
        'PAYMASTER_SIGNER_ADDRESS must be a valid Ethereum address (0x + 40 hex characters)',
      'any.required': 'PAYMASTER_SIGNER_ADDRESS is required',
    }),

  PAYMASTER_ADDRESS: joi
    .string()
    .pattern(/^0x[0-9a-fA-F]{40}$/)
    .required()
    .messages({
      'string.pattern.base':
        'PAYMASTER_ADDRESS must be a valid Ethereum address (0x + 40 hex characters)',
      'any.required': 'PAYMASTER_ADDRESS is required',
    }),

  // EIP-712 Domain Configuration
  PAYMASTER_EIP712_DOMAIN_NAME: joi.string().required().messages({
    'any.required': 'PAYMASTER_EIP712_DOMAIN_NAME is required',
  }),

  PAYMASTER_EIP712_DOMAIN_VERSION: joi.string().required().messages({
    'any.required': 'PAYMASTER_EIP712_DOMAIN_VERSION is required',
  }),

  PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS: joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS must be a number',
      'number.integer': 'PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS must be an integer',
      'number.positive': 'PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS must be positive',
      'any.required': 'PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS is required',
    }),

  // Reconciliation Service Configuration
  RECONCILIATION_BATCH_SIZE: joi.number().integer().positive().default(100).messages({
    'number.base': 'RECONCILIATION_BATCH_SIZE must be a number',
    'number.integer': 'RECONCILIATION_BATCH_SIZE must be an integer',
    'number.positive': 'RECONCILIATION_BATCH_SIZE must be positive',
  }),

  RECONCILIATION_MAX_BLOCK_RANGE: joi.number().integer().positive().default(50000).messages({
    'number.base': 'RECONCILIATION_MAX_BLOCK_RANGE must be a number',
    'number.integer': 'RECONCILIATION_MAX_BLOCK_RANGE must be an integer',
    'number.positive': 'RECONCILIATION_MAX_BLOCK_RANGE must be positive',
  }),

  ENTRY_POINT_ADDRESS_V07: joi
    .string()
    .pattern(/^0x[0-9a-fA-F]{40}$/)
    .required()
    .messages({
      'string.pattern.base':
        'ENTRY_POINT_ADDRESS_V07 must be a valid Ethereum address (0x + 40 hex characters)',
      'any.required': 'ENTRY_POINT_ADDRESS_V07 is required',
    }),
});

export const validateEnvVars = (vars: Record<string, unknown>): Record<string, unknown> => {
  const { error, value } = envVarsValidationSchema.validate(vars, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
};
