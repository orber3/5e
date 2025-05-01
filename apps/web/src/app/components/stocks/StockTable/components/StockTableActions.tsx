import React from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';

interface StockTableActionsProps {
  symbol: string;
  onViewDetails: (symbol: string) => void;
  onRemoveStock: (symbol: string) => void;
}

/**
 * Component for displaying action buttons in the stock table
 */
const StockTableActions: React.FC<StockTableActionsProps> = ({
  symbol,
  onViewDetails,
  onRemoveStock,
}) => {
  return (
    <div>
      <Tooltip title="View details">
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          size="small"
          onClick={() => onViewDetails(symbol)}
          style={{ marginRight: 8 }}
        />
      </Tooltip>
      <Tooltip title="Remove from portfolio">
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onRemoveStock(symbol)}
        />
      </Tooltip>
    </div>
  );
};

export default StockTableActions;
