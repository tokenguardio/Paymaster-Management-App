import React from 'react';
import { EChart } from '@/components';
import { usePolicyData } from '@/hooks/usePolicyData';
import { palette } from '@/utils/constans';
// import { getAreaChartOption } from '@/utils/helpers';
import { NoDataInfoBox } from './NoDataInfoBox';
import Style from './PaymasterView.module.css';
import { ResultingTable } from './ResultingTable';

type TPaymasterViewProps = {
  id: string;
};

export const PaymasterView = ({ id }: TPaymasterViewProps) => {
  const { policyData } = usePolicyData(id);
  // const option = getAreaChartOption({
  //   data: policyData,
  //   toolbox: false,
  //   dataZoom: false,
  //   legend: false,
  // });

  // example option
  const exampleOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // prettier-ignore
      data: ['23 Aug', '30 Aug', '6 Sep', '13 Sep', '20 Sep', '27 Sep', '4 Oct', '11 Oct', '18 Oct', '25 Oct'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
      axisPointer: {
        snap: true,
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: 6,
          color: '#22A957',
        },
        {
          gt: 6,
          lte: 8,
          color: 'red',
        },
        {
          gt: 8,
          lte: 14,
          color: '#22A957',
        },
        {
          gt: 14,
          lte: 17,
          color: 'red',
        },
        {
          gt: 17,
          color: '#22A957',
        },
      ],
    },
    series: [
      {
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
        lineStyle: {
          color: palette.green500,
          width: 4,
        },
        name: 'Electricity',
        // type: 'line',
        // smooth: true,
        // prettier-ignore
        data: [20, 5, 120, 132, 24, 26, 12, 92, 87, 25],
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)',
          },
          data: [
            [
              {
                name: 'Rule #204',
                xAxis: '6 Sep',
              },
              {
                xAxis: '13 Sep',
              },
            ],
            [
              {
                name: 'Rule #433',
                xAxis: '11 Oct',
              },
              {
                xAxis: '18 Oct',
              },
            ],
          ],
        },
      },
    ],
  };

  return (
    <section className={Style['preview-container']}>
      {policyData ? (
        <>
          <EChart option={exampleOption} style={{ height: 600 }} />
          <ResultingTable data={policyData} />
        </>
      ) : (
        <NoDataInfoBox />
      )}
    </section>
  );
};
