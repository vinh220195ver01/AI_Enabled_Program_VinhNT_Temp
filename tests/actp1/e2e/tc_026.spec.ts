import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { SiteHeader } from "../pages/site-header";
import { categories } from "../data/catalog";
import { ShopPage } from "../pages/shop-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Dresses exists. Current Shop category route is recorded; no submenu implementation is assumed.
test.describe("TC_026 - Reach Dresses through Shop", () => {
  test("Reach Dresses through Shop", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate "Shop" in the primary menu.
    const siteHeader = new SiteHeader(page);
    await siteHeader.openShop();
    // Step 3: Select "Dresses" using the category control reachable through Shop.
    await new ShopPage(page).selectCategory("Dresses");

    // Expected: Shop provides a reachable Dresses category control. Selecting it opens browsing for Dresses. The precise required route/category set is separately blocked in TR_032.
    const category = categories.Dresses;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
  });
});
