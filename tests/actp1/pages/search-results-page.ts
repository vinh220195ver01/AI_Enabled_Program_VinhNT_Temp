import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/search-results.md
export class SearchResultsPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  private get resultHeadings(): Locator {
    return this.page.getByRole("main").getByRole("article").getByRole("heading", { level: 2 });
  }

  async resultTitles(): Promise<string[]> {
    await this.heading.waitFor();
    return (await this.resultHeadings.allTextContents()).map((title) => title.trim());
  }

  async bodyText(): Promise<string> {
    return this.page.locator("body").innerText();
  }

  async injectedScriptCount(marker: string): Promise<number> {
    return this.page.locator("script", { hasText: marker }).count();
  }
}
