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
import { TPolicy } from '@/types/policy';
import { GeneralAccordion } from './GeneralAccordion';
import Style from './PaymasterInfoMetric.module.css';
import { PreviewWhitelistedAddressesAccordion } from './PreviewWhitelistedAddressesAccordion';

export const PaymasterInfoMetric = () => {
  const { id } = useParams<{ id: string }>();
  const { policy } = usePolicy(id ?? '');

  if (!id) return null;

  return (
    <section className={Style['info-metric']}>
      <Typography tag="h1" text={policy?.name || 'Default Name'} />
      <Line />
      <GeneralAccordion policy={policy} />
      <Line />
      <PreviewWhitelistedAddressesAccordion whiteListedAddresses={policy?.whitelisted_addresses} />
      <Line />
      {/* <Accordion title="User Spending Rules">
          {fields.map((field, index) => (
            <div key={field.id} className={Style['user-rule-row']}>
              <Controller
                name={`userRules.${index}.target`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={targetOptions}
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Typography text="per" tag="p" size="xs" weight="regular" />
              <Controller
                name={`userRules.${index}.metric`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={metricOptions}
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Controller
                name={`userRules.${index}.type`}
                control={control}
                render={({ field }) => (
                  <TinySelect
                    {...field}
                    options={comparatorOptions} // używamy nowo utworzonych opcji
                    value={field.value}
                    change={(val) => field.onChange(val)}
                    withArrow
                  />
                )}
              />
              <Controller
                name={`userRules.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <DynamicInput
                    {...field}
                    placeholder="0"
                    min={0}
                    step={1}
                    maxLength={9}
                    className={Style['amount-input']}
                    prefix="$"
                    size="small"
                  />
                )}
              />
              <IconButton
                icon={<Icon name="exit" width="16" height="16" color="gray400" />}
                onClick={() => remove(index)}
              />
            </div>
          ))}
        </Accordion> */}
    </section>
  );
};
