import { test, expect } from "@playwright/test";
import { openHomePage, scrollToHomeSection, readHomeSectionCards } from "../actions/catalog";
import { LATEST_PRODUCTS, HomePage } from "../pages/home-page";
import { allProductNames } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Latest Products" has products.
test.describe("TC_017 - Verify name on every Latest Products card", () => {
  test("Verify name on every Latest Products card", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    const homePage = new HomePage(page);
    await scrollToHomeSection(page, LATEST_PRODUCTS);
    // Step 3: Inspect the name on every rendered card against the current fixture.
    const cards = await readHomeSectionCards(page, LATEST_PRODUCTS);

    // Expected: Every rendered card has visible, nonempty product-name text identifying its catalog product.
    expect(cards.length).toBeGreaterThan(0);
    await expect(homePage.cardTitles(LATEST_PRODUCTS)).toHaveCount(cards.length);
    for (const [index, card] of cards.entries()) {
      await expect(homePage.cardTitles(LATEST_PRODUCTS).nth(index)).toBeVisible();
      expect(card.name).not.toBe("");
      expect(allProductNames).toContain(card.name);
    }
  });
});
