import { EChartsOption } from 'echarts';
import { TChartDataPoint, TChartResult } from '@/types/chart';
import { POLICY_RULE_CONSTRAINTS } from '@/utils/policyRuleConstraints';

type TSeriesData = {
  [metric: string]: string | number;
  dimension: string;
};

interface IAreaChartOptionsParams {
  data: Array<TSeriesData>;
  toolbox?: boolean;
  dataZoom?: boolean;
  legend?: boolean;
}

export const getValidationErrorMessage = (data: string) => {
  return `We apologize, but we're having trouble displaying ${data} data right now. If the problem persists,
    please contact our support team for further assistance. Thank you for your patience!`;
};

export const determineChartDataFormat = (data: TChartDataPoint[]): TChartResult | null => {
  if (!data.length) return null;

  const keys = Object.keys(data[0]);

  if (keys.includes('differential')) {
    const mainMeasure = keys.find(
      (item) => item !== 'dimension' && item !== 'differential',
    ) as string;

    const prepareData = <K extends keyof TChartDataPoint>(
      arr: TChartDataPoint[],
      property: K,
    ): Array<TChartDataPoint[K]> => {
      const uniqueKeys = new Set<TChartDataPoint[K]>();
      arr.forEach((obj) => {
        if (property in obj) {
          uniqueKeys.add(obj[property]);
        }
      });
      return Array.from(uniqueKeys);
    };

    const preparedDimension = prepareData(data, 'dimension').sort() as string[];
    const preparedDifferential = prepareData(data, 'differential') as string[];

    const result: TChartResult = [];

    preparedDimension.forEach((dimension) => {
      const point: Record<string, string | number | undefined> = { dimension };

      preparedDifferential.forEach((measure) => {
        point[measure] = data.find(
          (item) => item.dimension === dimension && item.differential === measure,
        )?.[mainMeasure] as number | undefined;
      });

      result.push(point);
    });

    return result;
  } else {
    const mainMeasure = keys.find((item) => item !== 'dimension') as string;
    return convertDataToSingleLineFormat(data, mainMeasure);
  }
};

export const convertDataToSingleLineFormat = (
  data: TChartDataPoint[],
  metric: string,
): TChartResult | null => {
  if (!metric) return null;

  return data.map((item) => ({
    dimension: String(item.dimension),
    [metric]: Number(item[metric]) ?? 0,
  }));
};

export const getAreaChartOption = ({
  data,
  toolbox = true,
  dataZoom = true,
  legend = true,
}: IAreaChartOptionsParams): EChartsOption => {
  if (!data?.length) return {};

  const metricKey = Object.keys(data[0]).find((k) => k !== 'dimension');
  if (!metricKey) return {};

  return {
    tooltip: { trigger: 'axis' },
    legend: legend ? {} : undefined,
    toolbox: toolbox ? { feature: { saveAsImage: {} } } : undefined,
    dataZoom: dataZoom ? [{ type: 'slider' }] : undefined,
    xAxis: {
      type: 'category',
      data: data.map((d) => d.dimension),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: metricKey,
        type: 'line',
        areaStyle: {},
        data: data.map((d) => d[metricKey]),
      },
    ],
  };
};

export const getAllowedOptions = (
  type: 'scope' | 'metric' | 'interval',
  currentValues: { interval?: string; metric?: string },
) => {
  const matchedRules = POLICY_RULE_CONSTRAINTS.filter((rule) => {
    return Object.entries(rule.match).every(
      ([key, value]) => currentValues[key as keyof typeof currentValues] === value,
    );
  });

  if (matchedRules.length === 0) return undefined;

  const allowed = new Set<string>();
  matchedRules.forEach((rule) => {
    const key =
      type === 'scope'
        ? rule.allowedScopes
        : type === 'metric'
          ? rule.allowedMetrics
          : rule.allowedIntervals;

    key?.forEach((v) => allowed.add(v));
  });

  return Array.from(allowed);
};
