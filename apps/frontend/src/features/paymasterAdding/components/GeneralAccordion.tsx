import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';

import ethereumLogo from '@/assets/images/ethereum.svg';
import { Accordion, Checkbox, DatePicker, Icon, NumberInput, Select } from '@/components';

import Style from './GeneralAccordion.module.css';

const blockchainsOptions = [
  {
    value: 'ethereum',
    label: 'Ethereum',
    icon: ethereumLogo,
  },
];

type TFormValues = {
  max_budget?: number;
  blockchain?: string;
  payInERC20?: boolean;
  sponsorTransactions?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  policyDoesNotExpire?: boolean;
};

type TGeneralAccordionProps = {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export const GeneralAccordion = ({ control, errors }: TGeneralAccordionProps) => (
  <Accordion title="General">
    <div className={Style['general-container']}>
      <Controller
        name="max_budget"
        control={control}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Maximum budget in USD"
            prefix="$"
            className="mt8"
            fullWidth
            error={errors.max_budget?.message}
          />
        )}
      />
      <Controller
        name="blockchain"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            id="Blockchain"
            name="blockchain"
            label="Network of choice"
            withArrow
            size="large"
            options={blockchainsOptions}
            change={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        name="payInERC20"
        control={control}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label="Allow Users to Pay Gas in ERC20" />
        )}
      />
      <Controller
        name="sponsorTransactions"
        control={control}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label="Sponsor Transactions for Users" />
        )}
      />
      <div className={Style['date-inputs-row']}>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Start Date"
              value={field.value}
              onChange={field.onChange}
              fullWidth
              calendarIcon={<Icon width="14" height="16" name="calendar" color="gray900" />}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="End Date"
              value={field.value}
              onChange={field.onChange}
              fullWidth
            />
          )}
        />
      </div>
      <Controller
        name="policyDoesNotExpire"
        control={control}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label="Policy doesn’t expire" />
        )}
      />
    </div>
  </Accordion>
);
