import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonCartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartMessage = page.locator('h2:has-text("Your Amazon Cart is empty")').or(page.locator('.sc-your-amazon-cart-is-empty'));
  }

  async verifyRedirected() {
    await expect(this.page).toHaveURL(/.*cart/);
  }

  async verifyEmptyCart() {
    await expect(this.emptyCartMessage.first()).toBeVisible();
  }
}