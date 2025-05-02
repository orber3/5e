import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const formatPercentageChange = (change: number | undefined) => {
  if (change === undefined) return '-';

  const color = change >= 0 ? 'green' : 'red';
  const prefix = change >= 0 ? '+' : '';

  return <Text style={{ color }}>{`${prefix}${change.toFixed(2)}%`}</Text>;
};
