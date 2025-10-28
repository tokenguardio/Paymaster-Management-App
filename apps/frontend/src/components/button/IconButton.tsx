import React, { ReactNode } from 'react';
import Style from './IconButton.module.css';

interface IIconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton: React.FC<IIconButtonProps> = ({
  icon,
  onClick,
  children,
  type = 'button',
}) => {
  return (
    <button className={Style['icon-button']} onClick={onClick} type={type}>
      {icon}
      {children}
    </button>
  );
};
