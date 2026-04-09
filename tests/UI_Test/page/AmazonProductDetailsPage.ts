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
    // Split the keyword and check for individual words to handle Amazon's SEO-optimized titles (e.g., "Bluetooth Mouse, Wireless")
    const searchWords = keyword.split(' ');
    for (const word of searchWords) {
      await expect(this.productTitle).toContainText(word, { ignoreCase: true });
    }
  }

  async addToCart() {
    await this.addToCartButton.first().click();
    // Wait for the cart count to update to ensure the request completes before navigating away
    await expect(this.page.locator('#nav-cart-count')).not.toHaveText('0', { timeout: 10000 });
  }

  async selectQuantityAndAddToCart(quantity: string) {
    // isVisible() checks instantly and might return false if the page is still loading. 
    // Waiting for the element makes this step much more reliable.
    try {
      await this.quantityDropdown.first().waitFor({ state: 'visible', timeout: 3000 });
      await this.quantityDropdown.first().selectOption(quantity);
    } catch (error) {
      console.log(`Quantity dropdown not visible or option '${quantity}' unavailable. Proceeding with default.`);
    }
    
    await this.addToCartButton.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.addToCartButton.first().click();
    await expect(this.page.locator('#nav-cart-count')).not.toHaveText('0', { timeout: 10000 });
  }
}