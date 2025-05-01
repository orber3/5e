import React, { useEffect } from 'react';
import { Button, Spin, Row, Col } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores/storeContext';
import AppRoutes from '@app/routes';
import { STOCK_DETAILS_PAGE } from '@app/consts/strings';

// Import custom components
import StockHeader from '@app/components/stocks/StockHeader';
import StockInfoCard from '@app/components/stocks/StockInfoCard';
import StockAboutCard from '@app/components/stocks/StockAboutCard';
import StockChartSection from '@app/components/stocks/StockChartSection';

const StockDetailsPage: React.FC = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { rootStore } = useStore();
  const { stockStore, portfolioStore } = rootStore;
  const { stockDetails, isLoadingDetails } = stockStore;

  useEffect(() => {
    if (symbol) {
      stockStore.getStockDetails(symbol);
    }
  }, [symbol, stockStore]);

  const handleAddToPortfolio = () => {
    if (symbol) {
      portfolioStore.addStock(symbol);
    }
  };

  const handleBackToPortfolio = () => {
    navigate(AppRoutes.PORTFOLIO);
  };

  if (isLoadingDetails || !stockDetails) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p>{STOCK_DETAILS_PAGE.LOADING}</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={handleBackToPortfolio}>
          {STOCK_DETAILS_PAGE.BACK}
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <StockHeader
            stock={stockDetails}
            isAdding={portfolioStore.isAdding}
            onAddToPortfolio={handleAddToPortfolio}
          />
        </Col>

        {stockDetails && (
          <>
            <StockChartSection stock={stockDetails} />

            <Col xs={24} lg={8}>
              <StockInfoCard stock={stockDetails} />
            </Col>

            <Col span={24}>
              <StockAboutCard stock={stockDetails} />
            </Col>
          </>
        )}
      </Row>
    </>
  );
});

export default StockDetailsPage;
