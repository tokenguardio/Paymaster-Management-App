import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaymasterInfoMetric } from './components/PaymasterInfoMetric';
import { PaymasterView } from './components/PaymasterView';
import Style from './PaymasterPreview.module.css';

export const PaymasterPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return navigate('/paymaster');
  }

  return (
    <div className={Style['paymaster-preview']}>
      <PaymasterInfoMetric id={id} />
      <PaymasterView id={id} />
    </div>
  );
};
