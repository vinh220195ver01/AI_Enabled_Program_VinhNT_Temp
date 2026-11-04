import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { SiteFooter } from "../pages/site-footer";
import { categories } from "../data/catalog";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset.
test.describe("TC_032 - Verify footer Product categories is in Home scope", () => {
  test("Verify footer Product categories is in Home scope", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to the footer.
    const siteFooter = new SiteFooter(page);
    await siteFooter.scrollToCategories();

    // Expected: A Product categories discovery area is present in the footer.
    await expect(siteFooter.categoriesLabel).toBeVisible();
  });
});
