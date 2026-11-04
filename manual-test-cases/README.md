# Manual test cases by AUT

Store each AUT's test cases under its own folder:

```text
manual-test-cases/
├── <aut-name>/
│   ├── TC001
│   └── source-workbook-or-suite.md
└── ...
```

Keep suite documents and case IDs with the AUT they test. The coverage preflight matches each case ID to `tests/<aut-name>/e2e/<case-id>.spec.ts`.
