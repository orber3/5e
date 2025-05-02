import React from 'react';
import { Typography, Space, Statistic, Row, Col, Button, Card } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { StockDetails } from '@app/stores/stockStore';
import { STOCK_DETAILS_PAGE } from '@app/consts/strings';

const { Title } = Typography;

interface StockHeaderProps {
  stock: StockDetails;
  isAdding: boolean;
  onAddToPortfolio: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  stock,
  isAdding,
  onAddToPortfolio,
}) => {
  const isPriceUp = stock.changesPercentage > 0;
  const isPriceDown = stock.changesPercentage < 0;

  const priceChangeFormatted = stock.changesPercentage
    ? `${
        stock.changesPercentage >= 0 ? '+' : ''
      }${stock.changesPercentage?.toFixed(2)}%`
    : '-';

  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Title level={2}>
            {stock.name} ({stock.symbol})
          </Title>
        </Col>
        <Col xs={24} md={8}>
          <Space size="large">
            <Statistic
              title={STOCK_DETAILS_PAGE.PRICE}
              value={stock.price}
              precision={2}
              prefix="$"
            />
            <Statistic
              title={STOCK_DETAILS_PAGE.CHANGE}
              value={priceChangeFormatted}
              valueStyle={{
                color: isPriceUp ? 'green' : isPriceDown ? 'red' : 'inherit',
              }}
              prefix={
                isPriceUp ? (
                  <ArrowUpOutlined />
                ) : isPriceDown ? (
                  <ArrowDownOutlined />
                ) : null
              }
            />
          </Space>
        </Col>
        <Col xs={24} md={4} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddToPortfolio}
            loading={isAdding}
          >
            {STOCK_DETAILS_PAGE.ADD}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default StockHeader;
