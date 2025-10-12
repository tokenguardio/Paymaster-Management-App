import React from 'react';
import noDataChartInfo from '@/assets/images/blocks.png';
import { Typography } from '@/components';
import Style from './NoDataInfoBox.module.css';

export const NoDataInfoBox = () => {
  return (
    <div className={Style['infobox-container']}>
      <img src={noDataChartInfo} height={64} alt="no chart data information" />
      <Typography tag="p" text="Fill out details to show chart" size="l" weight="medium" />
    </div>
  );
};
