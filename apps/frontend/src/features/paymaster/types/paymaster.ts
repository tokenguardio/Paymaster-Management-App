import { z } from 'zod';

export const SinglePaymasterSchema = z.object({
  id: z.string(),
  status: z.string(),
  name: z.string(),
  // slug: z.string(),
  data: z.unknown(),
});

export const PaymastersSchema = z.array(SinglePaymasterSchema);

export type TPaymasters = z.infer<typeof PaymastersSchema>;
export type TSinglePaymaster = z.infer<typeof SinglePaymasterSchema>;
