import { test, expect } from '@playwright/test';
import { PortfolioPage } from './pages/PortfolioPage';
import { StockDetailsPage } from './pages/StockDetailsPage';
import { setupAuth } from './utils/auth';
import { getRandomTestStock, testStocks } from './fixtures/stocks';

// Test credentials - should be environment variables in a real project
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

test.describe('Portfolio Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await setupAuth(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('user can view empty portfolio state', async ({ page }) => {
    // This test assumes the portfolio starts empty or is emptied before the test
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Check if we see the empty state message
    const isEmpty = await portfolioPage.isPortfolioEmpty();
    expect(isEmpty).toBe(true);
  });

  test('user can add a stock to portfolio from stock details page', async ({
    page,
  }) => {
    // Get a test stock symbol
    const stockSymbol = getRandomTestStock();

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Add stock to portfolio
    await stockDetailsPage.addToPortfolio();

    // Navigate to portfolio page to verify stock was added
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Check if stock exists in portfolio
    const hasStock = await portfolioPage.hasStock(stockSymbol);
    expect(hasStock).toBe(true);
  });

  test('user can remove a stock from portfolio', async ({ page }) => {
    // Get a test stock symbol
    const stockSymbol = getRandomTestStock();

    // Navigate to stock details page and add stock to portfolio
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);
    await stockDetailsPage.addToPortfolio();

    // Navigate to portfolio page
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Verify stock exists before removing
    let hasStock = await portfolioPage.hasStock(stockSymbol);
    expect(hasStock).toBe(true);

    // Remove the stock and verify it's gone
    await portfolioPage.removeStock(stockSymbol);
    hasStock = await portfolioPage.hasStock(stockSymbol);
    expect(hasStock).toBe(false);
  });

  test('user can refresh stock quotes in portfolio', async ({ page }) => {
    // Get a test stock symbol
    const stockSymbol = getRandomTestStock();

    // Add stock to portfolio via stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);
    await stockDetailsPage.addToPortfolio();

    // Go to portfolio page
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Refresh quotes
    await portfolioPage.refreshQuotes();

    // Verify portfolio still has the stock (checking that refresh didn't cause issues)
    const hasStock = await portfolioPage.hasStock(stockSymbol);
    expect(hasStock).toBe(true);
  });
});
