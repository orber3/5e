import { Page, expect } from '@playwright/test';

/**
 * Base page object with common functionality for all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string) {
    return await this.page.isVisible(selector);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get text from an element
   */
  async getText(selector: string) {
    await this.waitForElement(selector);
    return await this.page.locator(selector).innerText();
  }

  /**
   * Click an element
   */
  async click(selector: string) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }
}
