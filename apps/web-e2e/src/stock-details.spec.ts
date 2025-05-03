import { test, expect } from '@playwright/test';
import { StockDetailsPage } from './pages/StockDetailsPage';
import { setupAuth } from './utils/auth';
import { getTestStockSymbols } from './fixtures/stocks';

// Test credentials - should be environment variables in a real project
const TEST_EMAIL = 'ex@ex.co.il';
const TEST_PASSWORD = 'password';

test.describe('Stock Details', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await setupAuth(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('displays stock name and symbol in title', async ({ page }) => {
    // Get a test stock symbol (Apple)
    const stockSymbol = 'AAPL';

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Get title text and verify it contains stock symbol
    const titleText = await stockDetailsPage.getStockTitle();
    expect(titleText).toContain(stockSymbol);
  });

  test('displays current price with dollar sign', async ({ page }) => {
    // Get a test stock symbol
    const stockSymbol = getTestStockSymbols()[0];

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Get price and verify it's a number greater than 0
    const price = await stockDetailsPage.getCurrentPrice();
    expect(price).toBeGreaterThan(0);
  });

  test('displays percentage change for today', async ({ page }) => {
    // Get a test stock symbol
    const stockSymbol = getTestStockSymbols()[0];

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Get percentage change and verify it's a number (can be positive or negative)
    const change = await stockDetailsPage.getPercentageChange();
    expect(typeof change).toBe('number');

    // If positive change, check for green color
    if (change > 0) {
      const isPositive = await stockDetailsPage.isPriceChangePositive();
      expect(isPositive).toBe(true);
    }

    // If negative change, check for red color
    if (change < 0) {
      const isNegative = await stockDetailsPage.isPriceChangeNegative();
      expect(isNegative).toBe(true);
    }
  });

  test('can navigate back to portfolio from stock details', async ({
    page,
  }) => {
    // Get a test stock symbol
    const stockSymbol = getTestStockSymbols()[0];

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Navigate back to portfolio
    await stockDetailsPage.backToPortfolio();

    // Verify we're on the portfolio page
    expect(page.url()).toContain('/portfolio');
  });
});
