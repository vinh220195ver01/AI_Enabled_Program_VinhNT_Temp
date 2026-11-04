import type { Locator, Page } from "@playwright/test";

// Locators recorded in uat-context/actp1-csc-edu-vn/pages/home.md
export const LATEST_PRODUCTS = "Latest Products";
export const TRENDS = "BE INSPIRED. GET AHEAD OF TRENDS.";

export type HomeSection = typeof LATEST_PRODUCTS | typeof TRENDS;

export type ProductCard = {
  name: string;
  href: string;
  price: string;
  originalPrice: string | null;
};

export class HomePage {
  static readonly url = "https://actp1.csc.edu.vn/";

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(HomePage.url);
  }

  async reload() {
    await this.page.reload();
  }

  sectionHeading(section: HomeSection): Locator {
    return this.page.getByRole("heading", { name: section });
  }

  // Both sections render as a WooCommerce handpicked-products grid that follows the section heading in the DOM.
  private sectionGrid(section: HomeSection): Locator {
    return this.sectionHeading(section).locator('xpath=following::div[contains(@class,"wc-block-grid")][1]');
  }

  sectionCards(section: HomeSection): Locator {
    return this.sectionGrid(section).getByRole("listitem");
  }

  cardTitles(section: HomeSection): Locator {
    return this.sectionCards(section).locator(".wc-block-grid__product-title");
  }

  cardPrices(section: HomeSection): Locator {
    return this.sectionCards(section).locator(".wc-block-grid__product-price");
  }

  async scrollToSection(section: HomeSection) {
    await this.sectionHeading(section).scrollIntoViewIfNeeded();
  }

  async selectProduct(section: HomeSection, productName: string) {
    await this.sectionGrid(section).getByRole("link", { name: productName }).click();
  }

  async readCards(section: HomeSection): Promise<ProductCard[]> {
    const cards = this.sectionCards(section);
    await cards.first().waitFor();
    return cards.evaluateAll((items) =>
      items.map((li) => {
        const priceBox = li.querySelector(".wc-block-grid__product-price");
        const text = (el: Element | null | undefined) => el?.textContent?.trim() ?? "";
        return {
          name: text(li.querySelector(".wc-block-grid__product-title")),
          href: li.querySelector("a")?.getAttribute("href") ?? "",
          price: text(priceBox?.querySelector("ins .amount") ?? priceBox?.querySelector(".amount")),
          originalPrice: priceBox?.querySelector("del .amount") ? text(priceBox.querySelector("del .amount")) : null,
        };
      }),
    );
  }
}
