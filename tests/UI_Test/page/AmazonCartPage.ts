import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonCartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;
  readonly activeCartItems: Locator;
  readonly cartSubtotal: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartMessage = page.locator('h2:has-text("Your Amazon Cart is empty")').or(page.locator('.sc-your-amazon-cart-is-empty'));
    // Use robust fallbacks for dynamic Amazon DOMs
    this.activeCartItems = page.getByRole('list', { name: /Shopping Cart/i }).getByRole('listitem')
      .or(page.locator('#sc-active-cart .sc-list-item'))
      .or(page.locator('[data-name="Active Items"] .sc-list-item-content'));
    this.cartSubtotal = page.locator('#sc-subtotal-label-active-cart').or(page.getByText(/Subtotal \(/i));
    // Scope the delete button to the active cart to avoid clicking delete on "Saved for later" items.
    this.deleteButton = this.activeCartItems.first().getByRole('button', { name: /Delete/i });
  }

  async verifyRedirected() {
    await expect(this.page).toHaveURL(/.*cart/);
  }

  async verifyEmptyCart() {
    await expect(this.emptyCartMessage.first()).toBeVisible();
  }

  async verifyProductAdded() {
    // After adding, we might be on a confirmation page or a side-sheet might be open.
    // A reliable way to check is to navigate directly to the cart.
    await this.page.goto('/gp/cart/view.html', { waitUntil: 'domcontentloaded' });

    // The cart subtotal should not show "0 items".
    await expect(this.cartSubtotal.first()).not.toContainText('0 items', { timeout: 10000 });
    await expect(this.activeCartItems.first()).toBeVisible();
  }

  async removeProduct() {
    await this.deleteButton.click();
    // The click triggers a dynamic update. Wait for the empty cart message to appear,
    // which confirms the product has been removed.
    await expect(this.emptyCartMessage.first()).toBeVisible({ timeout: 10000 });
  }
}