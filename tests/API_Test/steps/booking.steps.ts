import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/apiFixtures';
import { expect } from '@playwright/test';

// Pass our custom API test fixture to createBdd
const { When, Then } = createBdd(test);

When('I create a new booking for {string} {string}', async ({ bookingApi, apiContext }, firstname: string, lastname: string) => {
  const response = await bookingApi.createBooking(firstname, lastname);
  
  // Save the response and ID to the shared apiContext for validation in subsequent steps
  apiContext.lastResponse = response;
  const responseBody = await response.json();
  apiContext.bookingId = responseBody.bookingid;
});

Then('the booking response should be successful', async ({ apiContext }) => {
  expect(apiContext.lastResponse, 'The API response was not stored in the context').toBeDefined();
  expect(apiContext.lastResponse!.ok()).toBeTruthy();
  expect(apiContext.lastResponse!.status()).toBe(200);
});

Then('I should be able to retrieve the created booking to verify the details', async ({ bookingApi, apiContext }) => {
  expect(apiContext.bookingId, 'The booking ID was not stored in the context').toBeDefined();
  const response = await bookingApi.getBooking(apiContext.bookingId!);
  expect(response.status()).toBe(200);
});

When('I attempt to retrieve a booking with an invalid ID {int}', async ({ bookingApi, apiContext }, invalidId: number) => {
  const response = await bookingApi.getBooking(invalidId);
  apiContext.lastResponse = response;
});

Then('the API response status should be {int}', async ({ apiContext }, expectedStatus: number) => {
  expect(apiContext.lastResponse, 'The API response was not stored in the context').toBeDefined();
  expect(apiContext.lastResponse!.status()).toBe(expectedStatus);
});

Then('the retrieved booking details should match firstname {string} and lastname {string}', async ({ bookingApi, apiContext }, firstname: string, lastname: string) => {
  expect(apiContext.bookingId, 'The booking ID was not stored in the context').toBeDefined();
  const response = await bookingApi.getBooking(apiContext.bookingId!);
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.firstname).toBe(firstname);
  expect(responseBody.lastname).toBe(lastname);
});