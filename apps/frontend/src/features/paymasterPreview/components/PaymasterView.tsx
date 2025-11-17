import React from 'react';
import { EChart } from '@/components';
import { usePolicyData } from '@/hooks/usePolicyData';
import { getAreaChartOption } from '@/utils/helpers';
import { NoDataInfoBox } from './NoDataInfoBox';
import Style from './PaymasterView.module.css';
import { ResultingTable } from './ResultingTable';

type TPaymasterViewProps = {
  id: string;
};

export const PaymasterView = ({ id }: TPaymasterViewProps) => {
  const { policyData } = usePolicyData(id);

  if (!policyData) return null;

  const option = getAreaChartOption({
    data: policyData,
    toolbox: false,
    dataZoom: false,
    legend: false,
  });

  return (
    <section className={Style['preview-container']}>
      {policyData ? (
        <>
          <EChart option={option} style={{ height: 600 }} />
          <ResultingTable data={policyData} />
        </>
      ) : (
        <NoDataInfoBox />
      )}
    </section>
  );
};
