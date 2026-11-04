import { test, expect } from "@playwright/test";
import { PlaywrightPage } from "../pages/playwright.page";

test("TC04 - Verify Navigation to API Reference Documentation", async ({ page }) => {
  const playwrightPage = new PlaywrightPage(page);

  // Step 1: Open https://playwright.dev/
  await playwrightPage.openHomePage();
  // Expected Result: Playwright homepage is displayed successfully.
  await expect(page).toHaveTitle(/Playwright/i);

  // Step 2: Click the "API" navigation link in the top navigation bar.
  await playwrightPage.openApiReference();
  // Expected Result: The API reference landing page is opened.
  await expect(page).toHaveURL(/\/docs\/api\//);

  // Step 3: Verify the current URL contains "/docs/api/".
  // Expected Result: URL matches the expected API documentation path.
  await expect(page).toHaveURL(/\/docs\/api\//);

  // Step 4: Verify the page displays a sidebar/menu listing API categories (e.g., "Class: Page", "Class: Browser").
  // Expected Result: API class categories are visible in the sidebar.
  await expect(playwrightPage.pageClassLink).toBeVisible();
  await expect(playwrightPage.browserClassLink).toBeVisible();

  // Step 5: Click the "Class: Page" link from the sidebar.
  await playwrightPage.openPageClassDocumentation();
  // Expected Result: The Page class API documentation page is opened.
  await expect(page).toHaveURL(/\/docs\/api\/class-page/);

  // Step 6: Verify the page heading is "Page".
  // Expected Result: A "Page" heading is visible.
  await expect(playwrightPage.pageHeading).toBeVisible();

  // Step 7: Verify the page lists method signatures (e.g., "page.click()").
  // Expected Result: Method signatures/entries are displayed on the page.
  await expect(playwrightPage.pageClickMethod).toBeVisible();
});