import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { PortfolioStock } from '@app/stores/portfolioStore';
import StockTableActions from './StockTableActions';

const { Text } = Typography;

// Types for column configuration
export interface StockTableColumnProps {
  sortedInfo: any;
  onViewDetails: (symbol: string) => void;
  onRemoveStock: (symbol: string) => void;
}

/**
 * Format percentage change for display with color
 */
export const formatPercentageChange = (change: number | undefined) => {
  if (change === undefined) return '-';

  const color = change >= 0 ? 'green' : 'red';
  const prefix = change >= 0 ? '+' : '';

  return <Text style={{ color }}>{`${prefix}${change.toFixed(2)}%`}</Text>;
};

/**
 * Get stock table columns with sorting and rendering logic
 */
export const getStockTableColumns = ({
  sortedInfo,
  onViewDetails,
  onRemoveStock,
}: StockTableColumnProps): ColumnsType<PortfolioStock> => {
  return [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: PortfolioStock, b: PortfolioStock) =>
        a.symbol.localeCompare(b.symbol),
      sortOrder: sortedInfo.columnKey === 'symbol' && sortedInfo.order,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Name',
      dataIndex: ['quote', 'name'],
      key: 'name',
      sorter: (a: PortfolioStock, b: PortfolioStock) => {
        const nameA = a.quote?.name || '';
        const nameB = b.quote?.name || '';
        return nameA.localeCompare(nameB);
      },
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      render: (text: string) => text || '-',
    },
    {
      title: 'Price',
      dataIndex: ['quote', 'price'],
      key: 'price',
      sorter: (a: PortfolioStock, b: PortfolioStock) => {
        const priceA = a.quote?.price || 0;
        const priceB = b.quote?.price || 0;
        return priceA - priceB;
      },
      sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
      render: (price: number) => (price ? `$${price.toFixed(2)}` : '-'),
    },
    {
      title: 'Change',
      dataIndex: ['quote', 'changePercentage'],
      key: 'change',
      sorter: (a: PortfolioStock, b: PortfolioStock) => {
        const changeA = a.quote?.changePercentage || 0;
        const changeB = b.quote?.changePercentage || 0;
        return changeA - changeB;
      },
      sortOrder: sortedInfo.columnKey === 'change' && sortedInfo.order,
      render: (_: any, record: PortfolioStock) =>
        formatPercentageChange(record.quote?.changePercentage),
    },
    {
      title: 'Added On',
      dataIndex: 'addedAt',
      key: 'addedAt',
      sorter: (a: PortfolioStock, b: PortfolioStock) => {
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      },
      sortOrder: sortedInfo.columnKey === 'addedAt' && sortedInfo.order,
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PortfolioStock) => (
        <StockTableActions
          symbol={record.symbol}
          onViewDetails={onViewDetails}
          onRemoveStock={onRemoveStock}
        />
      ),
    },
  ];
};
