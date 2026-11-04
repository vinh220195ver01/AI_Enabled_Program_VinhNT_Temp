import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { SiteHeader } from "../pages/site-header";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset.
test.describe("TC_029 - Verify Search is in Home scope", () => {
  test("Verify Search is in Home scope", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Inspect the header.

    // Expected: A visible Search discovery control is present on Home.
    await expect(new SiteHeader(page).searchControl).toBeVisible();
  });
});
