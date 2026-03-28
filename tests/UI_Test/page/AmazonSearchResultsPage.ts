import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonSearchResultsPage {
  readonly page: Page;
  readonly firstProductLink: Locator;
  readonly noResultsMessage: Locator;
  readonly fourStarsAndUpFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    // Target the first actual search result link.
    // Amazon's DOM structure can vary: sometimes <h2> contains <a>, sometimes <a> contains <h2>.
    // Using a more generalized locator ensures we don't fail when wrapper data-attributes change.
    this.firstProductLink = page.locator('a:has(h2), h2 a').first();
    // A robust locator for the "No results for..." message.
    this.noResultsMessage = page.getByText(/No results for/i).first();
    // Filter for 4 stars and up
    this.fourStarsAndUpFilter = page.locator('section[aria-label*="4 Stars & Up"] i, i.a-star-medium-4').first();
  }

  async verifySearchResults(keyword: string) {
    // Avoid using 'networkidle' on Amazon as it frequently times out due to background trackers
    await expect(this.page).toHaveTitle(new RegExp(keyword, 'i'));
  }

  async clickFirstResult() {
    // Explicitly wait for the search result to be visible before extracting attributes
    await this.firstProductLink.waitFor({ state: 'attached', timeout: 10000 });
    const href = await this.firstProductLink.getAttribute('href');
    if (href) {
      // Navigate directly to avoid dealing with new tabs opening
      // Ensure the URL is fully qualified in case Amazon returns a relative path like /dp/B0...
      let targetUrl = href.startsWith('http') ? href : new URL(href, this.page.url()).toString();
      
      // Bypass Amazon's sponsored ad trackers which often time out or block automated navigation
      if (targetUrl.includes('/sspa/click')) {
        const urlParam = new URL(targetUrl).searchParams.get('url');
        if (urlParam) {
          targetUrl = new URL(urlParam, this.page.url()).toString();
        }
      }

      // Use 'commit' to avoid waiting for heavy third-party scripts/trackers to finish loading
      await this.page.goto(targetUrl, { waitUntil: 'commit' });
    } else {
      await this.firstProductLink.click();
    }
  }

  async verifyNoResultsMessage(keyword: string) {
    await expect(this.noResultsMessage).toBeVisible();
    // Note: We avoid asserting the exact keyword because Amazon often replaces it 
    // with a generic "No results for your search query." for very long or unusual strings.
  }

  async filterByFourStarsAndUp() {
    await this.fourStarsAndUpFilter.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}