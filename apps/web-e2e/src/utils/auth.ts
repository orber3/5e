import { Page } from '@playwright/test';

/**
 * Authentication utilities for e2e tests
 */
export class Auth {
  readonly page: Page;
  readonly loginPath = '/login';
  readonly emailInputSelector = 'input[type="email"]';
  readonly passwordInputSelector = 'input[type="password"]';
  readonly loginButtonSelector = 'button[type="submit"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Login to application with given credentials
   * @param email User email
   * @param password User password
   */
  async login(email: string, password: string) {
    await this.page.goto('http://localhost:4200/login');

    // Fill in form fields
    await this.page.fill(this.emailInputSelector, email);
    await this.page.fill(this.passwordInputSelector, password);

    // Click login button and wait for navigation
    await this.page.click(this.loginButtonSelector);
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for redirect after login (assumes redirect to portfolio)
    await this.page.waitForURL(/\/portfolio/);
  }

  /**
   * Save authentication state to file for reuse
   * @param filePath Path to save auth state
   */
  async saveAuthState(filePath: string) {
    await this.page.context().storageState({ path: filePath });
  }
}

/**
 * Helper function to perform login before tests
 */
export async function setupAuth(page: Page, email: string, password: string) {
  const auth = new Auth(page);
  await auth.login(email, password);

  // Return auth instance for further operations
  return auth;
}
