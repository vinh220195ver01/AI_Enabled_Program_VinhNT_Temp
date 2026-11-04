import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/shop.md
export class ShopPage {
  constructor(private readonly page: Page) {}

  private get categoriesList(): Locator {
    return this.page.getByRole("complementary").getByText("Product categories", { exact: true }).locator("xpath=following-sibling::ul[1]");
  }

  categoryLink(categoryName: string): Locator {
    return this.categoriesList.getByRole("link", { name: categoryName, exact: true });
  }

  async selectCategory(categoryName: string) {
    await this.categoryLink(categoryName).click();
  }
}
