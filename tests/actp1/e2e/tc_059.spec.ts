import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";
import { products, categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. Approved Q01 oracle: "Hat" matches Floral Elegance Sun Hat only; "Dress" matches recorded dress products and excludes that hat.
test.describe("TC_059 - Replace first search results with a second query", () => {
  test("Replace first search results with a second query", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search control.
    // Step 3: Enter "Hat" in Search (placeholder "Search for...").
    // Step 4: Click the Search submit button.
    await searchFromHeader(page, "Hat", "button");
    // Step 5: Return to Home.
    await openHomePage(page);
    // Step 6: Activate header Search.
    // Step 7: Enter "Dress" in Search.
    // Step 8: Click the Search submit button.
    await searchFromHeader(page, "Dress", "button");

    // Expected: The second result set corresponds to Dress under the approved oracle. Floral Elegance Sun Hat is not retained merely because it matched the first query.
    // Oracle from the precondition: "Dress" matches the recorded dress products and excludes the hat.
    const titles = await new SearchResultsPage(page).resultTitles();
    expect(titles).toEqual(expect.arrayContaining(categories.Dresses.productNames));
    expect(titles).not.toContain(products.floralElegance.name);
  });
});
