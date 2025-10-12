import { z } from 'zod';

//TODO define proper object, set with bk
export const PolicyDataSchema = z.object({
  name: z.string().max(32),
  id: z.string(),
  paymaster_address: z.string().max(42),
  chain_id: z.string(),
  status_id: z.string().max(40),
  max_budget_wei: z.string(),
  is_public: z.boolean(),
  whitelisted_addresses: z.array(z.string()).nullable(),
  valid_from: z.string().datetime(),
  valid_to: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  chain: z.object({
    id: z.string(),
    name: z.string(),
  }),
  status: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
});

export type TPolicyData = z.infer<typeof PolicyDataSchema>;
