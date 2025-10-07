import React from 'react';
import { EChart, Typography } from '@/components';
import { getAreaChartOption } from '@/utils/helpers';
import Style from './PaymasterView.module.css';
import { ResultingTable } from './ResultingTable';

const data = [
  {
    'UserOps per day': 70,
    dimension: 'Jun 9',
  },
  {
    'UserOps per day': 381,
    dimension: 'Jun 10',
  },
  {
    'UserOps per day': 379,
    dimension: 'Jun 16',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 21',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 22',
  },
  {
    'UserOps per day': 181,
    dimension: 'Jun 25',
  },
  {
    'UserOps per day': 635,
    dimension: 'Jun 30',
  },

  {
    'UserOps per day': 379,
    dimension: 'Jun 16',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 21',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 22',
  },
  {
    'UserOps per day': 181,
    dimension: 'Jun 25',
  },
  {
    'UserOps per day': 635,
    dimension: 'Jun 30',
  },

  {
    'UserOps per day': 379,
    dimension: 'Jun 16',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 21',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 22',
  },
  {
    'UserOps per day': 181,
    dimension: 'Jun 25',
  },
  {
    'UserOps per day': 635,
    dimension: 'Jun 30',
  },

  {
    'UserOps per day': 379,
    dimension: 'Jun 16',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 21',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 22',
  },
  {
    'UserOps per day': 181,
    dimension: 'Jun 25',
  },
  {
    'UserOps per day': 635,
    dimension: 'Jun 30',
  },

  {
    'UserOps per day': 379,
    dimension: 'Jun 16',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 21',
  },
  {
    'UserOps per day': 680,
    dimension: 'Jun 22',
  },
  {
    'UserOps per day': 181,
    dimension: 'Jun 25',
  },
  {
    'UserOps per day': 635,
    dimension: 'Jun 30',
  },
];

export const PaymasterView = () => {
  const option = getAreaChartOption({
    data: data,
    toolbox: false,
    dataZoom: false,
    legend: false,
  });

  return (
    <section className={Style['preview-container']}>
      <Typography tag="h2" text="Paymaster Policies" color="primary500" size="l" weight="medium" />
      {data ? <EChart option={option} /> : null}
      <ResultingTable data={data} />
    </section>
  );
};
