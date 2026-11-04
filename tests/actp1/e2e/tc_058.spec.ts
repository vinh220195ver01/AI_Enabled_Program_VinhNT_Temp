import { test, expect } from "@playwright/test";
import { openHomePage, openProductFromHomeSection } from "../actions/catalog";
import { navigateBack } from "../actions/navigation";
import { LATEST_PRODUCTS, TRENDS, HomePage } from "../pages/home-page";
import { SiteHeader } from "../pages/site-header";
import { SiteFooter } from "../pages/site-footer";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Golden Glow Ribbed Knit Dress is in "BE INSPIRED. GET AHEAD OF TRENDS.".
test.describe("TC_058 - Return Home with Back from BE INSPIRED. GET AHEAD OF TRENDS.", () => {
  test("Return Home with Back from BE INSPIRED. GET AHEAD OF TRENDS.", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    // Step 3: Select the "Golden Glow Ribbed Knit Dress" product card in that section.
    await openProductFromHomeSection(page, TRENDS, "Golden Glow Ribbed Knit Dress");
    // Step 4: Use Browser Back.
    await navigateBack(page);

    // Expected: Browser returns to Home (/), and the in-scope discovery areas are available. No scroll-restoration behavior is asserted.
    const homePage = new HomePage(page);
    await expect(page).toHaveURL(HomePage.url);
    await expect(new SiteHeader(page).searchControl).toBeVisible();
    await expect(new SiteHeader(page).shopMenuLink).toBeVisible();
    await expect(homePage.sectionHeading(LATEST_PRODUCTS)).toBeVisible();
    await expect(homePage.sectionHeading(TRENDS)).toBeVisible();
    await expect(new SiteFooter(page).categoriesLabel).toBeAttached();
  });
});
