import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";

test.describe("TC_001 - Open Bold Statement Graphic Tee from Latest Products", () => {
  test("opens a Product Detail page from the Latest Products card", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);

    // Step 2: Scroll to "Latest Products".
    // Step 3: Select the "Bold Statement Graphic Tee" product card in that section.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, "Bold Statement Graphic Tee");

    // Expected: A Product Detail page loads with product-detail content, rather than leaving the shopper on Home.
    // Product identity is checked separately (TR_003), so the product name is not asserted here.
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(/\/shop\/[^/]+\/?$/);
    await expect(productDetailPage.productTitle).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await expect(productDetailPage.descriptionTab).toBeVisible();
  });
});
