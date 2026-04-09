import { test as base } from 'playwright-bdd';
import { AmazonHomePage } from '../page/AmazonHomePage';
import { AmazonLoginPage } from '../page/AmazonLoginPage';
import { AmazonSearchResultsPage } from '../page/AmazonSearchResultsPage';
import { AmazonCartPage } from '../page/AmazonCartPage';
import { AmazonProductDetailsPage } from '../page/AmazonProductDetailsPage';
import type { World } from '../type/world';


type Fixtures = {
  homePage: AmazonHomePage;
  loginPage: AmazonLoginPage;
  searchResultsPage: AmazonSearchResultsPage;
  cartPage: AmazonCartPage;
  productDetailsPage: AmazonProductDetailsPage;
  world: World;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => await use(new AmazonHomePage(page)),
  loginPage: async ({ page }, use) => await use(new AmazonLoginPage(page)),
  searchResultsPage: async ({ page }, use) => await use(new AmazonSearchResultsPage(page)),
  cartPage: async ({ page }, use) => await use(new AmazonCartPage(page)),
  productDetailsPage: async ({ page }, use) => await use(new AmazonProductDetailsPage(page)),
  // This creates a new, empty object for each scenario.
   world: async ({ page }, use) => await use({} as World),
});