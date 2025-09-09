import React from 'react';

import { AreaChart, Badge, Card, Dropdown, Icon, Typography } from '@/components';
import { TDropdownOption } from '@/types/dropdownOption';

import Style from './PaymasterSlide.module.css';

type TChartPoint = {
  date: string;
  value: number | string;
};

interface IPaymasterSlideProps {
  id: string;
  title: string;
  options: Array<TDropdownOption>;
  data: Array<TChartPoint>;
}

export const PaymasterSlide: React.FC<IPaymasterSlideProps> = ({ id, title, data, options }) => (
  <section className={Style['paymaster-slide']}>
    <Card key={id}>
      <div className={Style['settings-bar']}>
        <Typography size="m" weight="medium" text={title} tag="p" color="primary500" align="left" />
        <Badge text="Active" status="active"></Badge>
        {options && options.length > 0 ? (
          <div className="relative">
            <Dropdown options={options} id={id} position="bottom">
              <Icon name="more" width={16} height={16} />
            </Dropdown>
          </div>
        ) : null}
      </div>
      {data ? <AreaChart toolbox={false} data={data} /> : null}
    </Card>
  </section>
);
