import { clsx } from 'clsx';
import React from 'react';

import Style from './Typography.module.css';

type TTypographySize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';
type TTypographyWeight = 'regular' | 'medium' | 'semi-bold' | 'bold';
type TTypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type TTypographyAlign = 'center' | 'left' | 'right';

type TTypographyProps = {
  text: string | number;
  tag: TTypographyTag;
  size?: TTypographySize;
  weight?: TTypographyWeight;
  color?: string;
  align?: TTypographyAlign;
  className?: string;
};

export const Typography = ({
  text,
  tag,
  size,
  weight,
  color,
  align,
  className,
}: TTypographyProps) => {
  const typographyStyle = clsx(
    Style['typography'],
    size && Style[`size-${size}`],
    weight && Style[`weight-${weight}`],
    align && Style[`align-${align}`],
    color && Style[color],
    className && className,
  );

  if (tag === 'h1') {
    return <h1 className={typographyStyle}>{text}</h1>;
  }

  if (tag === 'h2') {
    return <h2 className={typographyStyle}>{text}</h2>;
  }

  if (tag === 'h3') {
    return <h2 className={typographyStyle}>{text}</h2>;
  }

  if (tag === 'h4') {
    return <h2 className={typographyStyle}>{text}</h2>;
  }

  if (tag === 'p') {
    return <p className={typographyStyle}>{text}</p>;
  }

  if (tag === 'span') {
    return <span className={typographyStyle}>{text}</span>;
  }
};
