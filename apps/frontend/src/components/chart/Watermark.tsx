/***
 *
 *   WATERMARK
 *
 **********/

import React from 'react';
import watermark from '@/assets/images/watermark-patterns.png';
import { BRAND_NAME } from '@/utils/constans';
import Style from './Watermark.module.css';

export const Watermark = () => (
  <img className={Style.watermark} src={watermark} alt={`${BRAND_NAME} watermark`} />
);
