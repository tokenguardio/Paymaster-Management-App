import React from 'react';

import Style from './ResultingTable.module.css';
import { Icon } from '@/components';
import { determineChartDataFormat } from '@/utils/helpers';

const TableHeaderCell = ({ label }) => (
  <th className={Style['head-cell']}>
    <div className={Style['head-cell-content']}>
      <p className={Style['head-cell-title']}>{label}</p>
    </div>
  </th>
);

export const ResultingTable = ({ data }) => {
  const preparedData = determineChartDataFormat(data);
  const keys = Object.keys(preparedData[0]);
  const rows = keys.filter((key) => key !== 'dimension');
  const columns = preparedData.map((item) => item.dimension);
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <div className={Style['resulting-datatable-container']}>
      {data && (
        <table className={Style['table']}>
          <thead>
            <tr className={Style['head-row']}>
              <th className={Style['head-cell']}>
                <div className={Style['head-cell-content']}>
                  <Icon name="a" width="16" height="16" />
                  <p className={Style['head-cell-title']}>Data</p>
                </div>
              </th>
              {columns.map((column, index) => (
                <TableHeaderCell key={`${column}${index}`} label={column} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows &&
              rows?.map((row, index) => {
                const measureData = preparedData.map((item) => item[row]);
                return (
                  <tr key={index} className={Style['body-row']}>
                    <td>{row}</td>
                    {measureData.map((item, index) => (
                      <td key={`${index}`}>
                        {typeof item === 'number' ? formatter.format(item?.toFixed(0) || 0) : item}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};
