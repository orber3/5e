import React, { useState } from 'react';
import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { PortfolioStock } from '@app/stores/portfolioStore';
import { getStockDetailsRoute } from '@app/routes';
import { TableProps } from 'antd';

// Import columns configuration
import { getStockTableColumns } from './components';

interface StockTableProps {
  stocks: PortfolioStock[];
  loading: boolean;
  onRemoveStock: (symbol: string) => void;
}

/**
 * StockTable component displays a table of stocks with sorting and actions
 */
const StockTable: React.FC<StockTableProps> = observer(
  ({ stocks, loading, onRemoveStock }) => {
    const navigate = useNavigate();
    const [sortedInfo, setSortedInfo] = useState<any>({});

    // Handle table sorting
    const handleTableChange: TableProps<PortfolioStock>['onChange'] = (
      _pagination,
      _filters,
      sorter
    ) => {
      // Handle single or multi-column sorting
      const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;
      setSortedInfo({
        columnKey: sorterObj.columnKey,
        order: sorterObj.order,
      });
    };

    // Handle navigation to stock details
    const viewStockDetails = (symbol: string) => {
      navigate(getStockDetailsRoute(symbol));
    };

    // Get columns with handlers
    const columns = getStockTableColumns({
      sortedInfo,
      onViewDetails: viewStockDetails,
      onRemoveStock,
    });

    return (
      <Table
        columns={columns}
        dataSource={stocks.map((stock) => ({ ...stock, key: stock.symbol }))}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }}
        bordered
        size="middle"
      />
    );
  }
);

export default StockTable;
