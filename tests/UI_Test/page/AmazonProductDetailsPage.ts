import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonProductDetailsPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Broaden the locator to catch different Add to Cart input elements
    this.addToCartButton = page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]');
    this.buyNowButton = page.locator('#buy-now-button');
  }

  async verifyPageLoaded() {
    // Use toBeAttached() instead of toBeVisible() because Amazon visually hides the <input> element via CSS
    await expect(this.addToCartButton.or(this.buyNowButton).first()).toBeAttached({ timeout: 15000 });
  }

  async clickAddToCart() {
    // Amazon's complex UI often has transparent overlays or scripts that intercept simulated mouse clicks.
    // Executing a native DOM click via JavaScript bypasses all UI rendering checks.
    const cartBtn = this.addToCartButton.first();
    await cartBtn.waitFor({ state: 'attached', timeout: 10000 });
    await cartBtn.evaluate((el: HTMLElement) => el.click());

    // Wait a brief moment for Amazon's sliding cart panel or redirect to process
    await this.page.waitForTimeout(3000);
  }
}