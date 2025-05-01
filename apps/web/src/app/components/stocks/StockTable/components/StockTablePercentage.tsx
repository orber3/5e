import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface StockTablePercentageProps {
  change: number | undefined;
}

/**
 * Component for displaying percentage changes with appropriate color coding
 */
const StockTablePercentage: React.FC<StockTablePercentageProps> = ({
  change,
}) => {
  if (change === undefined) return <>-</>;

  const color = change >= 0 ? 'green' : 'red';
  const prefix = change >= 0 ? '+' : '';

  return <Text style={{ color }}>{`${prefix}${change.toFixed(2)}%`}</Text>;
};

export default StockTablePercentage;
