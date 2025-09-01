export const generateLegendsData = (data: Array<object>): Array<string> => {
  const uniqueKeys = new Set<string>();

  data.forEach((point) => {
    Object.keys(point).forEach((key) => {
      if (key !== 'dimension') {
        uniqueKeys.add(key);
      }
    });
  });

  return Array.from(uniqueKeys);
};

export const calcWidthOfLegend = (width: number, numbersOfToolboxItem: number): string => {
  const iconWidth = 33; // icon + space
  const widthOfSpaceWithoutMargins = 0.94;
  const widthOfToolbox = (numbersOfToolboxItem * iconWidth * 1) / width;
  const result = widthOfSpaceWithoutMargins - widthOfToolbox;
  const formattedResult = Math.round(result * 100).toString();

  return formattedResult;
};

export function findValueByName<T extends object>(array: T[], name: keyof T): T | null {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    if (name in obj) {
      return obj[name] as T;
    }
  }
  return null;
}

export const calcAverage = (arr: number[], length: number): number => {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, value) => acc + value, 0);
  const average = sum / length;
  return average;
};

export const getTopSeriesData = (
  length: number,
  seriesData: { name: string; data: number[] }[],
): { name: string; average: number }[] => {
  const average_data = seriesData.map((item) => ({
    name: item.name,
    average: calcAverage(item.data, length),
  }));

  return average_data;
};

export function getTopNamesSelected(
  arr: { name: string; average: number }[],
): Record<string, boolean> {
  arr.sort((a, b) => b.average - a.average);
  const selected: Record<string, boolean> = {};

  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    selected[obj.name] = i < 10 ? true : false;
  }

  return selected;
}
