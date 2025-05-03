import { test, expect } from '@playwright/test';
import { PortfolioPage } from './pages/PortfolioPage';
import { StockDetailsPage } from './pages/StockDetailsPage';
import { setupAuth } from './utils/auth';
import { getTestStockSymbols } from './fixtures/stocks';

// Test credentials - should be environment variables in a real project
const TEST_EMAIL = 'test@example.co.il';
const TEST_PASSWORD = 'password';

test.describe('Navigation Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await setupAuth(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('user can navigate from portfolio to stock details and back', async ({
    page,
  }) => {
    // Get test stock symbols
    const stockSymbol = getTestStockSymbols()[0];

    // Add stock to portfolio (assuming it's not already there)
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);
    await stockDetailsPage.addToPortfolio();

    // Go to portfolio page
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Navigate to stock details from portfolio
    await portfolioPage.viewStockDetails(stockSymbol);

    // Verify we're on the stock details page
    expect(page.url()).toContain(`/stocks/${stockSymbol}`);
    const title = await stockDetailsPage.getStockTitle();
    expect(title).toContain(stockSymbol);

    // Navigate back to portfolio
    await stockDetailsPage.backToPortfolio();

    // Verify we're back on the portfolio page
    expect(page.url()).toContain('/portfolio');
  });

  test('user can navigate between multiple stock detail pages', async ({
    page,
  }) => {
    // Get test stock symbols
    const stockSymbols = getTestStockSymbols().slice(0, 2); // Get first two symbols
    const [firstSymbol, secondSymbol] = stockSymbols;

    // Add stocks to portfolio (assuming they're not already there)
    const stockDetailsPage = new StockDetailsPage(page);

    // Add first stock
    await stockDetailsPage.goto(firstSymbol);
    await stockDetailsPage.addToPortfolio();

    // Add second stock
    await stockDetailsPage.goto(secondSymbol);
    await stockDetailsPage.addToPortfolio();

    // Go to portfolio page
    const portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();

    // Navigate to first stock details
    await portfolioPage.viewStockDetails(firstSymbol);

    // Verify we're on the first stock details page
    expect(page.url()).toContain(`/stocks/${firstSymbol}`);
    let title = await stockDetailsPage.getStockTitle();
    expect(title).toContain(firstSymbol);

    // Go back to portfolio
    await stockDetailsPage.backToPortfolio();

    // Navigate to second stock details
    await portfolioPage.viewStockDetails(secondSymbol);

    // Verify we're on the second stock details page
    expect(page.url()).toContain(`/stocks/${secondSymbol}`);
    title = await stockDetailsPage.getStockTitle();
    expect(title).toContain(secondSymbol);

    // Go back to portfolio
    await stockDetailsPage.backToPortfolio();

    // Verify we're back on the portfolio page
    expect(page.url()).toContain('/portfolio');
  });

  test('stock details page shows latest quote and percentage change', async ({
    page,
  }) => {
    // Get a test stock symbol
    const stockSymbol = getTestStockSymbols()[0];

    // Navigate to stock details page
    const stockDetailsPage = new StockDetailsPage(page);
    await stockDetailsPage.goto(stockSymbol);

    // Check that price is visible and is a number
    const price = await stockDetailsPage.getCurrentPrice();
    expect(price).toBeDefined();

    // Check that percentage change is visible
    const change = await stockDetailsPage.getPercentageChange();
    expect(typeof change).toBe('number');
  });
});
