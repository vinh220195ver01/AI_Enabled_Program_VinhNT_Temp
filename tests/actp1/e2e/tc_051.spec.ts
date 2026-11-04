import { test, expect } from "@playwright/test";
import { openHomePage, reloadHomePage, readHomeSectionCards } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Use a fresh browser load without warm page cache. "Latest Products" has products. Freeze catalog, sale, currency and tax context during the check.
test.describe("TC_051 - Compare initial and reloaded prices in Latest Products", () => {
  test("Compare initial and reloaded prices in Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Record product IDs and current prices on every "Latest Products" card before reload.
    const before = await readHomeSectionCards(page, LATEST_PRODUCTS);
    // Step 3: Reload Home.
    await reloadHomePage(page);
    // Step 4: Compare current prices of the same "Latest Products" product IDs.
    const after = await readHomeSectionCards(page, LATEST_PRODUCTS);

    // Expected: Each unchanged product retains the same current-price amount on initial load and reload. No transient inflated value is substituted. Do not use historical $11000486.00/$15.00 as fixed prices.
    expect(before.length).toBeGreaterThan(0);
    for (const card of before) {
      const reloaded = after.find((item) => item.name === card.name);
      expect(reloaded, `${card.name} is still rendered after reload`).toBeDefined();
      expect(reloaded?.price, `current price of ${card.name} after reload`).toBe(card.price);
    }
  });
});
