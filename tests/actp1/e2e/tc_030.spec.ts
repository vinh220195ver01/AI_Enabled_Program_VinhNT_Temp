import { test, expect } from "@playwright/test";
import { openHomePage, scrollToHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS, HomePage } from "../pages/home-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset.
test.describe("TC_030 - Verify Latest Products is in Home scope", () => {
  test("Verify Latest Products is in Home scope", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    await scrollToHomeSection(page, LATEST_PRODUCTS);

    // Expected: The "Latest Products" discovery section is present on Home.
    await expect(new HomePage(page).sectionHeading(LATEST_PRODUCTS)).toBeVisible();
  });
});
