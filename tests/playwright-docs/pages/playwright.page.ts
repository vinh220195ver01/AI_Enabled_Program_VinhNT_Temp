import { Locator, Page } from "@playwright/test";

export class PlaywrightPage {
  readonly page: Page;
  readonly homepageHeading: Locator;
  readonly getStartedLink: Locator;
  readonly installationLink: Locator;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchResult: Locator;
  readonly installationHeading: Locator;
  readonly introductionHeading: Locator;
  readonly installingPlaywrightHeading: Locator;
  readonly installationCommand: Locator;
  readonly assertionsHeading: Locator;
  readonly body: Locator;
  readonly themeToggle: Locator;
  readonly githubRepositoryLink: Locator;
  readonly apiLink: Locator;
  readonly pageClassLink: Locator;
  readonly browserClassLink: Locator;
  readonly pageHeading: Locator;
  readonly pageClickMethod: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homepageHeading = page.getByRole("heading", { name: /Playwright/i }).first();
    this.getStartedLink = page.getByRole("link", { name: "Get started" });
    this.installationLink = page.getByRole("link", {
      name: "Installation",
      exact: true,
    });
    this.searchButton = page.getByRole("button", { name: /search/i });
    this.searchInput = page.locator(
      'input[placeholder*="Search" i], .DocSearch-Input, input[aria-label*="Search" i]',
    );
    this.searchResult = page
      .locator(".DocSearch-Hit")
      .filter({ hasText: /Assertions/i })
      .first();
    this.installationHeading = page.getByRole("heading", {
      name: "Installation",
      exact: true,
    });
    this.introductionHeading = page.getByRole("heading", {
      name: "Introduction",
    });
    this.installingPlaywrightHeading = page.getByRole("heading", {
      name: "Installing Playwright",
    });
    this.installationCommand = page.getByText("npm init playwright@latest", {
      exact: true,
    });
    this.assertionsHeading = page.getByRole("heading", {
      name: "Assertions",
      exact: true,
    });
    this.body = page.locator("body");
    this.themeToggle = page.getByRole("button", {
      name: /switch between dark and light mode/i,
    });
    this.githubRepositoryLink = page.getByRole("link", {
      name: "GitHub repository",
    });
    this.apiLink = page.getByRole("link", { name: "API", exact: true });
    const docsSidebar = page.getByRole("navigation", { name: "Docs sidebar" });
    this.pageClassLink = docsSidebar.getByRole("link", { name: "Page", exact: true });
    this.browserClassLink = docsSidebar.getByRole("link", { name: "Browser", exact: true });
    this.pageHeading = page.getByRole("heading", { name: "Page", exact: true });
    this.pageClickMethod = page.getByRole("heading", { name: /^click/ });
  }

  async openHomePage(): Promise<void> {
    await this.page.goto("https://playwright.dev/");
  }

  async openGettingStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async openInstallation(): Promise<void> {
    await this.installationLink.click();
  }

  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async openSearchResult(): Promise<void> {
    await this.searchResult.click();
  }

  async getTheme(): Promise<string> {
    return this.page.evaluate(() =>
      getComputedStyle(document.documentElement).colorScheme,
    );
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async openGitHubRepository(): Promise<Page> {
    const popupPromise = this.page.waitForEvent("popup");
    await this.githubRepositoryLink.click();
    return popupPromise;
  }

  async openApiReference(): Promise<void> {
    await this.apiLink.click();
  }

  async openPageClassDocumentation(): Promise<void> {
    await this.pageClassLink.click();
  }
}
