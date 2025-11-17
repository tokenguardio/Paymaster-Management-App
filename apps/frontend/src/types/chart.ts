export type TChartDataPoint = {
  date: string;
  [key: string]: number | string;
};

export type TChartResult = Array<Record<string, string | number>>;
