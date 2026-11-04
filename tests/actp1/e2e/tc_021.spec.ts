import { test, expect } from "@playwright/test";
import { openHomePage, browseFooterCategory } from "../actions/catalog";
import { CategoryPage } from "../pages/category-page";
import { products, categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Footer lists "Blouse"; its nonempty assigned-product set is recorded in the fixture.
test.describe("TC_021 - Browse Blouse products using footer", () => {
  test("Browse Blouse products using footer", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to footer "Product categories".
    // Step 3: Select "Blouse".
    await browseFooterCategory(page, "Blouse");
    // Step 4: Compare the listing identity and displayed products with the "Blouse" fixture.

    // Expected: Category browsing identifies "Blouse". Displayed products agree with the approved catalog membership fixture for that category. Historical item counts are not fixed expected data.
    const category = categories.Blouse;
    const categoryPage = new CategoryPage(page);
    await expect(page).toHaveTitle(new RegExp(`^${category.name} –`));
    await expect(categoryPage.breadcrumb).toContainText(category.name);
    expect((await categoryPage.listedProductNames()).sort()).toEqual([...category.productNames].sort());
  });
});
