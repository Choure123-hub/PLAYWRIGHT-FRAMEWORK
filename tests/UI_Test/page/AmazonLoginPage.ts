import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly signInSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using .or() makes the locator more robust in case Amazon changes the ID
    this.emailInput = page.locator('#ap_email').or(page.locator('input[name="email"]'));
    this.continueButton = page.locator('input#continue').or(page.locator('.a-button-input'));
    this.passwordInput = page.locator('#ap_password');
    this.signInSubmit = page.locator('#signInSubmit');
  }

  async login(email: string, password: string) {
    // Pre-check for CAPTCHA immediately after trying to navigate to the login page
    if (await this.page.locator('form[action="/errors/validateCaptcha"], h1:has-text("Solve this puzzle")').isVisible({ timeout: 5000 })) {
      console.error('\n🚨 Amazon blocked navigation to the login screen with an early CAPTCHA! 🚨\n');
      console.log('Pausing test. Please solve the CAPTCHA in the open browser window, then click "Resume" in the Playwright Inspector.');
      throw new Error('Amazon blocked navigation to the login screen with an early CAPTCHA.');
    }

    // Explicitly wait for the email input to be visible and click it to ensure focus
    await this.emailInput.first().waitFor({ state: 'visible', timeout: 25000 });
    await this.emailInput.first().click();
    // Use fill() for absolute reliability. It forces the value into the DOM and prevents focus-loss issues.
    await this.emailInput.first().fill(email);
    
    await this.continueButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.continueButton.first().click({ force: true }); // Force click to bypass overlay issues
    
    // Check if Amazon threw a CAPTCHA or OTP challenge
    const captchaOrOtp = this.page.locator('#auth-captcha-image-container, #cvf-page-helpers, h1:has-text("Solve this puzzle")');
    if (await captchaOrOtp.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.error('\n🚨 Amazon anti-bot security (CAPTCHA/OTP) detected! Automated login is blocked. 🚨\n');
      console.log('Pausing test. Please solve the challenge or enter the OTP in the browser window, then click "Resume".');
      throw new Error('Amazon anti-bot security (CAPTCHA/OTP) detected during login.');
    }

    // Wait for the password input to appear after clicking continue
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
    await this.signInSubmit.click();
    
    // Check if Amazon threw a CAPTCHA or OTP challenge AFTER password submission
    if (await captchaOrOtp.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.error('\n🚨 Amazon anti-bot security (CAPTCHA/OTP) detected after password! 🚨\n');
      throw new Error('Amazon anti-bot security (CAPTCHA/OTP) detected after password submission.');
    }
  }

  async verifyAccountPage() {
    // Reduced timeout to prevent exceeding global test timeout, failing gracefully instead
    await expect(this.page.locator('#nav-link-accountList-nav-line-1')).not.toHaveText('Hello, sign in', { timeout: 5000 });
  }
}