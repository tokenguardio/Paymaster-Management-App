import React, { ReactNode } from 'react';
import Style from './IconButton.module.css';

interface IIconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  children?: ReactNode;
}

export const IconButton: React.FC<IIconButtonProps> = ({ icon: icon, onClick, children }) => {
  return (
    <button className={Style['icon-button']} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};
