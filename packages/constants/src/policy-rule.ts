export const POLICY_RULE_METRIC = {
  GAS_SPENT_WEI: {
    id: 'GAS_SPENT_WEI',
    name: 'Gas Spent (Wei)',
    description: 'The cumulative gas cost sponsored for a wallet or policy.',
  },
  TRANSACTION_COUNT: {
    id: 'TRANSACTION_COUNT',
    name: 'Transaction Count',
    description: 'The total number of transactions sponsored for a wallet or policy.',
  },
  TOKEN_BALANCE: {
    id: 'TOKEN_BALANCE',
    name: 'Token Balance',
    description: 'The live balance of a specific ERC20 token held by a wallet.',
  },
} as const;

export const POLICY_RULE_COMPARATOR = {
  LTE: {
    id: 'LTE',
    name: 'Less Than or Equal',
    description: 'Checks if the value is less than or equal to the threshold.',
  },
  GTE: {
    id: 'GTE',
    name: 'Greater Than or Equal',
    description: 'Checks if the value is greater than or equal to the threshold.',
  },
  EQ: {
    id: 'EQ',
    name: 'Equal',
    description: 'Checks if the value is exactly equal to the threshold.',
  },
  LT: {
    id: 'LT',
    name: 'Less Than',
    description: 'Checks if the value is strictly less than the threshold.',
  },
  GT: {
    id: 'GT',
    name: 'Greater Than',
    description: 'Checks if the value is strictly greater than the threshold.',
  },
} as const;

export const POLICY_RULE_SCOPE = {
  USER_OPERATION: {
    id: 'USER_OPERATION',
    name: 'Per User Operation',
    description: "The rule's threshold is evaluated against an individual user operation.",
  },
  WALLET: {
    id: 'WALLET',
    name: 'Per Wallet',
    description: "The rule's threshold is evaluated against an individual wallet.",
  },
  POLICY: {
    id: 'POLICY',
    name: 'Per Policy',
    description: "The rule's threshold is evaluated against an individual policy.",
  },
} as const;

export const POLICY_RULE_INTERVAL = {
  NOW: {
    id: 'NOW',
    name: 'Now',
    description: 'The rule checks current state (e.g., current token balance).',
  },
  DAILY: {
    id: 'DAILY',
    name: 'Daily',
    description:
      'The rule is evaluated against aggregated data from the last rolling 24-hour period.',
  },
  WEEKLY: {
    id: 'WEEKLY',
    name: 'Weekly',
    description:
      'The rule is evaluated against aggregated data from the last rolling 7-day period.',
  },
  MONTHLY: {
    id: 'MONTHLY',
    name: 'Monthly',
    description:
      'The rule is evaluated against aggregated data from the last rolling 1-month period.',
  },
  LIFETIME: {
    id: 'LIFETIME',
    name: 'Lifetime',
    description: 'The rule is evaluated against all historical data.',
  },
} as const;
