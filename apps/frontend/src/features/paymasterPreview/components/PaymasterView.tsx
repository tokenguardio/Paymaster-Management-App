import React from 'react';
import { EChart, Typography } from '@/components';
import { usePolicyData } from '@/hooks/usePolicyData';
import { getAreaChartOption } from '@/utils/helpers';
import { NoDataInfoBox } from './NoDataInfoBox';
import Style from './PaymasterView.module.css';
import { ResultingTable } from './ResultingTable';

// const data = [
//   {
//     'UserOps per day': 70,
//     dimension: 'Jun 9',
//   },
//   {
//     'UserOps per day': 381,
//     dimension: 'Jun 10',
//   },
//   {
//     'UserOps per day': 379,
//     dimension: 'Jun 16',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 21',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 22',
//   },
//   {
//     'UserOps per day': 181,
//     dimension: 'Jun 25',
//   },
//   {
//     'UserOps per day': 635,
//     dimension: 'Jun 30',
//   },

//   {
//     'UserOps per day': 379,
//     dimension: 'Jun 16',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 21',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 22',
//   },
//   {
//     'UserOps per day': 181,
//     dimension: 'Jun 25',
//   },
//   {
//     'UserOps per day': 635,
//     dimension: 'Jun 30',
//   },

//   {
//     'UserOps per day': 379,
//     dimension: 'Jun 16',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 21',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 22',
//   },
//   {
//     'UserOps per day': 181,
//     dimension: 'Jun 25',
//   },
//   {
//     'UserOps per day': 635,
//     dimension: 'Jun 30',
//   },

//   {
//     'UserOps per day': 379,
//     dimension: 'Jun 16',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 21',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 22',
//   },
//   {
//     'UserOps per day': 181,
//     dimension: 'Jun 25',
//   },
//   {
//     'UserOps per day': 635,
//     dimension: 'Jun 30',
//   },

//   {
//     'UserOps per day': 379,
//     dimension: 'Jun 16',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 21',
//   },
//   {
//     'UserOps per day': 680,
//     dimension: 'Jun 22',
//   },
//   {
//     'UserOps per day': 181,
//     dimension: 'Jun 25',
//   },
//   {
//     'UserOps per day': 635,
//     dimension: 'Jun 30',
//   },
// ];

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
