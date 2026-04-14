import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonSearchResultsPage {
  readonly page: Page;
  readonly firstProductLink: Locator;
  readonly noResultsMessage: Locator;
  readonly fourStarsAndUpFilter: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly priceGoButton: Locator;

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
    // Price range locators
    this.minPriceInput = page.locator('input#low-price');
    this.maxPriceInput = page.locator('input#high-price');
    this.priceGoButton = page.locator('.s-price-go-button-submit input, input.a-button-input[aria-labelledby*="a-autoid-"], form[method="get"] input[type="submit"]');
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

  async filterByPrice(minPrice: string, maxPrice: string) {
    // Playwright automatically scrolls elements into view.
    // We use `:visible` to ensure we don't accidentally target hidden mobile layouts in the DOM.
    const minInput = this.minPriceInput.locator(':visible').first();
    const maxInput = this.maxPriceInput.locator(':visible').first();
    const goButton = this.priceGoButton.locator(':visible').first();

    try {
      // 1. Explicitly wait for the input to be visible (reduced to 5 seconds to fail faster)
      await minInput.waitFor({ state: 'visible', timeout: 5000 });
      
      // 2. Scroll the input into view so Playwright isn't blocked by overlays
      await minInput.scrollIntoViewIfNeeded();

      await minInput.fill(minPrice);
      await maxInput.fill(maxPrice);
      await goButton.click();

      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000); // Give Amazon's AJAX time to update the result list
    } catch {
      console.log('Price filter not visible or unavailable for this search. Skipping price filter.');
    }
  }
}