import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/home.md (footer)
export class SiteFooter {
  constructor(private readonly page: Page) {}

  get categoriesLabel(): Locator {
    return this.page.getByRole("contentinfo").getByText("Product categories", { exact: true }).first();
  }

  private get categoriesList(): Locator {
    return this.categoriesLabel.locator("xpath=following-sibling::ul[1]");
  }

  categoryLink(categoryName: string): Locator {
    return this.categoriesList.getByRole("link", { name: categoryName, exact: true });
  }

  async scrollToCategories() {
    await this.categoriesLabel.scrollIntoViewIfNeeded();
  }

  async selectCategory(categoryName: string) {
    await this.categoryLink(categoryName).click();
  }
}
