/***
 *
 *   WATERMARK
 *
 **********/

import React from 'react';

import Style from './Watermark.module.css';
import watermark from '@/assets/images/watermark-patterns.png';
import { BRAND_NAME } from '@/utils/constans';

export const Watermark = () => (
  <img className={Style.watermark} src={watermark} alt={`${BRAND_NAME} watermark`} />
);
