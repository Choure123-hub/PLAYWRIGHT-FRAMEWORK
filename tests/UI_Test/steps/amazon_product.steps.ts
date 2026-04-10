import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';
import { expect } from '@playwright/test';

const { When, Then } = createBdd(test);

When('I click on the first search result', async ({ searchResultsPage }) => {
  await searchResultsPage.clickFirstResult();
});

Then('I should see the {string} product details page', async ({ productDetailsPage }, keyword: string) => {  
  await productDetailsPage.verifyProductDetailsPage(keyword);
});

When('I add the product to the cart', async ({ productDetailsPage }) => {
  await productDetailsPage.addToCart();
});

Then('I should see the product in the cart', async ({ cartPage }) => {
  await cartPage.verifyProductAdded();
});

When('I search for a product that does not exist', async ({ homePage, world }) => {
  world.productName = 'a_very_long_and_unlikely_product_name_xyz';
  await homePage.searchForItem(world.productName);
});

Then('I should see a "no results" message', async ({ searchResultsPage, world }) => {
  // The keyword is now retrieved from the shared context, not the feature file.
  await searchResultsPage.verifyNoResultsMessage(world.productName!);
});

When('I remove the product from the cart', async ({ cartPage }) => {
  await cartPage.removeProduct();
});

Then('I should see that the cart is empty', async ({ cartPage }) => {
  await cartPage.verifyEmptyCart();
});

When('I filter the search results by 4 stars and up', async ({ searchResultsPage }) => {
  await searchResultsPage.filterByFourStarsAndUp();
});

When('I select quantity {string} and add the product to the cart', async ({ productDetailsPage }, quantity: string) => {
  await productDetailsPage.selectQuantityAndAddToCart(quantity);
});

When('I filter the price range from {string} to {string}', async ({ searchResultsPage }, minPrice: string, maxPrice: string) => {
  await searchResultsPage.filterByPrice(minPrice, maxPrice);
});

Then('I intentionally fail the test', async () => {
  throw new Error('This is an intentional failure to test reports and screenshot captures.');
});

Then('I should be logged in successfully', async ({ loginPage }) => {
  await loginPage.verifyAccountPage();
});

When('I logout of the account', async ({ page }) => {
  await page.locator('#nav-link-accountList').hover();
  await page.locator('#nav-item-signout').click();
});

Then('I should be redirected to the sign-in page', async ({ page }) => {
  await expect(page.locator('h1').filter({ hasText: /Sign in/i })).toBeVisible({ timeout: 10000 });
});