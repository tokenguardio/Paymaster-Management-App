import React, { ReactNode } from 'react';
import Style from './LinkButton.module.css';

interface IButtonProps {
  onClick: () => void;
  children?: ReactNode;
}

export const LinkButton: React.FC<IButtonProps> = ({ onClick, children }) => (
  <button className={Style['link-button']} onClick={onClick}>
    {children}
  </button>
);
