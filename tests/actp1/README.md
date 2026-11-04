# ACTP1 Clothes Shop

- AUT URL: https://actp1.csc.edu.vn/
- Manual suite: `manual-test-cases/actp1/Test_Case.xlsx` (sheet "TC List", 116 cases `TC_001`–`TC_116`; the older `test_cases_actp1.md` is a separate draft suite)
- Layout: specs in `e2e/` (`tc_<nnn>.spec.ts`), page objects in `pages/`, business actions in `actions/` (`catalog`, `search`, `navigation`), catalog fixture in `data/catalog.ts`.
- UI context and locators: `uat-context/actp1-csc-edu-vn/`. Keep ACTP1 URLs, WooCommerce locators and test data in this domain rather than shared automation code.

## Coverage

Automated (56): `TC_001`–`TC_049`, `TC_051`, `TC_052`, `TC_057`, `TC_058`, `TC_059`, `TC_071`, `TC_072`.

Not automated (60) — the manual case itself is unfinished, so there is nothing to assert yet:
- Expected result is `TBD` and the case is BLOCKED on a clarification: `TC_050` (Q04), `TC_060`–`TC_070` (Q01), `TC_073` (Q03), `TC_074`–`TC_081` (Q02), `TC_082`–`TC_098` (Q05/Q06), `TC_099` (Q07), `TC_100`–`TC_114` (Q09), `TC_115`–`TC_116` (Q08).
- Needs fixtures/approvals that do not exist on the live site: `TC_053`–`TC_056` (long-name product and large-price fixtures need catalog changes plus Q08/Q09).

## Known failing specs (AUT defects, not test bugs)

Run against the live site on 2026-11-04 these fail because the site misbehaves; do not loosen the assertions:
- `TC_045`–`TC_048`: "Sophisticated Striped Midi Dress" card opens the Midnight Bloom product; "Sunset Glow Utility Dress" card is `#dead-link`.
- `TC_021`, `TC_049`: footer "Blouse" can be `#dead-link`.
- `TC_041`, `TC_042`, `TC_044`, `TC_051`, `TC_052`: intermittent inflated prices on Home cards (about half of page loads), so these pass or fail per load.
- `TC_059`: the manual oracle says "Dress" excludes the hat, but the site returns "Floral Elegance Sun Hat" for "Dress".

`TC_072` only asserts that no query error text is exposed: the site never navigates for that payload, and the expected presentation is still open (Q01/Q06).
