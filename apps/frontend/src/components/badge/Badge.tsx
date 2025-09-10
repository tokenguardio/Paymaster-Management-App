import { clsx } from 'clsx';
import React from 'react';
import Style from './Badge.module.css';

type TBadgeProps = {
  text: string;
  status?: 'active' | 'paused';
  className?: string;
};

export const Badge = ({ text, status, className }: TBadgeProps) => {
  const badgeStyle = clsx(Style['badge'], status && Style[status], className && className);

  return (
    <div className={badgeStyle}>
      <span className={badgeStyle['text']}>{text}</span>
    </div>
  );
};
