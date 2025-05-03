/**
 * Test stock data for e2e tests
 */
export const testStocks = {
  // Common test stocks with recognizable names
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
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
