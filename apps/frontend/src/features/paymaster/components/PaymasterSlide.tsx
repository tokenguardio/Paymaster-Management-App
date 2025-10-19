import React from 'react';
import noDataChartInfo from '@/assets/images/no-data-chart.png';
import { _EChart, Badge, Card, Dropdown, Icon, Typography } from '@/components';
import { usePolicyData } from '@/hooks/usePolicyData';
import { TDropdownOption } from '@/types/dropdownOption';
import { _getAreaChartOption } from '@/utils/helpers';
import Style from './PaymasterSlide.module.css';

interface IPaymasterSlideProps {
  id: string;
  title: string;
  options: Array<TDropdownOption>;
}

export const PaymasterSlide: React.FC<IPaymasterSlideProps> = ({ id, title, options }) => {
  const { policyData } = usePolicyData(id);
  // TODO
  // const option = getAreaChartOption({
  //   data: data,
  //   toolbox: false,
  //   dataZoom: false,
  //   legend: false,
  // });

  return (
    <section className={Style['paymaster-slide']}>
      <Card key={id}>
        <div className={Style['settings-bar']}>
          <Typography
            size="m"
            weight="medium"
            text={title}
            tag="p"
            color="primary500"
            align="left"
          />
          <Badge text="Active" status="active"></Badge>
          {options && options.length > 0 ? (
            <div className="relative">
              <Dropdown options={options} id={id} position="bottom">
                <Icon name="more" width={16} height={16} />
              </Dropdown>
            </div>
          ) : null}
        </div>
        {policyData ? (
          // <EChart option={option} />
          <></>
        ) : (
          <img src={noDataChartInfo} height={300} alt="no chart data information" />
        )}
      </Card>
    </section>
  );
};
