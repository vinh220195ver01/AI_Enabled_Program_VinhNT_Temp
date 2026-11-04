# Automation tests by AUT

Each AUT owns its specs and UI-specific support code:

```text
tests/
├── <aut-name>/
│   ├── e2e/       # specs named <case-id>.spec.ts
│   ├── pages/     # page objects and AUT-specific locators
│   └── actions/   # reusable business actions for this AUT
└── shared/        # only code that is independent of every AUT
```

`playwright.config.ts` at the repository root is shared and discovers specs recursively under `tests/`. Keep AUT URLs, locators, test data, and domain-specific behavior inside the corresponding AUT folder.
