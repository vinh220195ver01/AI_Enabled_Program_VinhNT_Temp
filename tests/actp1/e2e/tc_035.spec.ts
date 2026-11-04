import { test, expect } from "@playwright/test";
import { openHomePage, browseFooterCategory } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Fresh signed-out private session. Dresses contains available products.
test.describe("TC_035 - Guest browses a footer category", () => {
  test("Guest browses a footer category", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to footer Product categories.
    // Step 3: Select "Dresses".
    await browseFooterCategory(page, "Dresses");

    // Expected: Dresses browsing is accessible without signing in.
    await expect(page).not.toHaveURL(/my-account|wp-login|login/i);
    const category = categories.Dresses;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
  });
});
