import React, { useState, useMemo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

// A generic way to get a value from an object, supporting nested keys if needed in the future.
// For now, it's a simple key access.
export type accessor<T> = (data: T) => any;

export interface ColumnDefinition<T> {
  key: keyof T | string; // string for custom/non-data keys like 'actions'
  header: string;
  render?: (item: T) => ReactNode;
}

interface SortConfig<T> {
  key: keyof T | string;
  direction: 'ascending' | 'descending';
}

interface DataTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

const DataTable = <T extends {}>({ columns, data, onRowClick }: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T | string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof T | string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return faSort;
    }
    return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
  };

  return (
    <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase bg-[#161B22]">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3">
                 <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => requestSort(col.key)}>
                  {col.header}
                  <FontAwesomeIcon icon={getSortIcon(col.key)} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr 
                key={index} 
                className={`hover:bg-[#161B22] transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col) => (
                  <td key={`${String(col.key)}-${index}`} className="px-6 py-4">
                    {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;