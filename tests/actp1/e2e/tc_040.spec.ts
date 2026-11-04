import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. Golden Glow Ribbed Knit Dress is an existing searchable product.
test.describe("TC_040 - Submit a product keyword with Enter", () => {
  test("Submit a product keyword with Enter", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate header Search.
    // Step 3: Enter "Golden Glow Ribbed Knit Dress" in Search.
    // Step 4: Press Enter while Search has focus.
    await searchFromHeader(page, "Golden Glow Ribbed Knit Dress", "enter");

    // Expected: Search is submitted for Golden Glow Ribbed Knit Dress and results include that product.
    await expect(page).toHaveURL(/[?&]s=/);
    expect(await new SearchResultsPage(page).resultTitles()).toContain("Golden Glow Ribbed Knit Dress");
  });
});
