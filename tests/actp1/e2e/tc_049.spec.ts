import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { SiteFooter } from "../pages/site-footer";
import { categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Blouse appears in footer Product categories.
test.describe("TC_049 - Recheck Blouse dead-anchor target", () => {
  test("Recheck Blouse dead-anchor target", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to footer Product categories.
    const siteFooter = new SiteFooter(page);
    await siteFooter.scrollToCategories();
    // Step 3: Inspect the link target of "Blouse".
    await expect(siteFooter.categoryLink("Blouse")).not.toHaveAttribute("href", "#dead-link");
    // Step 4: Select "Blouse".
    await siteFooter.selectCategory("Blouse");

    // Expected: The link is navigable rather than #dead-link. Selecting it leaves Home and opens Blouse category browsing. Do not prescribe an unconfirmed destination path.
    await expect(page).not.toHaveURL(/^https:\/\/actp1\.csc\.edu\.vn\/(#.*)?$/);
    const category = categories.Blouse;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
  });
});
