import { test as base } from 'playwright-bdd';
import type { APIResponse } from '@playwright/test';
import { BookingApi } from '../BookingApi';

// Define the types for our custom API fixtures
export type ApiFixtures = {
  bookingApi: BookingApi;
  apiContext: {
    lastResponse?: APIResponse;
    bookingId?: number;
  };
};

// Extend standard Playwright test with our new fixtures
export const test = base.extend<ApiFixtures>({
  bookingApi: async ({ request }, use) => {
    await use(new BookingApi(request));
  },
  apiContext: async ({}, use) => {
    await use({});
  },
});