# Page: <Page Name>

- **URL:** <https://example.com/path>
- **Purpose:** <what this page is for, in one or two sentences>
- **Last verified:** <YYYY-MM-DD>

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Search input | `getByRole('textbox', { name: 'Search' })` | `//input[@name='search']` | <required, validation, etc.> |
| Submit button | `getByTestId('submit-button')` | `//button[@data-testid='submit-button']` | <disabled until X, etc.> |

Playwright locators come from `playwright-cli generate-locator <ref> --raw`. XPaths are relative,
attribute-based, and verified to match exactly one element; use as `page.locator('xpath=<xpath>')`. Never
record raw snapshot refs (`e15` etc.) or absolute XPaths — they don't survive.

## Forms

### <Form name, e.g. "Contact form">

| Field | Type | Required | Validation |
|---|---|---|---|
| Email | text | yes | must be a valid email format |

## Notable states

<Loading, empty, and error states you actually observed — skip states you didn't check rather than
guessing.>

## Stale / unverified

<Anything previously documented here that no longer matches the live page. Remove this section if
everything above is current.>
