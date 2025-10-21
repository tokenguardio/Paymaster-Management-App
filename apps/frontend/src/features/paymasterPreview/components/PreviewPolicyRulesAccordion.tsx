import React from 'react';
import { Accordion, Typography } from '@/components';
import { TPolicyRules } from '@/types/policyRule';
import Style from './PreviewPolicyRulesAccordion.module.css';

type TPreviewPolicyRulesAccordionProps = {
  policyRules: TPolicyRules;
};

export const PreviewPolicyRulesAccordion = ({ policyRules }: TPreviewPolicyRulesAccordionProps) => {
  if (!policyRules) return null;

  return (
    <Accordion defaultOpen title="Rules">
      <div className={Style['rules-container']}>
        {policyRules?.length === 0 ? (
          <Typography tag="p" text="Policy doesn't have rules." />
        ) : null}
        {policyRules?.length > 0 ? (
          <ul>
            {policyRules.map((rule, index) => (
              <li key={index}>
                <Typography
                  tag="p"
                  size="s"
                  text={`${rule.metric.name} ${rule.scope.name} per ${rule.interval.name} ${rule.comparator.name} ${rule.value}`}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Accordion>
  );
};
