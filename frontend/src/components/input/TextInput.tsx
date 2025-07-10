// import React from 'react'
// import { forwardRef, Ref } from 'react'
// import clsx from 'clsx'

// import { Label } from '@/components/label/Label'

// import Style from './TextInput.module.css'

// interface ITextInputProps {
//   value: string,
//   name: string,
//   label?: string,
//   defaultValue?: string,
//   placeholder?: string,
//   change: (e: React.ChangeEvent<HTMLInputElement>) => void,
//   blur?: () => void,
//   ref?: Ref<HTMLInputElement>,
//   fullWidth?: boolean,
//   error?: string
// }

// export const TextInput: React.FC<ITextInputProps> = forwardRef(function MyInput(props, ref) {
//   const { value, change, blur, name, label, placeholder, defaultValue, fullWidth, error } = props

//   const textInputStyle = clsx(
//     Style['input-container'],
//     fullWidth && Style['full-width'],
//   )

//   return (
//     <div className={textInputStyle}>
//       {label && <Label text={label} forInput={name} />}

//       <input
//         type="text"
//         name={name}
//         value={value || ''}
//         defaultValue={defaultValue}
//         className={Style['input']}
//         placeholder={placeholder || ''}
//         onChange={change}
//         onBlur={blur}
//         ref={ref}
//       />
//       {error && <span className={Style['error-text']}>{error}</span>}
//     </div>
//   );
// });

import React, { forwardRef } from 'react'
import clsx from 'clsx'

import { Label } from '@/components/label/Label'
import Style from './TextInput.module.css'

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
  function MyInput({ label, name, fullWidth, error, ...rest }, ref) {
    const textInputStyle = clsx(
      Style['input-container'],
      fullWidth && Style['full-width'],
    )

    return (
      <div className={textInputStyle}>
        {label && <Label text={label} forInput={name} />}

        <input
          ref={ref}
          name={name}
          className={Style['input']}
          {...rest}
        />
        {error && <span className={Style['error-text']}>{error}</span>}
      </div>
    )
  }
)
