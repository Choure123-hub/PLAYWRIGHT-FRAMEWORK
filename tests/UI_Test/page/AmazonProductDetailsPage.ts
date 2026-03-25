import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonProductDetailsPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('#add-to-cart-button');
    this.buyNowButton = page.locator('#buy-now-button');
  }

  async verifyPageLoaded() {
    // Use toBeAttached() instead of toBeVisible() because Amazon visually hides the <input> element via CSS
    await expect(this.addToCartButton.or(this.buyNowButton).first()).toBeAttached({ timeout: 15000 });
  }
}