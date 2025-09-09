import { clsx } from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Label } from '@/components';

import Style from './DynamicInput.module.css';

interface INumberInputProps {
  type: 'number' | 'text';
  value: number;
  name: string;
  label?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  blur?: () => void;
  ref?: React.Ref<HTMLInputElement>;
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  prefix?: string;
  fullWidth?: boolean;
  error?: string;
  maxLength?: number;
}

export const DynamicInput = forwardRef<HTMLInputElement, INumberInputProps>(
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
      type,
      error,
      maxLength,
    } = props;

    const [innerValue, setInnerValue] = useState<string | number>(value || '');
    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (spanRef.current && inputRef.current) {
        const spanWidth = spanRef.current.offsetWidth;
        inputRef.current.style.width = `${spanWidth + 20}px`;
      }
    }, [innerValue]);

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
            type={type}
            autoComplete="off"
            name={name}
            className={numberInputStyle}
            placeholder={placeholder || ''}
            onBlur={blur}
            ref={(el) => {
              inputRef.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement>).current = el;
            }}
            disabled={disabled}
            defaultValue={value}
            maxLength={maxLength}
            value={innerValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInnerValue(e.target.value);
              onChange(e);
            }}
          />
          <span ref={spanRef} className={Style['text-measurer']}>
            {innerValue || placeholder || '0'}
          </span>
          {error && <span className={Style['error-text']}>{error}</span>}
        </div>
      </div>
    );
  },
);
