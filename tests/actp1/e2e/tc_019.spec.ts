import { test, expect } from "@playwright/test";
import { openHomePage, scrollToHomeSection, readHomeSectionCards } from "../actions/catalog";
import { TRENDS, HomePage } from "../pages/home-page";
import { allProductNames } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "BE INSPIRED. GET AHEAD OF TRENDS." has products.
test.describe("TC_019 - Verify name on every BE INSPIRED. GET AHEAD OF TRENDS. card", () => {
  test("Verify name on every BE INSPIRED. GET AHEAD OF TRENDS. card", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    const homePage = new HomePage(page);
    await scrollToHomeSection(page, TRENDS);
    // Step 3: Inspect the name on every rendered card against the current fixture.
    const cards = await readHomeSectionCards(page, TRENDS);

    // Expected: Every rendered card has visible, nonempty product-name text identifying its catalog product.
    expect(cards.length).toBeGreaterThan(0);
    await expect(homePage.cardTitles(TRENDS)).toHaveCount(cards.length);
    for (const [index, card] of cards.entries()) {
      await expect(homePage.cardTitles(TRENDS).nth(index)).toBeVisible();
      expect(card.name).not.toBe("");
      expect(allProductNames).toContain(card.name);
    }
  });
});
