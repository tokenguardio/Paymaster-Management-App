import React from 'react';
import { NoDataInfoBox } from './components/NoDataInfoBox';
import { PaymasterSettings } from './components/PaymasterSettings';
import Style from './PaymasterAdding.module.css';

export const PaymasterAdding = () => {
  return (
    <div className={Style['paymaster-adding']}>
      <PaymasterSettings />
      <NoDataInfoBox />
    </div>
  );
};
