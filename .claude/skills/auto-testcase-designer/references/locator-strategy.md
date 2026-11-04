# Locator strategy hints

Loaded by `SKILL.md` step 6 only when a case touches dynamic lists, modals, or elements without a stable identifier. Skip for plain static-page forms — the default "use the existing test ID or a semantic role query" guidance needs no elaboration there.

This skill assigns a **strategy hint**, not a literal selector — `automation-script-generator` picks the exact Playwright locator API and string. The hint exists so the generator doesn't have to re-derive context the design phase already worked out.

## Hint categories

| Situation | Hint to record | Why it matters at design time |
|---|---|---|
| Element repeats per list item (e.g. "the price of the *first* result") | `nth-match` + the disambiguating text/attribute (e.g. "row containing product name") | The generator needs to know the case means "first match", not "any match" — a design that just says "click price" is ambiguous once the list has more than one row. |
| Element only exists after an async action (modal, toast, lazy-loaded section) | `wait-for-visible-before-interact` | Signals the generator must anchor on the triggering state, not assume the element is present at test start — prevents someone reaching for `waitForTimeout` as a shortcut. |
| Element has no stable `data-testid`/`aria-label` and multiple similar elements exist | `flag-for-testid` | This is a signal to *add* a test ID to the app (a legitimate product-code change) rather than build a brittle text/CSS selector — record it as a blocker for human confirmation per the case's implementation rules, not something to work around silently. |
| Element text is dynamic/localized (price, date, username) | `match-pattern` + the stable part (e.g. currency symbol + numeric pattern) | Prevents the generator from hardcoding a literal string that will break on the next data change. |

## What NOT to record here

Do not record framework-specific locator syntax (`page.locator(...)`, CSS selectors, XPath) — that couples the design to one automation framework and becomes stale the moment `automation-script-generator`'s conventions change. The hint should still make sense if the project switched from Playwright to another tool.
