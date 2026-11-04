---
name: automation-script-generator
description: "Implement an approved Auto Test Case design and Business Action signatures as Playwright/TypeScript code — test specs, business action functions, and page objects. Use when: (1) auto-testcase-designer and business-action-designer have produced a design and it's time to actually write the .spec.ts / action / page-object files, (2) a Business Action's signature already exists and only its implementation needs writing or updating, (3) verifying that generated code actually runs locally before it's handed to git-workflow for commit."
---

# Automation Script Generator

Implements a design; does not create one. If you find yourself deciding what a test *should* check or what an action *should* be named while using this skill, stop — that decision belongs to `auto-testcase-designer` or `business-action-designer`. This skill's freedom is in *how* to implement a given design cleanly, not *what* to implement.

## Preconditions

- An Auto Test Case design (from `auto-testcase-designer`) and any new Business Action signatures (approved by `business-action-designer`) already exist. Do not invent either from a raw manual case — go back a step if they're missing.
- `uat-context/<site-slug>/` exists for the AUT, or will be created screen-by-screen via `autotest-get-uat-context` (see step 1a).
- Run `node <skill-path>/scripts/preflight.mjs` before generating anything. It verifies `package.json`, a Playwright config, and `@playwright/test` are present — generating code into a project that can't run it produces silent dead weight.

## Decision framework

1. **Inspect existing conventions before adding files.** Identify the AUT from the manual case, then inspect that AUT's spec, page-object, and action directories and one or two recent specs. Load `references/coding-conventions.md` for the default layout (`tests/<aut-name>/e2e/`, `pages/`, and `actions/`) — but an existing, different convention in the project always wins over the default.
1a. **For every new test case, walk through each screen the case touches, in step order, against `uat-context/<site-slug>/`** (route via `index.md`):
    - **Screen already documented** (`pages/<slug>.md` exists): take locators from that file; do not re-derive them. Page objects reuse/extend the existing class for that screen.
    - **Screen not documented**: run `autotest-get-uat-context` for it (playwright-cli snapshot + `generate-locator`), write `pages/<slug>.md` (and link it in `index.md`), then build the page object from the recorded locators.
    - **While exploring a new screen, if a previously documented screen in this walk-through shows a UI change** (locator no longer matches, element renamed/moved/removed, new element the case needs): update its `pages/<slug>.md` in the same pass (new locator, `Last verified` date, mark removed ones under "Stale / unverified") **and update the matching page object locator**, then re-run the existing specs that use that page object to confirm nothing regressed.
    - Page object locators must always trace back to a `uat-context` page file — never guess selectors from memory.
2. **One spec file per test case, named after the case ID's slug** (`tc001.spec.ts`), keeping the design's step order and using the exact manual-step and expected-result text as adjacent comments — this is what lets a reviewer trace a failing assertion back to the manual case without opening two files.
3. **Implement Business Actions exactly to the approved signature.** If the implementation reveals the signature doesn't work (e.g. a needed return value was missed), stop and send it back to `business-action-designer` rather than silently changing the signature — a signature change here breaks every other test relying on it without their awareness.
4. **Follow the Page Object pattern for locators** — see `references/page-object-pattern.md`. Specs and business actions should never contain a raw `page.locator(...)` call directly against a CSS/XPath string; that belongs behind a named method on a page object.
5. **After writing, run it locally before declaring done**: `node <skill-path>/scripts/run-local-playwright.mjs <spec-file>` for the focused spec, then without arguments for the full suite. A generated test that hasn't been run is a guess, not a result.

## NEVER

- **NEVER use `waitForTimeout`.** It hides the real condition the test should be waiting for and makes the test flaky under different machine speeds. Wait on a locator, an assertion, or a project-defined network/state signal instead.
- **NEVER weaken an assertion to make a failing test pass.** If the assertion fails because of a genuine product bug, report it and ask how to proceed — do not loosen the expected value or add a try/catch that swallows the failure.
- **NEVER let a test depend on execution order or leftover state from a previous test.** Each spec must set up and tear down its own data; a suite that only passes in one run order is not actually testing what it claims to.
- **NEVER change product code to make a test pass unless the case's design explicitly notes a real blocker** (missing test hook, genuine defect) that `auto-testcase-designer` already flagged. An unplanned product-code change belongs in its own reviewed decision, not something buried inside a script-generation pass.

## Templates

Load `templates/testcase.spec.ts`, `templates/business-action.ts`, and `templates/page-object.ts` **only as a structural starting point**, right before writing each corresponding file type — never as fill-in-the-blank forms. Reconcile every name, import, and fixture usage against the project's actual conventions from step 1 before saving. Do NOT load a template when the project already has an established pattern for that file type from step 1's inspection (e.g. it already uses fixtures, or a different directory layout) — adapt the existing pattern instead of introducing the template's own. Copying a template verbatim without reconciling it against the existing codebase is how a project ends up with two incompatible testing styles.

## Handoff

Once generated code passes locally, hand off to `git-workflow` for branching/commit — this skill does not touch git. If a run fails and the cause isn't an obvious typo, hand off to `automation-debugger` instead of iterating blindly.
