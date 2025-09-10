import React from 'react';
import Style from './Label.module.css';

interface ILabelProps {
  text: string;
  forInput: string;
}

export const Label: React.FC<ILabelProps> = ({ text, forInput }) => {
  return (
    <label className={Style['label']} htmlFor={forInput}>
      {text}
    </label>
  );
};
