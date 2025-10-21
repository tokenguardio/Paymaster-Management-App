import React, { useState } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Accordion, Checkbox, DatePicker, Icon, NumberInput, Select } from '@/components';
import { blockchainsOptions } from '@/utils/constans';
import Style from './GeneralAccordion.module.css';

type TFormValues = {
  max_budget_wei?: number;
  blockchain?: number;
  valid_from?: Date | null;
  valid_to?: Date | null;
};

type TGeneralAccordionProps = {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  setValue: (name: keyof TFormValues, value: unknown) => void;
};

export const GeneralAccordion = ({ control, errors, setValue }: TGeneralAccordionProps) => {
  const [policyNotExpired, setPolicyNotExpired] = useState<boolean>(false);

  const handlePolicyChange = () => {
    setPolicyNotExpired((prevState) => {
      const newValue = !prevState;
      if (newValue) {
        setValue('valid_to', null);
      }
      return newValue;
    });
  };

  return (
    <Accordion title="General">
      <div className={Style['general-container']}>
        <Controller
          name="max_budget_wei"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label="Maximum budget in USD"
              prefix="$"
              className="mt8"
              fullWidth
              error={errors.max_budget_wei?.message}
            />
          )}
        />
        <Controller
          name="blockchain"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="blockchain"
              name="blockchain"
              label="Network of choice"
              withArrow
              size="large"
              options={blockchainsOptions}
              change={field.onChange}
              value={field.value}
              error={errors.blockchain?.message}
            />
          )}
        />
        <div className={Style['date-inputs-row']}>
          <Controller
            name="valid_from"
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
            name="valid_to"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="End Date"
                value={!policyNotExpired ? field.value : ''}
                onChange={field.onChange}
                fullWidth
                disabled={policyNotExpired}
              />
            )}
          />
        </div>
        <Checkbox
          onChange={handlePolicyChange}
          value={policyNotExpired}
          label="Policy doesn’t expire"
        />
      </div>
    </Accordion>
  );
};
