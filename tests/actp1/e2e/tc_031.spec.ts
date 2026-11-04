import { test, expect } from "@playwright/test";
import { openHomePage, scrollToHomeSection } from "../actions/catalog";
import { TRENDS, HomePage } from "../pages/home-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset.
test.describe("TC_031 - Verify BE INSPIRED. GET AHEAD OF TRENDS. is in Home scope", () => {
  test("Verify BE INSPIRED. GET AHEAD OF TRENDS. is in Home scope", async ({ page }) => {
    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Scroll to "BE INSPIRED. GET AHEAD OF TRENDS.".
    await scrollToHomeSection(page, TRENDS);

    // Expected: The "BE INSPIRED. GET AHEAD OF TRENDS." discovery section is present on Home.
    await expect(new HomePage(page).sectionHeading(TRENDS)).toBeVisible();
  });
});
