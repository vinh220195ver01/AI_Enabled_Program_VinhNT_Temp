import { test, expect } from "@playwright/test";
import { openHomePage } from "../actions/catalog";
import { searchFromHeader } from "../actions/search";
import { SearchResultsPage } from "../pages/search-results-page";

// Precondition: AUT available. Current catalog fixture recorded before execution; recheck after demo reset. Search input accessible. Use the authorized test environment. Browser allows a harmless alert sentinel; no destructive payloads.
test.describe("TC_071 - Treat script-like search input as data", () => {
  test("Treat script-like search input as data", async ({ page }) => {
    const dialogs: string[] = [];
    page.on("dialog", async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    // Step 1: Open https://actp1.csc.edu.vn/
    await openHomePage(page);
    // Step 2: Activate the header Search control.
    // Step 3: Enter "<script>alert(\"TR043\")</script>" in Search (placeholder "Search for...").
    const payload = '<script>alert("TR043")</script>';
    // Step 4: Click the Search submit button.
    await searchFromHeader(page, payload, "button");

    // Expected: No TR043 alert or injected script executes in search or results. If the query is echoed, it remains inert text. Exact validation/no-results wording remains subject to Q01/Q06.
    const searchResultsPage = new SearchResultsPage(page);
    await expect(searchResultsPage.heading).toBeVisible();
    expect(dialogs).toEqual([]);
    expect(await searchResultsPage.injectedScriptCount("TR043")).toBe(0);
    // If the query is echoed, it remains inert text.
    expect(await searchResultsPage.heading.innerHTML()).not.toContain("<script");
  });
});
