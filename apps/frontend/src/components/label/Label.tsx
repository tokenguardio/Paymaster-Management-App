import React from 'react';
import Style from './Label.module.css';

interface ILabelProps {
  text: string;
  forInput: string;
  required?: boolean;
}

export const Label: React.FC<ILabelProps> = ({ text, forInput, required = false }) => {
  return (
    <label className={Style['label']} htmlFor={forInput}>
      {text}
      {required && <span>*</span>}
    </label>
  );
};
