import { test, expect } from "@playwright/test";
import { openHomePage, reloadHomePage, readHomeSectionCards } from "../actions/catalog";
import { TRENDS } from "../pages/home-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Use a fresh browser load without warm page cache. "BE INSPIRED. GET AHEAD OF TRENDS." has products. Freeze catalog, sale, currency and tax context during the check.
test.describe("TC_052 - Compare initial and reloaded prices in BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Compare initial and reloaded prices in BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Record product IDs and current prices on every "BE INSPIRED. GET AHEAD OF TRENDS." card before reload.
    const before = await readHomeSectionCards(page, TRENDS);
    // Step 3: Reload Home.
    await reloadHomePage(page);
    // Step 4: Compare current prices of the same "BE INSPIRED. GET AHEAD OF TRENDS." product IDs.
    const after = await readHomeSectionCards(page, TRENDS);

    // Expected: Each unchanged product retains the same current-price amount on initial load and reload. No transient inflated value is substituted. Do not use historical $11000486.00/$15.00 as fixed prices.
    expect(before.length).toBeGreaterThan(0);
    for (const card of before) {
      const reloaded = after.find((item) => item.name === card.name);
      expect(reloaded, `${card.name} is still rendered after reload`).toBeDefined();
      expect(reloaded?.price, `current price of ${card.name} after reload`).toBe(card.price);
    }
  });
});
