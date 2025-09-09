export const USER_OPERATION_STATUS = {
  PENDING: {
    id: 'PENDING',
    name: 'Pending',
    description: 'The operation has been received and is awaiting policy validation.',
  },
  VALIDATION_FAILED: {
    id: 'VALIDATION_FAILED',
    name: 'Validation Failed',
    description: 'The operation was rejected because it did not pass the policy checks.',
  },
  SIGNED: {
    id: 'SIGNED',
    name: 'Signed',
    description:
      'The operation passed validation, was signed by the paymaster, and returned to the client.',
  },
  EXECUTED: {
    id: 'EXECUTED',
    name: 'Executed',
    description: 'The operation was successfully executed and included in a block on-chain.',
  },
  FAILED: {
    id: 'FAILED',
    name: 'Failed',
    description: 'The operation failed on-chain or during bundling.',
  },
  EXPIRED: {
    id: 'EXPIRED',
    name: 'Expired',
    description: 'The operation was signed but not seen on-chain within the expected timeframe.',
  },
} as const;
