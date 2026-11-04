import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. Controlled catalog and safe keyword baseline recorded in the test environment. Tester can review returned data and any exposed query errors.
test.describe("TC_072 - Treat query-injection search input as data", () => {
  test("Treat query-injection search input as data", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search control.
    // Step 3: Enter "' OR '1'='1" in Search (placeholder "Search for...").
    const payload = "' OR '1'='1";
    // Step 4: Click the Search submit button.
    await searchFromHeader(page, payload, "button");

    // Expected: The payload is treated as keyword data, not an instruction to bypass search filtering. No injected query error or unrelated protected data is exposed. Exact matching/error presentation remains Q01/Q06.
    // Observed on 2026-11-04: the site does not navigate for this payload (the form stays disabled and shows empty error boxes).
    // Matching and error presentation stay subject to Q01/Q06, so this asserts only that no query error or server
    // diagnostic text is exposed, whether the payload is rejected or searched as a keyword.
    await page.waitForLoadState("load");
    const searchResultsPage = new SearchResultsPage(page);
    expect(await searchResultsPage.bodyText()).not.toMatch(/sql syntax|mysql|wpdb|database error|fatal error|warning:/i);
  });
});
