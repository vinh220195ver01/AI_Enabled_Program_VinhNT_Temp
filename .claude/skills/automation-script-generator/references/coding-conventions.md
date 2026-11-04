# Default project layout and conventions

Loaded by `SKILL.md` step 1. These are fallback defaults — an existing, different project convention always takes precedence; check before applying any of this.

## Directory layout

```
tests/
├── <aut-name>/
│   ├── e2e/         # one .spec.ts per test case, named <case-id-slug>.spec.ts
│   ├── pages/       # AUT-specific page objects
│   └── actions/     # AUT-specific Business Action functions, grouped by feature
└── shared/          # cross-AUT helpers/fixtures only when genuinely reusable
```

Keep each AUT's specs, page objects, actions, and configuration together. Do not put an AUT URL, locator, test data, or assertion in `tests/shared/` or the root Playwright config. Shared code must not depend on one AUT.

## Spec file conventions

- Import business actions and page objects; a spec should read as a sequence of action calls and assertions, not raw Playwright API calls.
- Comment format directly above the assertion it describes, on separate lines:
  ```ts
  // Step 4: Verify displayed price
  // Expected: Price matches catalog price
  expect(await productPage.getDisplayedPrice()).toBe(catalogPrice);
  ```
- Keep one `test()` block per manual case scenario; if the design lists multiple scenarios for one case (e.g. happy path + validation), one `test()` per scenario inside a shared `test.describe()` for the case.

## Business action file conventions

- Group by AUT, then by feature — `tests/shop/actions/auth.ts` holds `login`, `logout`; not `tests/shop/actions/tc001.ts`.
- Export named functions, not a class with static methods, unless the project already uses classes for actions (check existing files first).
- A business action receives a `Page` (or the project's existing fixture type) as its first parameter, per `references/page-object-pattern.md`.

## Naming

- Spec file: `<case-id-slug>.spec.ts` (e.g. `TC001` → `tc001.spec.ts`).
- Page object class: `<ScreenName>Page` (e.g. `ProductDetailPage`).
- Business action function: matches exactly the `finalSignature` approved by `business-action-designer` — do not adjust casing or naming during implementation.
