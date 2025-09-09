export const POLICY_STATUS = {
  ACTIVE: {
    id: 'ACTIVE',
    name: 'Active',
    description: 'The policy is currently sponsoring transactions.',
  },
  INACTIVE: {
    id: 'INACTIVE',
    name: 'Inactive',
    description: 'The policy is paused and will not sponsor transactions.',
  },
} as const;
