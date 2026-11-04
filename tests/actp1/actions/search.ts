import type { Page } from "@playwright/test";
import { SiteHeader } from "../pages/site-header";

export type SearchSubmitMethod = "button" | "enter";

export async function openHeaderSearch(page: Page): Promise<void> {
  await new SiteHeader(page).openSearch();
}

export async function searchFromHeader(page: Page, keyword: string, submitWith: SearchSubmitMethod = "button"): Promise<void> {
  const header = new SiteHeader(page);
  await header.openSearch();
  await header.enterSearchKeyword(keyword);
  if (submitWith === "enter") {
    await header.submitSearchWithEnter();
  } else {
    await header.submitSearchWithButton();
  }
}
