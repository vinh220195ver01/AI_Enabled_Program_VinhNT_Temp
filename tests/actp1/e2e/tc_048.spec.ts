import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { TRENDS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Sunset Glow Utility Dress" remains rendered in "BE INSPIRED. GET AHEAD OF TRENDS.". Its intended catalog identity is recorded.
test.describe("TC_048 - Recheck Sunset Glow Utility Dress target from BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Recheck Sunset Glow Utility Dress target from BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    // Step 3: Select the "Sunset Glow Utility Dress" product card in that section.
    await openProductFromHomeSection(page, TRENDS, "Sunset Glow Utility Dress");

    // Expected: A Product Detail for "Sunset Glow Utility Dress" opens. Home does not remain at #dead-link.
    await expect(page).not.toHaveURL(/#dead-link/);
    const product = products.sunsetGlow;
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/shop/${product.slug}/?$`));
    await expect(productDetailPage.productTitle).toHaveText(product.name);
    await expect(productDetailPage.addToCartButton).toHaveAttribute("value", String(product.id));
  });
});
