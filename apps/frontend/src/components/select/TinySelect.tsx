import React, { ReactNode } from 'react';
import ReactSelect, {
  components,
  PlaceholderProps,
  ControlProps,
  OptionsOrGroups,
  GroupBase,
  SingleValueProps,
} from 'react-select';
import clsx from 'clsx';

import { Label, Icon, Typography } from '@/components';

import Style from './Select.module.css';
import { TDropdownOption } from '@/types/dropdownOption';

type TSelectProps = {
  // options: OptionsOrGroups<string | number, GroupBase<string | number>>;
  options: Array<TDropdownOption>;
  change: any;
  name: string;
  label: string;
  size: string;
  placeholder?: string;
  prefixIcon?: ReactNode;
  color?: string;
  disabled?: boolean;
  withArrow?: boolean;
  value?: string | number;
  defaultValue?: any;
  prefix?: string;
  isSearchable?: boolean;
  isFocusable?: boolean;
};

export const TinySelect = ({
  options,
  change,
  name,
  placeholder,
  value,
  label,
  size,
  color,
  withArrow,
  prefixIcon,
  prefix,
  disabled,
  defaultValue,
  isSearchable,
  isFocusable = true,
}: TSelectProps) => {
  const { Control, Option, Placeholder, SingleValue } = components;

  const IconControl = ({ children, ...props }: ControlProps<any, boolean, GroupBase<any>>) => (
    <Control {...props}>
      <>
        {prefixIcon && prefixIcon}
        {prefix && (
          <Typography
            tag="p"
            text={prefix}
            size="s"
            weight="medium"
            color="gray900"
            className="ml6"
          />
        )}
        {children}
      </>
    </Control>
  );

  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon && <img src={props.data.icon} alt={props.data.label} />}
      {props.data.label}
    </Option>
  );

  const CustomSingleValue = ({
    children,
    ...props
  }: SingleValueProps<unknown, boolean, GroupBase<unknown>>) => (
    <SingleValue {...props}>
      {props.selectProps?.value?.icon && (
        <img src={props.selectProps.value.icon} alt={props.selectProps.value.value} />
      )}
      {children}
    </SingleValue>
  );

  const CustomDropdownIndicator = () => (
    <Icon width="16" height="16" name="arrowHeadBottom" color="primary500" />
  );

  const IconValuePlaceholder = ({
    children,
    ...props
  }: PlaceholderProps<any, boolean, GroupBase<any>>) => {
    const selectedOption = props.selectProps.options.find(
      (option) => option.value === props.selectProps.placeholder,
    );

    return (
      <Placeholder {...props}>
        {selectedOption?.icon && selectedOption?.label && (
          <img
            src={selectedOption.icon}
            alt={selectedOption.label}
            className={Style['select-icon']}
          />
        )}
        {children}
      </Placeholder>
    );
  };

  return (
    <div className={Style['react-select-container']}>
      {label && <Label text={label} forInput={name} />}

      <ReactSelect
        value={value}
        options={options}
        onChange={change}
        id={name}
        name={name}
        defaultValue={defaultValue}
        isDisabled={disabled}
        isSearchable={isSearchable}
        placeholder={placeholder}
        classNames={{
          control: ({ isDisabled, isFocused }) =>
            clsx(
              Style['control'],
              Style[size],
              Style[color],
              isFocused && isFocusable && `${Style['control-active']}`,
              isDisabled && `${Style['disabled']}`,
            ),
          option: ({ isDisabled, isFocused, isSelected }) =>
            clsx(
              Style['option'],
              isSelected && '',
              !isSelected && isFocused && '',
              !isDisabled && isSelected && '',
              !isDisabled && !isSelected && '',
            ),
          container: () => clsx(Style['container']),
          menu: () => clsx(Style['menu']),
          indicatorSeparator: () => clsx(Style['separator']),
          singleValue: () => clsx(Style['single-value']),
          valueContainer: () => clsx(Style['value-container']),
          dropdownIndicator: () => clsx(Style['dropdown-indicator']),
          indicatorsContainer: withArrow ? () => clsx(Style['indicators-container']) : null,
        }}
        components={{
          Option: IconOption,
          Control: IconControl,
          SingleValue: CustomSingleValue,
          Placeholder: IconValuePlaceholder,
          DropdownIndicator: withArrow ? CustomDropdownIndicator : null,
        }}
      />
    </div>
  );
};
