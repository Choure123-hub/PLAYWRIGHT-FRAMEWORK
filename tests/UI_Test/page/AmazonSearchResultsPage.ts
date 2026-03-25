import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonSearchResultsPage {
  readonly page: Page;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Amazon frequently changes its DOM: sometimes the link contains the heading (a > h2), sometimes the heading contains the link (h2 > a).
    this.firstProductLink = page.locator('a:has(h2), h2 a').first();
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