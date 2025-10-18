import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  Button,
  DynamicInput,
  Icon,
  IconButton,
  Line,
  TinySelect,
  Typography,
} from '@/components';
import { usePolicy } from '@/hooks/usePolicy';
import { usePolicyRules } from '@/hooks/usePolicyRules';
import { GeneralAccordion } from './GeneralAccordion';
import Style from './PaymasterInfoMetric.module.css';
import { PreviewPolicyRulesAccordion } from './PreviewPolicyRulesAccordion';
import { PreviewWhitelistedAddressesAccordion } from './PreviewWhitelistedAddressesAccordion';

export const PaymasterInfoMetric = () => {
  const { id } = useParams<{ id: string }>();
  const { policy } = usePolicy(id ?? '');
  const { policyRules } = usePolicyRules(id ?? '');

  if (!id) return null;
  if (!policy) return null;

  return (
    <section className={Style['info-metric']}>
      <Typography tag="h1" text={policy?.name || 'Default Name'} />
      <Line />
      <GeneralAccordion policy={policy} />
      <Line />
      <PreviewWhitelistedAddressesAccordion whiteListedAddresses={policy?.whitelisted_addresses} />
      <Line />
      <PreviewPolicyRulesAccordion policyRules={policyRules} />
    </section>
  );
};
