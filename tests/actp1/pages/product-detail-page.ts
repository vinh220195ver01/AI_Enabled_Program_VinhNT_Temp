import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/product-detail.md
export class ProductDetailPage {
  constructor(private readonly page: Page) {}

  get productTitle(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  get addToCartButton(): Locator {
    return this.page.getByRole("button", { name: "Add to cart" });
  }

  get descriptionTab(): Locator {
    return this.page.getByRole("tab", { name: "Description" });
  }

  private get price(): Locator {
    return this.page.locator("div.summary p.price");
  }

  async currentPrice(): Promise<string> {
    return this.price.evaluate((el) => (el.querySelector("ins .amount") ?? el.querySelector(".amount"))?.textContent?.trim() ?? "");
  }
}
