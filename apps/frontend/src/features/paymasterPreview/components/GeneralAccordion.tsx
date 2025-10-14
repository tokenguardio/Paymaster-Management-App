import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import {
  Accordion,
  Checkbox,
  DatePicker,
  Icon,
  NumberInput,
  Select,
  TextInput,
} from '@/components';
import { TPolicy } from '@/types/policy';
import { blockchainsOptions } from '@/utils/constans';
import Style from './GeneralAccordion.module.css';

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
  policy: TPolicy;
};

export const GeneralAccordion = ({ policy }: TGeneralAccordionProps) => (
  <Accordion title="General">
    <div className={Style['general-container']}>
      <NumberInput
        label="Maximum budget in USD"
        prefix="$"
        className="mt8"
        fullWidth
        value={policy?.max_budget_wei}
        disabled
      />
      <Select
        id="Blockchain"
        name="blockchain"
        label="Network of choice"
        // withArrow
        size="large"
        options={blockchainsOptions}
        // value={policy?.chain_id}
        // value={blockchainsOptions[0]}
        value={blockchainsOptions.filter((item) => item.value === policy?.chain_id)[0]}
        disabled
      />
      {/* <Controller
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
      /> */}
      <div className={Style['date-inputs-row']}>
        <DatePicker
          label="Start Date"
          value={policy?.valid_from}
          fullWidth
          disabled
          calendarIcon={<Icon width="14" height="16" name="calendar" color="gray900" />}
        />
        <DatePicker label="End Date" value={policy?.valid_to} disabled fullWidth />
      </div>
      {/* <Checkbox
        checked={true}
        label="Policy doesn’t expire"
        disabled
      /> */}
    </div>
  </Accordion>
);
