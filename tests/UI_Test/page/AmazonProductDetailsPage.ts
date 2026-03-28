import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonProductDetailsPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly quantityDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('#productTitle').first();
    // The add to cart button can have different IDs, let's make it robust
    this.addToCartButton = page.locator('#add-to-cart-button, #buy-now-button');
    this.quantityDropdown = page.locator('#quantity').or(page.getByRole('combobox', { name: /Quantity/i }));
  }

  async verifyProductDetailsPage(keyword: string) {
    await expect(this.productTitle).toBeVisible({ timeout: 20000 });
    await expect(this.productTitle).toContainText(keyword, { ignoreCase: true });
  }

  async addToCart() {
    await this.addToCartButton.first().click();
    // Wait for the cart count to update to ensure the request completes before navigating away
    await expect(this.page.locator('#nav-cart-count')).not.toHaveText('0', { timeout: 10000 });
  }

  async selectQuantityAndAddToCart(quantity: string) {
    if (await this.quantityDropdown.first().isVisible()) {
      await this.quantityDropdown.first().selectOption(quantity);
    }
    await this.addToCartButton.first().click();
    await expect(this.page.locator('#nav-cart-count')).not.toHaveText('0', { timeout: 10000 });
  }
}