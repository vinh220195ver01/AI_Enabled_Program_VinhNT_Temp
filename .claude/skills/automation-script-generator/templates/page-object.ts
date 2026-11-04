import type { Page } from "@playwright/test";

/**
 * Template — rename to <ScreenName>Page and replace locators/methods below.
 * Owns locators and low-level interactions for one screen. See references/page-object-pattern.md.
 */
export class TemplatePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/replace-with-path");
  }

  // Replace with real fields — prefer getByLabel/getByRole/getByTestId over CSS selectors.
  async fillExampleField(value: string) {
    await this.page.getByLabel("Replace With Label").fill(value);
  }

  async submit() {
    await this.page.getByRole("button", { name: "Replace With Button Name" }).click();
  }
}
