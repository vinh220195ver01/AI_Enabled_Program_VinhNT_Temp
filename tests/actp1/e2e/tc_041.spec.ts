import { test, expect } from "@playwright/test";
import { openHomePage, readHomeSectionCards } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Golden Glow Ribbed Knit Dress has a verified active sale and is in "Latest Products". Record regular and sale amounts from the catalog.
test.describe("TC_041 - Identify active sale price in Latest Products", () => {
  test("Identify active sale price in Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    const cards = await readHomeSectionCards(page, LATEST_PRODUCTS);
    // Step 3: Inspect current and original prices on "Golden Glow Ribbed Knit Dress".
    const product = products.goldenGlow;
    const card = cards.find((item) => item.name === product.name);

    // Expected: The active sale amount is identifiable as the current price. Any original-price display does not replace or obscure the active price. Historical amounts are not the oracle.
    expect(card, "Golden Glow Ribbed Knit Dress card is rendered").toBeDefined();
    expect(card?.price).toBe(product.salePrice);
    expect(card?.originalPrice).toBe(product.regularPrice);
    expect(card?.price).not.toBe(card?.originalPrice);
  });
});
