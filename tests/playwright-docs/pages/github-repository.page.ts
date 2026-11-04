import { Locator, Page } from "@playwright/test";

export class GitHubRepositoryPage {
  readonly page: Page;
  readonly starCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.starCount = page.locator('[aria-label*="users starred this repository" i]');
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}