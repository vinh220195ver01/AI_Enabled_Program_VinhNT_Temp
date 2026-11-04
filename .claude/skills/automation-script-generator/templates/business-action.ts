import type { Page } from "@playwright/test";
import { TemplatePage } from "../pages/template-page"; // replace with real page object import(s)

/**
 * Template — rename to the approved Business Action signature from business-action-designer.
 * Composes page object calls into one user-recognizable intent. See references/page-object-pattern.md.
 * Do not adjust the approved name/parameters/return type during implementation.
 */
export async function templateAction(page: Page, input: string): Promise<void> {
  const templatePage = new TemplatePage(page);
  await templatePage.goto();
  await templatePage.fillExampleField(input);
  await templatePage.submit();
}
