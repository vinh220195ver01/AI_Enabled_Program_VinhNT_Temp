# Locator failure debugging

Loaded by `SKILL.md` step 2 for a failure classified as a locator problem.

## Diagnostic order

1. **Ambiguous from the start (`resolved to N elements`)**: the locator was never unique. Check the Playwright trace/HTML report for how many elements matched and inspect each — is there a hidden duplicate (e.g. a mobile-only nav rendered alongside the desktop one)? Fix by scoping the locator to a stable parent, or switching to `references/page-object-pattern.md`'s locator selection order (test-id > semantic role > scoped CSS) instead of a generic query.
2. **DOM changed since the test/page object was written**: compare the locator's expected structure against the current rendered DOM (open the app, inspect the element). A rename, a wrapped `<div>`, or a swapped component library are the usual causes. Fix the page object's locator; do not patch the spec directly, since other specs likely share the same page object.
3. **Element not yet rendered when queried (`element not found`, zero matches)**: this is often mis-classified as a locator failure when it's actually a timing issue — check whether the element appears after an async action (API call, animation, lazy mount). If so, reclassify as a timeout and use `timeout-debugging.md`'s wait-condition guidance instead of tweaking the selector.

## Fix, don't patch

If the root cause is DOM structure, fix it at the page object level so every consumer of that locator benefits — do not add a one-off fallback selector inside a single spec. A spec-local patch silently diverges from the shared page object and reappears the next time someone else hits the same stale locator elsewhere.

## When to flag instead of fix

If the element genuinely has no stable identifier and multiple similarly-structured elements exist with no reliable semantic distinction, this is the same `flag-for-testid` situation `auto-testcase-designer` may have already flagged at design time. Recommend adding a `data-testid` to the application rather than building an increasingly specific, brittle CSS path — a long CSS chain selector is a sign the right fix is in the app, not the test.
