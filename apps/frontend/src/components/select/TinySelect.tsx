import { clsx } from 'clsx';
import React, { ReactNode } from 'react';
import ReactSelect, {
  components,
  ControlProps,
  GroupBase,
  PlaceholderProps,
  SingleValueProps,
  OptionProps,
  DropdownIndicatorProps,
  ActionMeta,
} from 'react-select';

import Style from './Select.module.css';
import { Icon, Label, Typography } from '@/components';
import { TDropdownOption } from '@/types/dropdownOption';

type TSelectProps = {
  options: Array<TDropdownOption>;
  change: (newValue: TDropdownOption | null, actionMeta: ActionMeta<TDropdownOption>) => void;
  name: string;
  label: string;
  size: string;
  placeholder?: string;
  prefixIcon?: ReactNode;
  color?: string;
  disabled?: boolean;
  withArrow?: boolean;
  value?: TDropdownOption | null;
  defaultValue?: TDropdownOption;
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

  const IconControl = (props: ControlProps<TDropdownOption, false>) => (
    <Control {...props}>
      {prefixIcon}
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
      {props.children}
    </Control>
  );

  const IconOption = (props: OptionProps<TDropdownOption, false>) => (
    <Option {...props}>
      {props.data.icon && <img src={props.data.icon} alt={props.data.label} />}
      {props.data.label}
    </Option>
  );

  const CustomSingleValue = (props: SingleValueProps<TDropdownOption, false>) => (
    <SingleValue {...props}>
      {props.data?.icon && <img src={props.data.icon} alt={props.data.label} />}
      {props.children}
    </SingleValue>
  );

  const CustomDropdownIndicator = (props: DropdownIndicatorProps<TDropdownOption, false>) => (
    <components.DropdownIndicator {...props}>
      <Icon width="16" height="16" name="arrowHeadBottom" color="primary500" />
    </components.DropdownIndicator>
  );

  const IconValuePlaceholder = (props: PlaceholderProps<TDropdownOption, false>) => {
    const selectedOption = options.find((option) => option.value === props.selectProps.placeholder);

    return (
      <Placeholder {...props}>
        {selectedOption?.icon && (
          <img
            src={selectedOption.icon}
            alt={selectedOption.label}
            className={Style['select-icon']}
          />
        )}
        {props.children}
      </Placeholder>
    );
  };

  return (
    <div className={Style['react-select-container']}>
      {label && <Label text={label} forInput={name} />}

      <ReactSelect<TDropdownOption, false>
        value={value || null}
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
          indicatorsContainer: withArrow ? () => clsx(Style['indicators-container']) : undefined,
        }}
        components={{
          Option: IconOption,
          Control: IconControl,
          SingleValue: CustomSingleValue,
          Placeholder: IconValuePlaceholder,
          DropdownIndicator: withArrow ? CustomDropdownIndicator : undefined,
        }}
      />
    </div>
  );
};
