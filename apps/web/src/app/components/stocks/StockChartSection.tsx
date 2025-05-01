import React from 'react';
import { Col } from 'antd';
import { StockDetails } from '@app/stores/stockStore';
import StockChart from '@app/components/stocks/StockChart';

interface StockChartSectionProps {
  stock: StockDetails;
}

const StockChartSection: React.FC<StockChartSectionProps> = ({ stock }) => {
  return (
    <Col xs={24} lg={16}>
      <StockChart stock={stock} />
    </Col>
  );
};

export default StockChartSection;
