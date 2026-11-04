import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. "Bold Statement Graphic Tee" is an existing searchable product; the controlled positive keyword is its full name.
test.describe("TC_027 - Find a known product by Home Search", () => {
  test("Find a known product by Home Search", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search control.
    // Step 3: Enter "Bold Statement Graphic Tee" in Search (placeholder "Search for...").
    // Step 4: Click the Search submit button.
    await searchFromHeader(page, "Bold Statement Graphic Tee", "button");

    // Expected: The submitted search leads to results that include the catalog product "Bold Statement Graphic Tee". Do not infer matching rules for other query partitions.
    await expect(page).toHaveURL(/[?&]s=/);
    expect(await new SearchResultsPage(page).resultTitles()).toContain("Bold Statement Graphic Tee");
  });
});
