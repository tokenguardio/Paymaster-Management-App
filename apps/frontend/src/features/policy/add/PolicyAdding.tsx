import React from 'react';
import { PaymasterSettings } from './components/PaymasterSettings';
import Style from './PolicyAdding.module.css';
import { NoDataInfoBox } from '../common/components/NoDataInfoBox';

export const PolicyAdding = () => {
  return (
    <div className={Style['policy-adding']}>
      <PaymasterSettings />
      <NoDataInfoBox />
    </div>
  );
};
