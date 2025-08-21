import React from 'react';
import DatePicker from 'react-date-picker';
import clsx from 'clsx';

import { Label, Icon } from '@/components';

import './reactDatePicker.css';
import './reactCalendar.css';
import Style from './DatePicker.module.css';

type TDatePickerProps = {
  label?: string;
  value: Date | null;
  format?: string;
  onChange: (date: Date | Date[] | null) => void;
  clearIcon?: boolean;
  fullWidth?: boolean;
};

const CustomDatePicker = (props: TDatePickerProps) => {
  const inputStyle = clsx(Style['date-picker-container'], props.fullWidth && Style['full-width']);

  return (
    <div className={inputStyle}>
      {props.label && <Label text={props.label} />}
      <DatePicker
        onChange={props.onChange}
        value={props.value}
        clearIcon={props.clearIcon}
        locale="en-EN"
        showLeadingZeros
        format={props.format}
        calendarIcon={<Icon width="14" height="16" name="calendar" color="gray900" />}
      />
    </div>
  );
};

export { CustomDatePicker as DatePicker };
