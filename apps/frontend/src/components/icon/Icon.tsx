/***
 *
 *   ICON
 *
 **********/

import React, { type SVGProps } from 'react';
import clsx from 'clsx';

import spriteHref from '@/assets/icons/sprite.svg';

import Style from './Icon.module.css';

export function Icon({
  name,
  active,
  color,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: string;
  active?: boolean;
  color?: string;
}) {
  const iconStyle = clsx(Style['icon'], active && Style['icon-active'], color && Style[color]);

  return (
    <svg className={iconStyle} {...props}>
      <use href={`${spriteHref}#${name}`} />
    </svg>
  );
}
