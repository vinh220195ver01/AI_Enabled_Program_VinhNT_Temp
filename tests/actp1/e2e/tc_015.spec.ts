import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { TRENDS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Catalog identifies "Golden Glow Ribbed Knit Dress" independently of its Home link. Card rendered in "BE INSPIRED. GET AHEAD OF TRENDS.".
test.describe("TC_015 - Verify identity of Golden Glow Ribbed Knit Dress opened from BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Verify identity of Golden Glow Ribbed Knit Dress opened from BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    // Step 3: Select the "Golden Glow Ribbed Knit Dress" product card in that section.
    await openProductFromHomeSection(page, TRENDS, "Golden Glow Ribbed Knit Dress");
    // Step 4: Compare the loaded product title and catalog identity with the selected card.

    // Expected: The loaded Product Detail identifies "Golden Glow Ribbed Knit Dress" and its catalog product, not another product with a valid detail page.
    const product = products.goldenGlow;
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/shop/${product.slug}/?$`));
    await expect(productDetailPage.productTitle).toHaveText(product.name);
    await expect(productDetailPage.addToCartButton).toHaveAttribute("value", String(product.id));
  });
});
