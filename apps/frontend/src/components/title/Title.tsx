import React from 'react';

import Style from './Title.module.css';

type TTitlePropsType = {
  text: string;
};

export const Title = ({ text }: TTitlePropsType) => <h1 className={Style['title']}>{text}</h1>;
