import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { openHeaderSearch } from "../actions/search";
import { HomePage } from "../pages/home-page";
import { SiteHeader } from "../pages/site-header";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search overlay is closed.
test.describe("TC_038 - Open Home Search input", () => {
  test("Open Home Search input", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search icon.
    await openHeaderSearch(page);

    // Expected: Search input with placeholder "Search for...", Search submit button and Close control become visible on Home; the path stays /.
    const siteHeader = new SiteHeader(page);
    await expect(siteHeader.searchInput).toBeVisible();
    await expect(siteHeader.searchInput).toHaveAttribute("placeholder", "Search for...");
    await expect(siteHeader.searchSubmitButton).toBeVisible();
    await expect(siteHeader.searchCloseButton).toBeVisible();
    await expect(page).toHaveURL(HomePage.url);
  });
});
