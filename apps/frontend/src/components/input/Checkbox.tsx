import { clsx } from 'clsx';
import React from 'react';

import Style from './Checkbox.module.css';

type TCheckboxSize = 'sm' | 'md' | 'lg';

type TCheckboxProps = {
  label: string;
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: TCheckboxSize;
  fullWidth?: boolean;
};

export const Checkbox = ({
  label,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
}: TCheckboxProps) => {
  const containerClass = clsx(
    Style['checkbox-container'],
    Style[size],
    fullWidth && Style['full-width'],
  );

  return (
    <label className={containerClass}>
      <input
        type="checkbox"
        className={Style['checkbox-input']}
        checked={value}
        onChange={onChange}
      />
      <span className={Style['custom-checkbox']} />
      <span className={Style['checkbox-label']}>{label}</span>
    </label>
  );
};
