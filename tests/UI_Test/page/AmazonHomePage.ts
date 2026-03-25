import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonHomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartButton: Locator;
  readonly signInLink: Locator;
  readonly signOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#twotabsearchtextbox');
    this.searchButton = page.locator('#nav-search-submit-button');
    this.cartButton = page.locator('#nav-cart');
    this.signInLink = page.locator('#nav-link-accountList');
    // Broaden the locator to handle dynamic Amazon DOM changes
    this.signOutLink = page.locator('#nav-item-signout').or(page.locator('text="Sign Out"'));
  }

  async navigate() {
    await this.page.goto('/');
  }

  async clickSignIn() {
    // Playwright automatically waits for the element to be actionable
    await this.signInLink.click();
  }

  async searchForItem(item: string) {
    await this.searchInput.fill(item);
    await this.searchButton.click();
  }

  async clickCart() {
    await this.cartButton.click();
  }

  async logout() {
    // Trying to hover and click the logout button is highly flaky on Amazon due to bot protection.
    // The most reliable way to log out in automation is to hit the logout endpoint directly.
    await this.page.goto('/gp/flex/sign-out.html');
  }
}