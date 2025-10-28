import React from 'react';
import { Accordion, DatePicker, Icon, NumberInput, Select } from '@/components';
import { TPolicy } from '@/types/policy';
import { blockchainsOptions } from '@/utils/constans';
import Style from './GeneralAccordion.module.css';

type TGeneralAccordionProps = {
  policy: TPolicy;
};

export const GeneralAccordion = ({ policy }: TGeneralAccordionProps) => (
  <Accordion defaultOpen title="General">
    <div className={Style['general-container']}>
      <NumberInput
        label="Maximum budget in ETH"
        className="mt8"
        fullWidth
        value={policy?.max_budget_wei}
        disabled
      />
      <Select
        name="chain_id"
        label="Network of choice"
        options={blockchainsOptions}
        value={blockchainsOptions.filter((item) => item.value == policy?.chain_id)[0]}
        disabled
      />
      <div className={Style['date-inputs-row']}>
        <DatePicker
          label="Start Date"
          value={policy?.valid_from}
          fullWidth
          disabled
          calendarIcon={false}
          clearIcon={false}
        />
        <DatePicker
          label="End Date"
          value={policy?.valid_to}
          disabled
          fullWidth
          clearIcon={false}
        />
      </div>
    </div>
  </Accordion>
);
