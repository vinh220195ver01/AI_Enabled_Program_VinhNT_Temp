import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { SiteHeader } from "../pages/site-header";
import { categories } from "../data/catalog";
import { ShopPage } from "../pages/shop-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Fresh signed-out private session. Current Shop category route is recorded.
test.describe("TC_036 - Guest reaches categories through Shop", () => {
  test("Guest reaches categories through Shop", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate "Shop".
    await new SiteHeader(page).openShop();
    // Step 3: Select "Dresses" through its category control.
    await new ShopPage(page).selectCategory("Dresses");

    // Expected: Category discovery and Dresses browsing are accessible without signing in.
    await expect(page).not.toHaveURL(/my-account|wp-login|login/i);
    const category = categories.Dresses;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
  });
});
