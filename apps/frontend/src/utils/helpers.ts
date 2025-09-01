export const getValidationErrorMessage = (data: string) => {
  return `We apologize, but we're having trouble displaying ${data} data right now. If the problem persists,
    please contact our support team for further assistance. Thank you for your patience!`;
};

type TChartData = {
  dimension: string;
  [key: string]: number | string;
};

type TChartResult = Array<Record<string, string | number | undefined>>;

export const determineChartDataFormat = (data: TChartData[]): TChartResult | null => {
  if (!data.length) return null;

  const keys = Object.keys(data[0]);

  if (keys.includes('differential')) {
    const mainMeasure = keys.find(
      (item) => item !== 'dimension' && item !== 'differential',
    ) as string;

    const prepareData = <K extends keyof TChartData>(
      arr: TChartData[],
      property: K,
    ): Array<TChartData[K]> => {
      const uniqueKeys = new Set<TChartData[K]>();
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
  data: TChartData[],
  metric: string,
): TChartResult | null => {
  if (!metric) return null;

  return data.map((item) => ({
    dimension: String(item.dimension),
    [metric]: Number(item[metric]) ?? 0,
  }));
};
