import React from 'react';
import { Card, Descriptions } from 'antd';
import { StockDetails } from '@app/stores/stockStore';
import { STOCK_DETAILS_PAGE } from '@app/consts/strings';

interface StockInfoCardProps {
  stock: StockDetails;
}

const StockInfoCard: React.FC<StockInfoCardProps> = ({ stock }) => {
  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    return `$${(marketCap / 1000000000)?.toFixed(2)} B`;
  };

  const formatRange = (low?: number, high?: number) => {
    if (!low || !high) return 'N/A';
    return `$${low?.toFixed(2)} - $${high?.toFixed(2)}`;
  };

  return (
    <Card title={STOCK_DETAILS_PAGE.STATS}>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label={STOCK_DETAILS_PAGE.MARKET_CAP}>
          {formatMarketCap(stock.marketCap)}
        </Descriptions.Item>

        <Descriptions.Item label={STOCK_DETAILS_PAGE.DAY_RANGE}>
          {formatRange(stock.dayLow, stock.dayHigh)}
        </Descriptions.Item>

        <Descriptions.Item label={STOCK_DETAILS_PAGE.YEAR_RANGE}>
          {formatRange(stock.yearLow, stock.yearHigh)}
        </Descriptions.Item>

        <Descriptions.Item label={STOCK_DETAILS_PAGE.VOLUME}>
          {stock.volume?.toLocaleString() || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label={STOCK_DETAILS_PAGE.PE_RATIO}>
          {stock.pe?.toFixed(2) || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label={STOCK_DETAILS_PAGE.EPS}>
          {stock.eps?.toFixed(2) || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StockInfoCard;
