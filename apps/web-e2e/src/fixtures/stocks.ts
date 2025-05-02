/**
 * Test stock data for e2e tests
 */
export const testStocks = {
  // Common test stocks with recognizable names
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 180.5,
    changesPercentage: 2.35,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 339.75,
    changesPercentage: 1.47,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.2,
    changesPercentage: -1.65,
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 125.3,
    changesPercentage: 0.52,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 139.6,
    changesPercentage: -0.78,
  },
};

/**
 * Get an array of test stock symbols
 */
export function getTestStockSymbols(): string[] {
  return Object.keys(testStocks);
}

/**
 * Get a random test stock symbol
 */
export function getRandomTestStock(): string {
  const symbols = getTestStockSymbols();
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}
