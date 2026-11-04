import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { TRENDS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Golden Glow Ribbed Knit Dress" is rendered in "BE INSPIRED. GET AHEAD OF TRENDS.".
test.describe("TC_007 - Open Golden Glow Ribbed Knit Dress from BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Open Golden Glow Ribbed Knit Dress from BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    // Step 3: Select the "Golden Glow Ribbed Knit Dress" product card in that section.
    await openProductFromHomeSection(page, TRENDS, "Golden Glow Ribbed Knit Dress");

    // Expected: A Product Detail page loads with product-detail content, rather than leaving the shopper on Home. Product identity is checked separately.
    // Product identity is checked separately (TR_003), so the product name is not asserted here.
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(/\/shop\/[^/]+\/?$/);
    await expect(productDetailPage.productTitle).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await expect(productDetailPage.descriptionTab).toBeVisible();
  });
});
