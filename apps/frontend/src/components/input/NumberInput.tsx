import React, { useState, forwardRef, Ref } from 'react';
import clsx from 'clsx';

import { Label } from '@/components';

import Style from './NumberInput.module.css';

interface INumberInputProps {
  value: number;
  name: string;
  label?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  blur?: () => void;
  ref?: Ref<HTMLInputElement>;
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  prefix?: string;
  fullWidth?: boolean;
  error?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, INumberInputProps>(
  function MyInput(props, ref) {
    const {
      value,
      onChange,
      blur,
      name,
      label,
      placeholder,
      size,
      disabled,
      prefix,
      fullWidth,
      error,
    } = props;
    const [innerValue, setInnerValue] = useState<string | number>(value || '');
    const numberInputStyle = clsx(
      Style['input'],
      size ? Style[size] : Style['medium'],
      fullWidth && Style['full-width'],
      prefix && Style['prefix-padding'],
    );

    return (
      <div className={Style['number-input-container']}>
        {label && <Label text={label} forInput={name} />}

        <div className={Style['input-prefix-container']}>
          {prefix && <span className={Style['prefix']}>{prefix}</span>}
          <input
            type="number"
            autoComplete="off"
            name={name}
            className={numberInputStyle}
            placeholder={placeholder || ''}
            onBlur={blur}
            ref={ref}
            disabled={disabled}
            defaultValue={value}
            value={innerValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInnerValue(e.target.value);
              onChange(e);
            }}
          />
          {error && <span className={Style['error-text']}>{error}</span>}
        </div>
      </div>
    );
  },
);
