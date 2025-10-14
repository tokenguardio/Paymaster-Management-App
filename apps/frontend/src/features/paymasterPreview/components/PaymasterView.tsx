import React from 'react';
import { EChart, Typography } from '@/components';
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
  const option = getAreaChartOption({
    data: policyData,
    toolbox: false,
    dataZoom: false,
    legend: false,
  });

  return (
    <section className={Style['preview-container']}>
      <Typography tag="h2" text="Paymaster Policies" color="primary500" size="l" weight="medium" />
      {policyData ? (
        <>
          <EChart option={option} />
          <ResultingTable data={policyData} />
        </>
      ) : (
        <NoDataInfoBox />
      )}
    </section>
  );
};
