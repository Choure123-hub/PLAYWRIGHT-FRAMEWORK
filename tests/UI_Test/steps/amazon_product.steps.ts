import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { When, Then } = createBdd(test);

When('I click on the first search result', async ({ searchResultsPage }) => {
  await searchResultsPage.clickFirstResult();
});

Then('I should see the product details page', async ({ productDetailsPage }) => {
  await productDetailsPage.verifyPageLoaded();
});