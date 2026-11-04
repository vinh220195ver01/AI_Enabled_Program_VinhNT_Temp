import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { LATEST_PRODUCTS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Floral Elegance Sun Hat" is rendered in "Latest Products".
test.describe("TC_002 - Open Floral Elegance Sun Hat from Latest Products", () => {
  test("Open Floral Elegance Sun Hat from Latest Products", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "Latest Products".
    // Step 3: Select the "Floral Elegance Sun Hat" product card in that section.
    await openProductFromHomeSection(page, LATEST_PRODUCTS, "Floral Elegance Sun Hat");

    // Expected: A Product Detail page loads with product-detail content, rather than leaving the shopper on Home. Product identity is checked separately.
    // Product identity is checked separately (TR_003), so the product name is not asserted here.
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(/\/shop\/[^/]+\/?$/);
    await expect(productDetailPage.productTitle).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await expect(productDetailPage.descriptionTab).toBeVisible();
  });
});
