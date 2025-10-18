import { z } from 'zod';

// TODO - temporary unknown type
export const PolicyRuleSchema = z.unknown();

export const PolicyRulesSchema = z.array(PolicyRuleSchema);

export type TPolicyRules = z.infer<typeof PolicyRulesSchema>;
export type TPolicyRule = z.infer<typeof PolicyRuleSchema>;
