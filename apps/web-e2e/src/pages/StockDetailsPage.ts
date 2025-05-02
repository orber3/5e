import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Stock Details page object for stock details page interactions
 */
export class StockDetailsPage extends BasePage {
  // Selectors
  readonly titleSelector = 'h2';
  readonly priceStatisticSelector =
    '.ant-statistic-title:has-text("Price") + .ant-statistic-content';
  readonly changeStatisticSelector =
    '.ant-statistic-title:has-text("Change") + .ant-statistic-content';
  readonly addToPortfolioButtonSelector = 'button:has([data-icon="plus"])';
  readonly backToPortfolioButtonSelector = 'button:has([data-icon="left"])';
  readonly loadingSpinnerSelector = '.ant-spin';
  readonly positiveChangeClass =
    '.ant-statistic-content-value-int[style*="color: green"]';
  readonly negativeChangeClass =
    '.ant-statistic-content-value-int[style*="color: red"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to stock details page
   */
  async goto(symbol: string) {
    await this.navigateTo(`http://localhost:4200/stocks/${symbol}`);
    await this.waitForNavigation();
  }

  /**
   * Get stock name and symbol from the title
   */
  async getStockTitle() {
    return await this.getText(this.titleSelector);
  }

  /**
   * Get current stock price
   */
  async getCurrentPrice() {
    const priceText = await this.getText(this.priceStatisticSelector);
    // Remove $ symbol and convert to number
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Get percentage change
   */
  async getPercentageChange() {
    const changeText = await this.getText(this.changeStatisticSelector);
    // Extract percentage value from text like "+1.23%"
    const match = changeText.match(/([+-]?\d+\.\d+)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Check if price change is positive
   */
  async isPriceChangePositive() {
    const changeText = await this.getText(this.changeStatisticSelector);
    // Check if text starts with + or check for green color class
    return (
      changeText.trim().startsWith('+') ||
      (await this.page.locator(this.positiveChangeClass).count()) > 0
    );
  }

  /**
   * Check if price change is negative
   */
  async isPriceChangeNegative() {
    const changeText = await this.getText(this.changeStatisticSelector);
    // Check if text starts with - or check for red color class
    return (
      changeText.trim().startsWith('-') ||
      (await this.page.locator(this.negativeChangeClass).count()) > 0
    );
  }

  /**
   * Add stock to portfolio
   */
  async addToPortfolio() {
    await this.click(this.addToPortfolioButtonSelector);
    // Wait for any loading indication to finish
    if (await this.isVisible(this.loadingSpinnerSelector)) {
      await this.page.waitForSelector(this.loadingSpinnerSelector, {
        state: 'hidden',
      });
    }
  }

  /**
   * Navigate back to portfolio page
   */
  async backToPortfolio() {
    await this.click(this.backToPortfolioButtonSelector);
    await this.waitForNavigation();
  }
}
