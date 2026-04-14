import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';

const { Before, After } = createBdd(test);

// 👉 Global Before (runs for all scenarios)
Before(async ({ homePage }) => {
  console.log('🚀 Launching Amazon');

  await homePage.navigate(); // already background मध्ये आहे, but hook मध्ये central control
});


// 👉 Tag based login hook
Before({ tags: '@login' }, async ({ homePage, loginPage }) => {
  console.log('🔐 Login Hook');

  await homePage.clickSignIn();

  const email = process.env.AMAZON_EMAIL;
  const password = process.env.AMAZON_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing AMAZON_EMAIL or AMAZON_PASSWORD");
  }

  await loginPage.login(email, password);
});


// 👉 After hook (cleanup/logging)
// After(async ({ homePage}) => {
//   await homePage.logout();
//   console.log('🧹 Test Completed');

//   // Optional: screenshot on failure (advanced)
//   // if (test.info().status !== test.info().expectedStatus) {
//   //   await page.screenshot({ path: 'failure.png' });
//   // }
// });
After({ tags: '@login' }, async ({ homePage }) => {
  await homePage.logout();
  console.log('🧹 Test Completed');
});