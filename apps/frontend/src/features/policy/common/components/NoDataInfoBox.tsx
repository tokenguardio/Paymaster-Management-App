import React from 'react';
import noDataChartInfo from '@/assets/images/blocks.png';
import { Typography } from '@/components';
import Style from './NoDataInfoBox.module.css';

export const NoDataInfoBox = () => {
  return (
    <div className={Style['infobox-container']}>
      <img src={noDataChartInfo} height={64} alt="No chart data available." />
      <Typography tag="p" text="No chart data available." size="l" />
    </div>
  );
};
