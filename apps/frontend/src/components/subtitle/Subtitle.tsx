import React from 'react';

import Style from './Subtitle.module.css';

type TSubtitlePropsType = {
  text: string;
};

export const Subtitle = ({ text }: TSubtitlePropsType) => (
  <h2 className={Style['subtitle']}>{text}</h2>
);
