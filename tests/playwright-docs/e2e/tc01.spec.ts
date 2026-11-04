import { test, expect } from "@playwright/test";
import { PlaywrightPage } from "../pages/playwright.page";

test("TC01 - Verify Playwright Installation Documentation", async ({ page }) => {
  const playwrightPage = new PlaywrightPage(page);

  await playwrightPage.openHomePage();
  // Step 1: Open https://playwright.dev/
  // Expected Result: Playwright homepage is displayed successfully.
  await expect(page).toHaveTitle(/Playwright/i);

  // Step 2: Verify the page contains the Playwright branding/title.
  // Expected Result: Playwright branding/title is visible.
  await expect(playwrightPage.homepageHeading).toBeVisible();

  await playwrightPage.openGettingStarted();
  // Step 3: Click the Get started navigation link.
  // Expected Result: The Getting Started documentation page/section is opened.
  await expect(page).toHaveURL(/\/docs\/intro/);

  await playwrightPage.openInstallation();
  // Step 4: Click the Installation documentation link.
  // Expected Result: The Installation documentation page is opened.
  await expect(playwrightPage.installationHeading).toBeVisible();

  // Step 5: Verify the current URL is https://playwright.dev/docs/intro.
  // Expected Result: URL matches the expected Installation documentation URL.
  await expect(page).toHaveURL("https://playwright.dev/docs/intro");

  // Step 6: Verify the page heading is Installation.
  // Expected Result: An Installation heading is visible.
  await expect(playwrightPage.installationHeading).toBeVisible();

  // Step 7: Verify the page contains the Introduction section.
  // Expected Result: The Introduction section is visible.
  await expect(playwrightPage.introductionHeading).toBeVisible();

  // Step 8: Verify the page contains information about installing Playwright.
  // Expected Result: Installation instructions are displayed.
  await expect(playwrightPage.installingPlaywrightHeading).toBeVisible();

  // Step 9: Verify the page contains the npm init playwright@latest installation command.
  // Expected Result: The npm installation command is displayed.
  await expect(playwrightPage.installationCommand).toBeVisible();
});
