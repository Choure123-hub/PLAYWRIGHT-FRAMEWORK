import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';


const { Given, When, Then } = createBdd(test);

Given('I navigate to the Amazon homepage', async ({ homePage }) => {
  await homePage.navigate();
});

When('I login with valid credentials', async ({ homePage, loginPage }) => {
  await homePage.clickSignIn();
  
  const email = process.env.AMAZON_EMAIL;
  const password = process.env.AMAZON_PASSWORD;

  // Throw a clear error if the environment variables are missing
  if (!email || !password) {
    throw new Error("Missing AMAZON_EMAIL or AMAZON_PASSWORD environment variables. Please check your .env file.");
  }

  await loginPage.login(email, password);
});

Then('I should see the account page', async ({ loginPage }) => {
  await loginPage.verifyAccountPage();
});

Then('I logout', async ({ homePage }) => {
  await homePage.logout();
  
});

When('I search for {string} on Amazon', async ({ homePage }, keyword: string) => {
  await homePage.searchForItem(keyword);
});

Then('I should see Amazon search results for {string}', async ({ searchResultsPage }, keyword: string) => {
  await searchResultsPage.verifySearchResults(keyword);
});

When('I click on the Amazon Cart button', async ({ homePage }) => {
  await homePage.clickCart();
});

Then('I should be redirected to the Amazon cart page', async ({ cartPage }) => {
  await cartPage.verifyRedirected();
});

Then('I should see the Amazon empty cart message', async ({ cartPage }) => {
  await cartPage.verifyEmptyCart();
});
