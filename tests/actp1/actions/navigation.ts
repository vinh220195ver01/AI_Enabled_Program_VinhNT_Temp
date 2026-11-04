import type { Page } from "@playwright/test";

export async function navigateBack(page: Page): Promise<void> {
  await page.goBack();
}
