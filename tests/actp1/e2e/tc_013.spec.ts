import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Catalog identifies "Radiant One-Shoulder T-Shirt" independently of its Home link. Card rendered in "Latest Products".
test.describe("TC_013 - Verify identity of Radiant One-Shoulder T-Shirt opened from Latest Products", () => {
  test("Verify identity of Radiant One-Shoulder T-Shirt opened from Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    // Step 3: Select the "Radiant One-Shoulder T-Shirt" product card in that section.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, "Radiant One-Shoulder T-Shirt");
    // Step 4: Compare the loaded product title and catalog identity with the selected card.

    // Expected: The loaded Product Detail identifies "Radiant One-Shoulder T-Shirt" and its catalog product, not another product with a valid detail page.
    const product = products.radiantOneShoulder;
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/shop/${product.slug}/?$`));
    await expect(productDetailPage.productTitle).toHaveText(product.name);
    await expect(productDetailPage.addToCartButton).toHaveAttribute("value", String(product.id));
  });
});
