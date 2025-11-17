import React from 'react';
import { Line, Typography } from '@/components';
import { usePolicy } from '@/hooks/usePolicy';
import { usePolicyRules } from '@/hooks/usePolicyRules';
import { GeneralAccordion } from './GeneralAccordion';
import Style from './PaymasterInfoMetric.module.css';
import { PreviewPolicyRulesAccordion } from './PreviewPolicyRulesAccordion';
import { PreviewWhitelistedAddressesAccordion } from './PreviewWhitelistedAddressesAccordion';

type TPaymasterInfoMetricProps = {
  id: string;
};

export const PaymasterInfoMetric = ({ id }: TPaymasterInfoMetricProps) => {
  const { policy } = usePolicy(id ?? '');
  const { policyRules } = usePolicyRules(id ?? '', 'active=true');

  if (!policy) return null;

  return (
    <section className={Style['info-metric']}>
      <Typography tag="h1" text={policy?.name || 'Default Name'} />
      <Line />
      <GeneralAccordion policy={policy} />
      <Line />
      <PreviewWhitelistedAddressesAccordion whiteListedAddresses={policy?.whitelisted_addresses} />
      <Line />
      {policyRules && <PreviewPolicyRulesAccordion policyRules={policyRules} />}
    </section>
  );
};
