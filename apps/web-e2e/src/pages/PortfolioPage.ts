import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Portfolio page object for portfolio page interactions
 */
export class PortfolioPage extends BasePage {
  // Selectors
  readonly titleSelector = 'h2:has-text("Portfolio")';
  readonly emptyStateSelector = '.ant-empty';
  readonly refreshButtonSelector = 'button:has([data-icon="reload"])';
  readonly loadingSpinnerSelector = '.ant-spin';
  readonly stockTableSelector = '.ant-table';
  readonly stockCountTextSelector = 'div.ant-card-body > span.ant-typography';

  // Table related selectors
  readonly stockRowSelector = (symbol: string) =>
    `tr[data-row-key="${symbol}"]`;
  readonly removeStockButtonSelector = (symbol: string) =>
    `tr[data-row-key="${symbol}"] button:has([data-icon="delete"])`;
  readonly viewDetailsButtonSelector = (symbol: string) =>
    `tr[data-row-key="${symbol}"] button:has([data-icon="eye"])`;

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
    return await this.isVisible(this.emptyStateSelector);
  }

  /**
   * Get the number of stocks in portfolio
   */
  async getStockCount() {
    const countText = await this.getText(this.stockCountTextSelector);
    // Extract number from text like "You have 3 stocks in your portfolio"
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Check if stock exists in portfolio
   */
  async hasStock(symbol: string) {
    return await this.isVisible(this.stockRowSelector(symbol));
  }

  /**
   * Refresh stock quotes
   */
  async refreshQuotes() {
    await this.click(this.refreshButtonSelector);
    // Wait for loading spinner to appear and disappear
    await this.waitForElement(this.loadingSpinnerSelector);
    await this.page.waitForSelector(this.loadingSpinnerSelector, {
      state: 'hidden',
    });
  }

  /**
   * Remove stock from portfolio
   */
  async removeStock(symbol: string) {
    await this.click(this.removeStockButtonSelector(symbol));
    // Wait for the row to be removed
    await this.page.waitForSelector(this.stockRowSelector(symbol), {
      state: 'hidden',
    });
  }

  /**
   * Navigate to stock details page
   */
  async viewStockDetails(symbol: string) {
    await this.click(this.viewDetailsButtonSelector(symbol));
    await this.waitForNavigation();
  }
}
