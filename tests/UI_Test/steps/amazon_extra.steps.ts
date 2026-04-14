import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';
const { When, Then } = createBdd(test);

When('I filter the search results by 4 Stars and Up', async ({ searchResultsPage }) => {
  await searchResultsPage.filterByFourStarsAndUp();
});

When('I click on the Gift Cards link in the top menu', async ({ homePage }) => {
  await homePage.clickGiftCards();
});

Then('I should be redirected to the Gift Cards page', async ({ homePage }) => {
  await homePage.verifyOnGiftCardsPage();
});