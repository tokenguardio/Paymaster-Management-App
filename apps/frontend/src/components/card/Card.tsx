/***
 *
 *   CARD
 *
 **********/

import { clsx } from 'clsx';
import React, { ReactNode } from 'react';
import Style from './Card.module.css';

interface ICardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<ICardProps> = ({ title, children, className }) => (
  <div className={clsx(Style.card, className)}>
    {title && (
      <header className={Style.header}>
        <h1 className={Style.title}>{title}</h1>
      </header>
    )}
    {children}
  </div>
);
