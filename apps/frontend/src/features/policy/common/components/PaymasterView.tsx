import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EChart } from '@/components';
import { usePolicyData } from '@/hooks/usePolicyData';
import { getAreaChartOption } from '@/utils/helpers';
import { NoDataInfoBox } from './NoDataInfoBox';
import Style from './PaymasterView.module.css';
import { ResultingTable } from './ResultingTable';

export const PaymasterView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) navigate('/paymaster');
  }, [id, navigate]);

  const { policyData } = usePolicyData(id || '');

  if (!id) return null;

  if (!policyData) return <NoDataInfoBox />;

  const option = getAreaChartOption({
    data: policyData,
    toolbox: false,
    dataZoom: false,
    legend: false,
  });

  return (
    <section className={Style['preview-container']}>
      <EChart option={option} style={{ height: 600 }} />
      <ResultingTable data={policyData} />
    </section>
  );
};
