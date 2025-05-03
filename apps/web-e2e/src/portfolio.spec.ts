import { test, expect } from '@playwright/test';
import { PortfolioPage } from './pages/PortfolioPage';
import { StockDetailsPage } from './pages/StockDetailsPage';
import { setupAuth } from './utils/auth';
import { getTestStockSymbols } from './fixtures/stocks';

// Test credentials - should be environment variables in a real project
const TEST_EMAIL = 'ex@ex.co.il';
const TEST_PASSWORD = 'password';
const stockSymbol = getTestStockSymbols()[0]; // Use consistent method to get test stock

test.describe('Portfolio Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await setupAuth(page, TEST_EMAIL, TEST_PASSWORD);
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Get test stock symbols that might have been added
    const stockSymbols = getTestStockSymbols();
    // Remove each stock from portfolio if it exists
    for (const symbol of stockSymbols) {
      if (await portfolioPage.hasStock(symbol)) {
        await portfolioPage.removeStock(symbol);
      }
    }

    // Verify portfolio is empty
    const portfolioShouldBeEmpty = await portfolioPage.isPortfolioEmpty();
    expect(portfolioShouldBeEmpty).toBe(true);
  });

  test('user can view empty portfolio state', async ({ page }) => {
    // This test assumes the portfolio starts empty or is emptied before the test
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Check if we see the empty state message
    const isEmpty = await portfolioPage.isPortfolioEmpty();
    expect(isEmpty).toBe(true);
  });

  test('user can remove a stock from portfolio', async ({ page }) => {
    // Get a test stock symbol

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
});
