import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Sunset Glow Utility Dress" remains rendered in "Latest Products". Its intended catalog identity is recorded.
test.describe("TC_047 - Recheck Sunset Glow Utility Dress target from Latest Products", () => {
  test("Recheck Sunset Glow Utility Dress target from Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    // Step 3: Select the "Sunset Glow Utility Dress" product card in that section.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, "Sunset Glow Utility Dress");

    // Expected: A Product Detail for "Sunset Glow Utility Dress" opens. Home does not remain at #dead-link.
    await expect(page).not.toHaveURL(/#dead-link/);
    const product = products.sunsetGlow;
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/shop/${product.slug}/?$`));
    await expect(productDetailPage.productTitle).toHaveText(product.name);
    await expect(productDetailPage.addToCartButton).toHaveAttribute("value", String(product.id));
  });
});
