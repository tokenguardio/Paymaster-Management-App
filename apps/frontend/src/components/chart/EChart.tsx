import {
  init,
  getInstanceByDom,
  ECharts,
  EChartsOption,
  EChartsInitOpts,
  SetOptionOpts,
} from 'echarts';
import React, { useEffect, useRef, CSSProperties, HTMLAttributes } from 'react';

interface IEChartProps extends HTMLAttributes<HTMLDivElement> {
  option: EChartsOption;
  chartSettings?: EChartsInitOpts;
  optionSettings?: SetOptionOpts;
  style?: CSSProperties;
}

export const EChart: React.FC<IEChartProps> = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: '100%', height: '350px' },
  ...props
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart: ECharts = init(chartRef.current, undefined, chartSettings);

    return () => {
      chart.dispose();
    };
  }, [chartSettings]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = getInstanceByDom(chartRef.current);
    if (chart) {
      chart.setOption(option, optionSettings);
    }
  }, [option, optionSettings]);

  return <div ref={chartRef} style={style} {...props} />;
};
