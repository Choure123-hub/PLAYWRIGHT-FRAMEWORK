import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonSearchResultsPage {
  readonly page: Page;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Target the first actual search result link, strictly ignoring sponsored brand banners
    // Amazon's DOM structure can vary: sometimes <h2> contains <a>, sometimes <a> contains <h2>.
    this.firstProductLink = page.locator('[data-component-type="s-search-result"] a:has(h2), [data-component-type="s-search-result"] h2 a').first();
  }

  async verifySearchResults(keyword: string) {
    // Avoid using 'networkidle' on Amazon as it frequently times out due to background trackers
    await expect(this.page).toHaveTitle(new RegExp(keyword, 'i'));
  }

  async clickFirstResult() {
    const href = await this.firstProductLink.getAttribute('href');
    if (href) {
      // Navigate directly to avoid dealing with new tabs opening
      await this.page.goto(href);
    } else {
      await this.firstProductLink.click();
    }
  }
}