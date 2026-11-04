import { test, expect } from "@playwright/test";
import { templateAction } from "../actions/template-action"; // replace with real action import(s)

/**
 * Template — rename file to <case-id-slug>.spec.ts and replace the describe/test bodies
 * with the scenarios from the Auto Test Case design. One test() per scenario.
 */
test.describe("TC000 - Replace with case title", () => {
  test("happy path", async ({ page }) => {
    // Step 1: Replace with manual step text
    await templateAction(page, "replace-with-test-data");

    // Step 2: Replace with manual step text
    // Expected: Replace with expected result text
    await expect(page.getByText("Replace With Expected Text")).toBeVisible();
  });
});
