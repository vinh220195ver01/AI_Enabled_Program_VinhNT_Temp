import { test, expect } from "@playwright/test";
import { openHomePage, scrollToHomeSection, readHomeSectionCards } from "../actions/catalog";
import { TRENDS, HomePage } from "../pages/home-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "BE INSPIRED. GET AHEAD OF TRENDS." has products.
test.describe("TC_020 - Verify price on every BE INSPIRED. GET AHEAD OF TRENDS. card", () => {
  test("Verify price on every BE INSPIRED. GET AHEAD OF TRENDS. card", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    const homePage = new HomePage(page);
    await scrollToHomeSection(page, TRENDS);
    // Step 3: Inspect the price on every rendered card against the current fixture.
    const cards = await readHomeSectionCards(page, TRENDS);

    // Expected: Every rendered card displays a current-price value next to its product. Exact amount, currency, tax/variant context and format require the Q08 oracle (TR_060).
    // Exact amount, currency and format need the Q08 oracle (TR_060), so only a nonempty price containing a number is asserted.
    expect(cards.length).toBeGreaterThan(0);
    await expect(homePage.cardPrices(TRENDS)).toHaveCount(cards.length);
    for (const [index, card] of cards.entries()) {
      await expect(homePage.cardPrices(TRENDS).nth(index)).toBeVisible();
      expect(card.price).toMatch(/\d/);
    }
  });
});
