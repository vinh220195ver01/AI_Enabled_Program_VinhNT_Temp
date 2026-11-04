import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. Fresh signed-out private session. Bold Statement Graphic Tee is an existing searchable product.
test.describe("TC_037 - Guest submits a product search", () => {
  test("Guest submits a product search", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search control.
    // Step 3: Enter "Bold Statement Graphic Tee" in Search (placeholder "Search for...").
    // Step 4: Click the Search submit button.
    await searchFromHeader(page, "Bold Statement Graphic Tee", "button");

    // Expected: Search results containing Bold Statement Graphic Tee are accessible without signing in.
    await expect(page).not.toHaveURL(/my-account|wp-login|login/i);
    await expect(page).toHaveURL(/[?&]s=/);
    expect(await new SearchResultsPage(page).resultTitles()).toContain("Bold Statement Graphic Tee");
  });
});
