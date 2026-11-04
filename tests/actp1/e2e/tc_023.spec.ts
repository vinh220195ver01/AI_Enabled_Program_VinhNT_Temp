import { test, expect } from "@playwright/test";
import { openHomePage, browseFooterCategory } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { products, categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Footer lists "Dresses"; its nonempty assigned-product set is recorded in the fixture.
test.describe("TC_023 - Browse Dresses products using footer", () => {
  test("Browse Dresses products using footer", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to footer "Product categories".
    // Step 3: Select "Dresses".
    await browseFooterCategory(page, "Dresses");
    // Step 4: Compare the listing identity and displayed products with the "Dresses" fixture.

    // Expected: Category browsing identifies "Dresses". Displayed products agree with the approved catalog membership fixture for that category. Historical item counts are not fixed expected data.
    const category = categories.Dresses;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
    expect((await categoryPage.listedProductNames()).sort()).toEqual([...category.productNames].sort());
  });
});
