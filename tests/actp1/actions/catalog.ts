import type { Page } from "@playwright/test";
import { HomePage, type HomeSection, type ProductCard } from "../pages/home-page";
import { ShopPage } from "../pages/shop-page";
import { SiteFooter } from "../pages/site-footer";
import { SiteHeader } from "../pages/site-header";

export async function openHomePage(page: Page): Promise<void> {
  await new HomePage(page).goto();
}

export async function reloadHomePage(page: Page): Promise<void> {
  await new HomePage(page).reload();
}

export async function scrollToHomeSection(page: Page, section: HomeSection): Promise<void> {
  await new HomePage(page).scrollToSection(section);
}

export async function openProductFromHomeSection(page: Page, section: HomeSection, productName: string): Promise<void> {
  const homePage = new HomePage(page);
  await homePage.scrollToSection(section);
  await homePage.selectProduct(section, productName);
}

export async function readHomeSectionCards(page: Page, section: HomeSection): Promise<ProductCard[]> {
  const homePage = new HomePage(page);
  await homePage.scrollToSection(section);
  return homePage.readCards(section);
}

export async function browseFooterCategory(page: Page, categoryName: string): Promise<void> {
  const footer = new SiteFooter(page);
  await footer.scrollToCategories();
  await footer.selectCategory(categoryName);
}

export async function browseCategoryThroughShop(page: Page, categoryName: string): Promise<void> {
  await new SiteHeader(page).openShop();
  await new ShopPage(page).selectCategory(categoryName);
}
