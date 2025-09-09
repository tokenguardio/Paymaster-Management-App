import { clsx } from 'clsx';
import { forwardRef, InputHTMLAttributes } from 'react';

import { Label } from '@/components/label/Label';

import Style from './TextInput.module.css';

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(function MyInput(
  { label, name, fullWidth, error, ...rest },
  ref,
) {
  const textInputStyle = clsx(Style['input-container'], fullWidth && Style['full-width']);

  return (
    <div className={textInputStyle}>
      {label && <Label text={label} forInput={name} />}

      <input ref={ref} name={name} className={Style['input']} {...rest} />
      {error && <span className={Style['error-text']}>{error}</span>}
    </div>
  );
});
