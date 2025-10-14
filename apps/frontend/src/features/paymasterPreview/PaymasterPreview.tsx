import React from 'react';
import { PaymasterInfoMetric } from './components/PaymasterInfoMetric';
import { PaymasterView } from './components/PaymasterView';
import Style from './PaymasterPreview.module.css';

export const PaymasterPreview = () => {
  return (
    <div className={Style['paymaster-preview']}>
      <PaymasterInfoMetric />
      <PaymasterView id="1" />
    </div>
  );
};
