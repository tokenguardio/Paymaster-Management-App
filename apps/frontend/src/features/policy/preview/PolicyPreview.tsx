import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PolicyInfoMetric } from './components/PolicyInfoMetric';
import Style from './PolicyPreview.module.css';
import { PaymasterView } from '../common/components/PaymasterView';

export const PolicyPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/paymaster');
    return;
  }

  return (
    <div className={Style['policy-preview']}>
      <PolicyInfoMetric id={id} />
      <PaymasterView />
    </div>
  );
};
