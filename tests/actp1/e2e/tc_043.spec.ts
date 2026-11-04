import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection, readHomeSectionCards } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Golden Glow Ribbed Knit Dress is in "Latest Products". Catalog, currency, tax and variant context are unchanged and documented for both views.
test.describe("TC_043 - Compare card and Product Detail price from Latest Products", () => {
  test("Compare card and Product Detail price from Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Record the current price on "Golden Glow Ribbed Knit Dress" in "Latest Products".
    const product = products.goldenGlow;
    const cards = await readHomeSectionCards(page, LATEST_PRODUCTS);
    const card = cards.find((item) => item.name === product.name);
    expect(card, "Golden Glow Ribbed Knit Dress card is rendered").toBeDefined();
    // Step 3: Select that card.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, product.name);
    // Step 4: Read the price for the same product and applicable variant/context on Product Detail.
    const detailPrice = await new ProductDetailPage(page).currentPrice();

    // Expected: The card current-price amount agrees with Product Detail for the same product, applicable variant and pricing context.
    expect(detailPrice).toBe(card?.price);
  });
});
