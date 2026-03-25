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
    // Scroll to the top of the page to ensure the navigation bar is fully in view
    await this.page.evaluate(() => window.scrollTo(0, 0));
    
    await this.signInLink.hover();
    
    // Explicitly wait for the sign-out link to become visible (using first() to prevent strict mode errors)
    const signoutBtn = this.signOutLink.first();
    await signoutBtn.waitFor({ state: 'visible', timeout: 10000 });
    // Force click bypasses any hovering animation overlays that might block standard clicks
    await signoutBtn.click({ force: true });
    
    // Wait for the element to be attached to the DOM (it usually already is)
    await signoutBtn.waitFor({ state: 'attached', timeout: 10000 });
    // Use evaluate to perform a native DOM click, bypassing Playwright's strict visibility checks.
    await signoutBtn.evaluate((el: HTMLElement) => el.click());
  }
}