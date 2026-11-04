# Page Object pattern rules

Loaded by `SKILL.md` step 4 for every spec/action touching the UI.

## The boundary

- A page object owns locators and low-level interactions for one screen or reusable component (a modal, a header) — it knows *how* to find and click things.
- A business action owns a user-recognizable intent and may call across multiple page objects — it knows *what* the user is trying to do.
- A spec calls business actions (and, for screen-specific one-off assertions, page object query methods) — it should not construct a locator directly.

```ts
// page object — locator + low-level interaction only
export class LoginPage {
  constructor(private page: Page) {}
  async fillUsername(value: string) { await this.page.getByLabel("Username").fill(value); }
  async fillPassword(value: string) { await this.page.getByLabel("Password").fill(value); }
  async submit() { await this.page.getByRole("button", { name: "Log in" }).click(); }
}

// business action — intent, composes page object calls
export async function login(page: Page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.fillUsername(username);
  await loginPage.fillPassword(password);
  await loginPage.submit();
  await page.waitForURL("**/dashboard");
}
```

## Locator selection order

Prefer, in this order, stopping at the first that's available:
1. An existing `data-testid`/`aria-label` already used elsewhere in the project for this element.
2. A semantic role query (`getByRole`, `getByLabel`, `getByText`) — resilient to styling changes, readable without inspecting the DOM.
3. A CSS selector scoped to a stable structural relationship, only when 1 and 2 aren't viable.

If none of the three is viable (the element has no stable identifier and no semantic role), that is the `flag-for-testid` case from `auto-testcase-designer`'s locator-strategy reference — surface it as a blocker rather than writing a brittle selector.

## What breaks the pattern

- A spec file containing `page.locator('.css-class-xyz')` directly — locator logic that isn't reusable and isn't isolated from the test's own logic.
- A page object method that hardcodes business-specific expected values (`async isPriceCorrect() { return price === "199.99" }`) — that's an assertion decision, which belongs in the spec, not the page object.
