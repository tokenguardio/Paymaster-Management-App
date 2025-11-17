import { POLICY_RULE_INTERVAL, POLICY_RULE_METRIC, POLICY_RULE_SCOPE } from '@repo/constants';

type TRuleConstraint = {
  match: Partial<{
    interval: string;
    metric: string;
  }>;
  allowedScopes?: string[];
  allowedMetrics?: string[];
  allowedIntervals?: string[];
};

export const POLICY_RULE_CONSTRAINTS: TRuleConstraint[] = [
  {
    // if interval = NOW & metric = GAS_SPENT_WEI
    match: {
      interval: POLICY_RULE_INTERVAL.NOW.id,
      metric: POLICY_RULE_METRIC.GAS_SPENT_WEI.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.USER_OPERATION.id],
  },
  {
    // if interval = NOW & metric = TRANSACTION_COUNT
    match: {
      interval: POLICY_RULE_INTERVAL.NOW.id,
      metric: POLICY_RULE_METRIC.TRANSACTION_COUNT.id,
    },
    allowedScopes: [],
  },
  {
    // if interval = NOW & metric = TOKEN_BALANCE
    match: {
      interval: POLICY_RULE_INTERVAL.NOW.id,
      metric: POLICY_RULE_METRIC.TOKEN_BALANCE.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id],
  },
  {
    // if interval = DAILY & metric = GAS_SPENT_WEI
    match: {
      interval: POLICY_RULE_INTERVAL.DAILY.id,
      metric: POLICY_RULE_METRIC.GAS_SPENT_WEI.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = DAILY & metric = TRANSACTION_COUNT
    match: {
      interval: POLICY_RULE_INTERVAL.DAILY.id,
      metric: POLICY_RULE_METRIC.TRANSACTION_COUNT.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = DAILY & metric = TOKEN_BALANCE
    match: {
      interval: POLICY_RULE_INTERVAL.DAILY.id,
      metric: POLICY_RULE_METRIC.TOKEN_BALANCE.id,
    },
    allowedScopes: [],
  },
  {
    // if interval = WEEKLY & metric = GAS_SPENT_WEI
    match: {
      interval: POLICY_RULE_INTERVAL.WEEKLY.id,
      metric: POLICY_RULE_METRIC.GAS_SPENT_WEI.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = WEEKLY & metric = TRANSACTION_COUNT
    match: {
      interval: POLICY_RULE_INTERVAL.WEEKLY.id,
      metric: POLICY_RULE_METRIC.TRANSACTION_COUNT.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = WEEKLY & metric = TOKEN_BALANCE
    match: {
      interval: POLICY_RULE_INTERVAL.WEEKLY.id,
      metric: POLICY_RULE_METRIC.TOKEN_BALANCE.id,
    },
    allowedScopes: [],
  },
  {
    // if interval = MONTHLY & metric = GAS_SPENT_WEI
    match: {
      interval: POLICY_RULE_INTERVAL.MONTHLY.id,
      metric: POLICY_RULE_METRIC.GAS_SPENT_WEI.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = MONTHLY & metric = TRANSACTION_COUNT
    match: {
      interval: POLICY_RULE_INTERVAL.MONTHLY.id,
      metric: POLICY_RULE_METRIC.TRANSACTION_COUNT.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = MONTHLY & metric = TOKEN_BALANCE
    match: {
      interval: POLICY_RULE_INTERVAL.MONTHLY.id,
      metric: POLICY_RULE_METRIC.TOKEN_BALANCE.id,
    },
    allowedScopes: [],
  },
  {
    // if interval = LIFETIME & metric = GAS_SPENT_WEI
    match: {
      interval: POLICY_RULE_INTERVAL.LIFETIME.id,
      metric: POLICY_RULE_METRIC.GAS_SPENT_WEI.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = LIFETIME & metric = TRANSACTION_COUNT
    match: {
      interval: POLICY_RULE_INTERVAL.LIFETIME.id,
      metric: POLICY_RULE_METRIC.TRANSACTION_COUNT.id,
    },
    allowedScopes: [POLICY_RULE_SCOPE.WALLET.id, POLICY_RULE_SCOPE.POLICY.id],
  },
  {
    // if interval = LIFETIME & metric = TOKEN_BALANCE
    match: {
      interval: POLICY_RULE_INTERVAL.LIFETIME.id,
      metric: POLICY_RULE_METRIC.TOKEN_BALANCE.id,
    },
    allowedScopes: [],
  },
];
