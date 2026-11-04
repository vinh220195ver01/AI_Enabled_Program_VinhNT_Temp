import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Use a fresh private session with no signed-in account. Golden Glow Ribbed Knit Dress is rendered in "Latest Products".
test.describe("TC_033 - Guest opens a product from Latest Products", () => {
  test("Guest opens a product from Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    // Step 3: Select the "Golden Glow Ribbed Knit Dress" product card in that section.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, "Golden Glow Ribbed Knit Dress");

    // Expected: Product Detail is accessible while the shopper remains signed out; no sign-in wall interrupts the flow.
    await expect(page).not.toHaveURL(/my-account|wp-login|login/i);
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(/\/shop\/[^/]+\/?$/);
    await expect(productDetailPage.productTitle).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await expect(productDetailPage.descriptionTab).toBeVisible();
  });
});
