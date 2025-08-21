import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import Style from './Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  variant?: 'outline' | 'solid';
  color?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'submit';
  moveTo?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  size,
  variant,
  color,
  startIcon,
  endIcon,
  fullWidth,
  disabled,
  className,
  type,
  moveTo,
}) => {
  const isOutline = variant === 'outline';
  const colorClass = isOutline ? Style[`outline-${color}`] : Style[color] || Style['primary'];

  const buttonStyle = clsx(
    Style['button'],
    variant ? Style[variant] : Style['solid'],
    size ? Style[size] : Style['medium'],
    colorClass,
    fullWidth && Style['full-width'],
    disabled && Style['disabled'],
    className && className,
  );

  if (moveTo) {
    return (
      <NavLink to={moveTo}>
        <button className={buttonStyle} onClick={onClick} type={type}>
          {startIcon}
          {children}
          {endIcon}
        </button>
      </NavLink>
    );
  }

  return (
    <button className={buttonStyle} onClick={onClick} type={type}>
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};
