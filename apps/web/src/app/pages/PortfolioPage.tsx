import React, { useEffect } from 'react';
import { Typography, Button, Empty, Card, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores/storeContext';
import StockTable from '@app/components/stocks/StockTable';
import { PORTFOLIO_PAGE } from '@app/consts/strings';

const { Title } = Typography;

const PortfolioPage: React.FC = observer(() => {
  const { rootStore } = useStore();
  const { portfolioStore } = rootStore;

  useEffect(() => {
    // Load portfolio data when component mounts
    portfolioStore.loadPortfolio();
  }, [portfolioStore]);

  const handleRefreshQuotes = () => {
    portfolioStore.refreshQuotes();
  };

  const handleRemoveStock = (symbol: string) => {
    portfolioStore.removeStock(symbol);
  };

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={2}>{PORTFOLIO_PAGE.TITLE}</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefreshQuotes}
          loading={portfolioStore.isLoading}
          disabled={portfolioStore.portfolioSize === 0}
        >
          {PORTFOLIO_PAGE.REFRESH}
        </Button>
      </div>

      {portfolioStore.isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p>{PORTFOLIO_PAGE.LOADING}</p>
        </div>
      ) : portfolioStore.portfolioSize === 0 ? (
        <Empty
          description={PORTFOLIO_PAGE.EMPTY}
          style={{ padding: '40px 0' }}
          data-testid="portfolio-empty-state"
        />
      ) : (
        <StockTable
          stocks={portfolioStore.portfolioStocks}
          loading={portfolioStore.isLoading || portfolioStore.isRemoving}
          onRemoveStock={handleRemoveStock}
        />
      )}

      <Typography.Text
        type="secondary"
        style={{ display: 'block', marginTop: 16 }}
      >
        {portfolioStore.portfolioSize > 0
          ? PORTFOLIO_PAGE.COUNT(portfolioStore.portfolioSize)
          : PORTFOLIO_PAGE.EMPTY_ACTION}
      </Typography.Text>
    </Card>
  );
});

export default PortfolioPage;
