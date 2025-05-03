import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Portfolio page object for portfolio page interactions
 */
export class PortfolioPage extends BasePage {
  // Selectors
  readonly titleSelector = 'h2:text("My Stock Portfolio")';
  readonly emptyStateSelector = 'main img[alt="No data"]';
  readonly emptyStateTextSelector =
    'main div:has-text("Your portfolio is empty")';
  readonly refreshButtonSelector = 'button:has([data-icon="reload"])';
  readonly loadingSpinnerSelector = '.ant-spin';
  readonly stockTableSelector = 'table';
  readonly stockCountTextSelector = 'main > div > span';

  // Table related selectors
  readonly stockRowSelector = (symbol: string) =>
    `tr[data-row-key="${symbol}"]`;
  readonly removeStockButtonSelector = (symbol: string) =>
    `tr:has(strong:text("${symbol}")) button:has([data-icon="delete"])`;
  readonly viewDetailsButtonSelector = (symbol: string) =>
    `tr:has(strong:text("${symbol}")) button:has([data-icon="arrow-right"])`;

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to portfolio page
   */
  async goto() {
    await this.navigateTo('http://localhost:4200/portfolio');
    await this.waitForNavigation();
  }

  /**
   * Check if portfolio is empty
   */
  async isPortfolioEmpty() {
    try {
      // Wait for either the empty state or the table to appear
      await Promise.race([
        this.page.waitForSelector('[data-testid="portfolio-empty-state"]', {
          timeout: 5000,
        }),
        this.page.waitForSelector('table', {
          timeout: 5000,
        }),
      ]);

      // Check if empty state image is visible or empty state text is visible
      const emptyStateVisible =
        (await this.isVisible(this.emptyStateSelector)) ||
        (await this.isVisible(this.emptyStateTextSelector));

      return emptyStateVisible;
    } catch {
      // If we get a timeout, check if the table exists
      const tableExists = (await this.page.locator('table').count()) > 0;
      // If table exists, portfolio is not empty
      return !tableExists;
    }
  }

  /**
   * Get the number of stocks in portfolio
   */
  async getStockCount() {
    if (await this.isPortfolioEmpty()) {
      return 0;
    }
    const countText = await this.getText(this.stockCountTextSelector);
    // Extract number from text like "You have 3 stocks in your portfolio"
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Check if stock exists in portfolio
   */
  async hasStock(symbol: string) {
    if (await this.isPortfolioEmpty()) {
      return false;
    }

    try {
      // Check if the element exists at all by using count
      const count = await this.page
        .locator(this.stockRowSelector(symbol))
        .count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Refresh stock quotes
   */
  async refreshQuotes() {
    await this.click(this.refreshButtonSelector);
    // Wait for any loading indication to finish
    if (await this.isVisible(this.loadingSpinnerSelector)) {
      await this.page.waitForSelector(this.loadingSpinnerSelector, {
        state: 'hidden',
      });
    }
  }

  /**
   * Remove stock from portfolio
   */
  async removeStock(symbol: string) {
    await this.click(this.removeStockButtonSelector(symbol));

    // Wait for the row to be removed or notification to appear
    try {
      await this.page.waitForSelector(this.stockRowSelector(symbol), {
        state: 'hidden',
        timeout: 3000,
      });
    } catch (e) {
      // If waiting for hidden fails, check for notification that confirms removal
      await this.page.waitForSelector(
        'div[role="alert"]:has-text("removed from portfolio")',
        {
          state: 'visible',
          timeout: 3000,
        }
      );
    }
  }

  /**
   * Navigate to stock details page
   */
  async viewStockDetails(symbol: string) {
    await this.click(this.viewDetailsButtonSelector(symbol));
    await this.waitForNavigation();
  }
}
