import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonCartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;
  readonly activeCartItems: Locator;
  readonly cartSubtotal: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use a highly robust regex to catch variations like "Your Amazon Cart is empty" or "Your Shopping Cart is empty"
    this.emptyCartMessage = page.getByText(/Cart is empty/i)
      .or(page.locator('.sc-your-amazon-cart-is-empty'));
    // Use robust fallbacks for dynamic Amazon DOMs
    this.activeCartItems = page.getByRole('list', { name: /Shopping Cart/i }).getByRole('listitem')
      .or(page.locator('#sc-active-cart .sc-list-item'))
      .or(page.locator('[data-name="Active Items"] .sc-list-item-content'));
    this.cartSubtotal = page.locator('#sc-subtotal-label-active-cart').or(page.getByText(/Subtotal \(/i));
    // Scope the delete button to the active cart to avoid clicking delete on "Saved for later" items.
    // Use specific attributes to avoid strict mode violations with the quantity stepper decrement button
    this.deleteButton = this.activeCartItems.first().locator('[data-action="delete-active"], [data-feature-id="item-delete-button"]').first();
  }

  async verifyRedirected() {
    await expect(this.page).toHaveURL(/.*cart/);
  }

  async verifyEmptyCart() {
    // The most reliable indicator of an empty cart on Amazon is the global cart count badge
    await expect(this.page.locator('#nav-cart-count')).toHaveText('0', { timeout: 10000 });
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
    // Handle test pollution: Previous tests might have left multiple items in the cart.
    // We click delete on the first item and wait for it to disappear, repeating until the cart is empty.
    let deleteBtnCount = await this.deleteButton.count();
    while (deleteBtnCount > 0) {
      await this.deleteButton.first().click();
      
      // Wait for the cart to process the deletion by checking that the total number of delete buttons decreases
      const currentCount = deleteBtnCount;
      await expect(async () => {
        expect(await this.deleteButton.count()).toBeLessThan(currentCount);
      }).toPass({ timeout: 5000 });
      
      deleteBtnCount = await this.deleteButton.count();
    }
    
    // Check the global cart badge instead of the main page text, as it updates instantly via AJAX and is not subject to A/B testing
    await expect(this.page.locator('#nav-cart-count')).toHaveText('0', { timeout: 10000 });
  }
}