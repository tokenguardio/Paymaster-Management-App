export type TChartDataPoint = {
  dimension: string;
  [key: string]: number | string;
};

export type TChartResult = Array<Record<string, string | number>>;
