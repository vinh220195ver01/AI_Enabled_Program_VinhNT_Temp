# Page: Search results

- **URL:** `https://actp1.csc.edu.vn/?s=<keyword>`
- **Purpose:** Result list after submitting the Home header Search overlay.
- **Last verified:** 2026-11-04

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Heading | `getByRole('heading', { level: 1 })` | `//main//h1` | Text `Search Results for: <keyword>`; `<title>` is `Search Results for “<keyword>” – ACTP Clothes Shop` |
| Result titles | `getByRole('main').getByRole('article').getByRole('heading', { level: 2 })` | `//main//article//h2` | One article per hit |

## Notable states

- **Mixed content:** results include blog posts and pages, not only products. `Hat` returned 11 hits (several products plus posts/pages such as "Sample Page" and "Home"); `Dress` returned 8 hits including the hat product "Floral Elegance Sun Hat".
- No-results: `<body>` gets class `search-no-results`; no visible message was found with the common WooCommerce selectors (message wording is open question Q03).
- **Query `' OR '1'='1`:** the Home search form stays disabled and shows two empty `woocommerce-error` boxes; the page never navigates to `?s=`.
- Script-like query `<script>alert("TR043")</script>` navigates to results without any dialog.

## Stale / unverified

None.
