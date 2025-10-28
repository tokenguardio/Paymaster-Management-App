import React from 'react';
import { NoDataInfoBox } from './components/NoDataInfoBox';
import { PaymasterSettings } from './components/PaymasterSettings';
import Style from './PaymasterEdit.module.css';

export const PaymasterEdit = () => {
  return (
    <div className={Style['paymaster-edit']}>
      <PaymasterSettings />
      <NoDataInfoBox />
    </div>
  );
};
