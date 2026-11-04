import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { openHeaderSearch } from "../actions/search";
import { LATEST_PRODUCTS, HomePage } from "../pages/home-page";
import { SiteHeader } from "../pages/site-header";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Home Search overlay is open.
test.describe("TC_039 - Close the Home Search overlay", () => {
  test("Close the Home Search overlay", async ({ page }) => {
    // Precondition: Home Search overlay is open.
    await openHomePage(page);
    await openHeaderSearch(page);

    // Step 1: Click "Close".
    const siteHeader = new SiteHeader(page);
    await siteHeader.closeSearch();

    // Expected: The Search overlay is dismissed and Home remains displayed. No search is submitted.
    await expect(siteHeader.searchInput).toBeHidden();
    await expect(page).toHaveURL(HomePage.url);
    await expect(new HomePage(page).sectionHeading(LATEST_PRODUCTS)).toBeVisible();
  });
});
