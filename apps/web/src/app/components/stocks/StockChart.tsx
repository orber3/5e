import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, Typography } from 'antd';
import { StockQuote } from '@app/stores/stockStore';
import { STOCK_CHART } from '@app/consts/strings';

const { Title } = Typography;

interface StockChartProps {
  stock: StockQuote;
}

const StockChart: React.FC<StockChartProps> = ({ stock }) => {
  // Create data points for display using real stock data
  const createStockData = () => {
    // Get the day's price data points that we have
    const data = [];

    // Add the data points we have available
    if (stock.dayLow !== undefined)
      data.push({ label: 'Average 200 Day', value: stock.priceAvg200 });

    data.push({ label: 'Average 50 Day', value: stock.priceAvg50 });
    data.push({ label: 'Current', value: stock.price });

    return data;
  };

  const stockData = createStockData();

  // Calculate min and max for y-axis domain with safe defaults
  const minValue =
    (stock.dayLow !== undefined ? stock.dayLow : stock.price * 0.98) - 1;
  const maxValue =
    (stock.dayHigh !== undefined ? stock.dayHigh : stock.price * 1.02) + 1;

  return (
    <Card>
      <Title level={4}>{STOCK_CHART.TITLE(stock.name)}</Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={stockData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>
      <Typography.Text style={{ display: 'block', marginTop: 10 }}>
        <strong>Change:</strong> ${stock.change.toFixed(2)} (
        {stock?.changesPercentage?.toFixed(2)}%)
      </Typography.Text>
      {stock.marketCap !== undefined && (
        <Typography.Text style={{ display: 'block', marginTop: 5 }}>
          <strong>Market Cap:</strong> $
          {(stock.marketCap / 1000000000).toFixed(2)} B
        </Typography.Text>
      )}
      {stock.volume !== undefined && (
        <Typography.Text style={{ display: 'block', marginTop: 5 }}>
          <strong>Volume:</strong> {stock.volume.toLocaleString()}
        </Typography.Text>
      )}
      {stock.yearLow !== undefined && stock.yearHigh !== undefined && (
        <Typography.Text style={{ display: 'block', marginTop: 5 }}>
          <strong>52-Week Range:</strong> ${stock.yearLow.toFixed(2)} - $
          {stock.yearHigh.toFixed(2)}
        </Typography.Text>
      )}
    </Card>
  );
};

export default StockChart;
