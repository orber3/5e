import React from 'react';
import { Card, Typography, Divider, Row, Col, Descriptions } from 'antd';
import { StockDetails } from '@app/stores/stockStore';
import { STOCK_DETAILS_PAGE } from '@app/consts/strings';

const { Paragraph } = Typography;

interface StockAboutCardProps {
  stock: StockDetails;
}

const StockAboutCard: React.FC<StockAboutCardProps> = ({ stock }) => {
  return (
    <Card title={STOCK_DETAILS_PAGE.ABOUT}>
      {stock.description ? (
        <>
          <Paragraph>{stock.description}</Paragraph>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={STOCK_DETAILS_PAGE.INDUSTRY}>
                  {stock.industry || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label={STOCK_DETAILS_PAGE.SECTOR}>
                  {stock.sector || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={STOCK_DETAILS_PAGE.CEO}>
                  {stock.ceo || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label={STOCK_DETAILS_PAGE.BETA}>
                  {stock.beta?.toFixed(2) || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={STOCK_DETAILS_PAGE.WEBSITE}>
                  {stock.website ? (
                    <a
                      href={stock.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stock.website}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </>
      ) : (
        <Paragraph>{STOCK_DETAILS_PAGE.NO_DESCRIPTION}</Paragraph>
      )}
    </Card>
  );
};

export default StockAboutCard;
