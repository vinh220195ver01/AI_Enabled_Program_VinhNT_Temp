import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/home.md (header and search overlay)
export class SiteHeader {
  constructor(private readonly page: Page) {}

  get shopMenuLink(): Locator {
    return this.page.getByRole("navigation", { name: "Primary Menu" }).getByRole("link", { name: "Shop" });
  }

  get searchControl(): Locator {
    return this.page.getByRole("link", { name: "Search" });
  }

  get searchInput(): Locator {
    return this.page.getByRole("searchbox", { name: "Search" });
  }

  get searchSubmitButton(): Locator {
    return this.page.getByRole("button", { name: "Search" });
  }

  get searchCloseButton(): Locator {
    return this.page.getByRole("button", { name: "Close" });
  }

  async openShop() {
    await this.shopMenuLink.click();
  }

  async openSearch() {
    await this.searchControl.click();
  }

  async enterSearchKeyword(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async submitSearchWithButton() {
    await this.searchSubmitButton.click();
  }

  async submitSearchWithEnter() {
    await this.searchInput.press("Enter");
  }

  async closeSearch() {
    await this.searchCloseButton.click();
  }
}
