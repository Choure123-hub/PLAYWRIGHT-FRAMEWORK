import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

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