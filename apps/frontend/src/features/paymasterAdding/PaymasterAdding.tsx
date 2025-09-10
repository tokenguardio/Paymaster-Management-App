import React from 'react';
import { PaymasterSettings } from './components/PaymasterSettings';
import { PaymasterView } from './components/PaymasterView';
import Style from './PaymasterAdding.module.css';

export const PaymasterAdding = () => {
  return (
    <div className={Style['paymaster-adding']}>
      <PaymasterSettings />
      <PaymasterView />
    </div>
  );
};
