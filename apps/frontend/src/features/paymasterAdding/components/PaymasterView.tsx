import React from 'react';
import { AreaChart, Typography } from '@/components';
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
  return (
    <section className={Style['preview-container']}>
      <Typography tag="h2" text="Paymaster Policies" color="primary500" size="l" weight="medium" />
      {data ? (
        <AreaChart toolbox={false} data={data} dataZoom={false} legend={false} height={500} />
      ) : null}
      {/* <div className={Style['table-container']}> */}
      <ResultingTable data={data} />
      {/* </div> */}
    </section>
  );
};
