import React from 'react';
import { NoDataInfoBox } from './components/NoDataInfoBox';
import { PaymasterEditSettings } from './components/PaymasterEditSettings';
import Style from './PaymasterEdit.module.css';

export const PaymasterEdit = () => {
  return (
    <div className={Style['paymaster-edit']}>
      <PaymasterEditSettings />
      <NoDataInfoBox />
    </div>
  );
};
