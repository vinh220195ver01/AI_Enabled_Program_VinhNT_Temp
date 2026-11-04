import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/category.md
export class CategoryPage {
  constructor(private readonly page: Page) {}

  get breadcrumb(): Locator {
    return this.page.getByRole("navigation", { name: "Breadcrumb" });
  }

  private get productHeadings(): Locator {
    return this.page.getByRole("main").getByRole("heading", { level: 2 });
  }

  async listedProductNames(): Promise<string[]> {
    await this.productHeadings.first().waitFor();
    return (await this.productHeadings.allTextContents()).map((name) => name.trim());
  }
}
