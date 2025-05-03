import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Stock Details page object for stock details page interactions
 */
export class StockDetailsPage extends BasePage {
  // Selectors
  readonly titleSelector = 'h2';
  readonly priceStatisticId = 'price-statistic';
  readonly changeStatisticId = 'change-statistic';
  readonly addToPortfolioButtonSelector = 'button:has([data-icon="plus"])';
  readonly backToPortfolioButtonSelector = 'button:has([data-icon="left"])';
  readonly loadingSpinnerSelector = 'p:text("Loading stock details...")';
  readonly positiveChangeClass = 'div:has-text("+")';
  readonly negativeChangeClass = 'div:has-text("-")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to stock details page
   */
  async goto(symbol: string) {
    await this.navigateTo(`http://localhost:4200/stocks/${symbol}`);
    await this.waitForNavigation();

    // Wait for loading to complete if it appears
    if (await this.isVisible(this.loadingSpinnerSelector)) {
      await this.page.waitForSelector(this.loadingSpinnerSelector, {
        state: 'hidden',
        timeout: 10000,
      });
    }
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
    const priceText = await this.page
      .locator(`[data-testid="${this.priceStatisticId}"]`)
      .innerText();

    // Clean up the price text by removing all non-numeric characters except decimal point
    const cleanedText = priceText.replace(/[^\d.]/g, '');
    const number = parseFloat(cleanedText);
    return isNaN(number) ? undefined : number; // Return 204 as fallback if parsing fails
  }

  /**
   * Get percentage change
   */
  async getPercentageChange() {
    const changeText = await this.page
      .locator(`[data-testid="${this.changeStatisticId}"]`)
      .innerText();
    // Extract percentage value from text like "+1.23%"

    const match = changeText.match(/([+-]?\d+\.\d+)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Check if price change is positive
   */
  async isPriceChangePositive() {
    const changeText = await this.page
      .locator(`[data-testid="${this.changeStatisticId}"]`)
      .innerText();
    // Check if text starts with +
    return changeText.trim().startsWith('+');
  }

  /**
   * Check if price change is negative
   */
  async isPriceChangeNegative() {
    const changeText = await this.page
      .locator(`[data-testid="${this.changeStatisticId}"]`)
      .innerText();
    // Check if text contains a negative sign
    const trimmedChangeText = changeText.trim();
    // Use includes or regex to check for negative sign more reliably
    const isNegative =
      trimmedChangeText.includes('-') || /^-\d/.test(trimmedChangeText);
    return isNegative;
  }

  /**
   * Add stock to portfolio
   */
  async addToPortfolio() {
    await this.click(this.addToPortfolioButtonSelector);
  }

  /**
   * Navigate back to portfolio page
   */
  async backToPortfolio() {
    await this.click(this.backToPortfolioButtonSelector);
    await this.waitForNavigation();
  }
}
