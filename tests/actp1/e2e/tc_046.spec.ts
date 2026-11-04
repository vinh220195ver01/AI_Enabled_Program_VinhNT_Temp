import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { TRENDS } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { products } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. "Sophisticated Striped Midi Dress" remains rendered in "BE INSPIRED. GET AHEAD OF TRENDS.". Its intended catalog identity is recorded.
test.describe("TC_046 - Recheck Sophisticated Striped Midi Dress target from BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Recheck Sophisticated Striped Midi Dress target from BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    // Step 3: Select the "Sophisticated Striped Midi Dress" product card in that section.
    await openProductFromHomeSection(page, TRENDS, "Sophisticated Striped Midi Dress");

    // Expected: A Product Detail for "Sophisticated Striped Midi Dress" opens. It does not identify Midnight Bloom Crochet Dress.
    const product = products.sophisticatedStripedMidi;
    const productDetailPage = new ProductDetailPage(page);
    await expect(page).toHaveURL(new RegExp(`/shop/${product.slug}/?$`));
    await expect(productDetailPage.productTitle).toHaveText(product.name);
    await expect(productDetailPage.addToCartButton).toHaveAttribute("value", String(product.id));
    await expect(productDetailPage.productTitle).not.toHaveText(products.midnightBloom.name);
  });
});
