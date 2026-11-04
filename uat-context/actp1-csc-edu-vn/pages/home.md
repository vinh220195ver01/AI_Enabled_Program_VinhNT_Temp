# Page: Home

- **URL:** <https://actp1.csc.edu.vn/>
- **Purpose:** Landing page with header (menu, search overlay, cart), hero banner, a "Latest Products" grid, a "BE INSPIRED. GET AHEAD OF TRENDS." grid and a footer with "Product categories".
- **Last verified:** 2026-11-04

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Section heading (either section) | `getByRole('heading', { name: 'Latest Products' })`, `getByRole('heading', { name: 'BE INSPIRED. GET AHEAD OF TRENDS.' })` | `//h2[normalize-space()='LATEST PRODUCTS']` | DOM text is uppercase; role-name matching is case-insensitive. Sections are NOT built the same way: Latest Products has its grid as a sibling of the heading, the Trends heading sits in a separate block before its grid |
| Section grid | `<heading>.locator('xpath=following::div[contains(@class,"wc-block-grid")][1]')` | same XPath relative to the heading | WooCommerce handpicked-products block, works for both sections. Latest Products has 8 cards, Trends 4 (counts are examples, not fixed) |
| Product card link | `<grid>.getByRole('link', { name: '<Product Name>' })` | `<grid>//a[.//img[@alt='<Product Name>']]` | Accessible name is the product name repeated (img alt + title) so match by substring. Scope to the grid: names also appear in the other section and in footer widgets |
| Card name / price | `<card>.locator('.wc-block-grid__product-title')`, `.wc-block-grid__product-price` | `.//*[contains(@class,'wc-block-grid__product-title')]` | No testid; CSS classes from the WooCommerce block. Sale cards render `<del>` (original) and `<ins>` (current) inside the price box; others a single `.amount` |
| Primary menu "Shop" link | `getByRole('navigation', { name: 'Primary Menu' }).getByRole('link', { name: 'Shop' })` | `//nav[@aria-label='Primary Menu']//a[normalize-space()='Shop']` | Goes to `/shop/`. Next to it a "Open Submenu" button opens Clothing / Dresses / Tshirt / Blouse |
| Header Search control | `getByRole('link', { name: 'Search' })` | `//a[@aria-label='Search' and @href='#']` | Opens an overlay; URL stays `/` |
| Search overlay input | `getByRole('searchbox', { name: 'Search' })` | `//input[@name='s' and @placeholder='Search for...']` | Placeholder `Search for...`; hidden until the control is activated |
| Search overlay submit | `getByRole('button', { name: 'Search' })` | `//button[contains(@class,'search-submit')]` | |
| Search overlay Close | `getByRole('button', { name: 'Close' })` | | Dismisses overlay without searching |
| Footer "Product categories" label | `getByRole('contentinfo').getByText('Product categories', { exact: true }).first()` | `//footer//p[normalize-space()='Product categories']` | The text appears twice inside the footer region; use `.first()` |
| Footer category link | `<label>.locator('xpath=following-sibling::ul[1]').getByRole('link', { name: 'Dresses', exact: true })` | `//footer//ul[contains(@class,'product-categories')]//a[normalize-space()='Dresses']` | Categories listed: Blouse, Clothing, Dresses, Tshirt, Uncategorized, each followed by a count like `(4)` outside the link |

Playwright locators come from `playwright-cli` snapshots and were verified in-session (counts matched); XPaths are relative.

## Notable states

- Cards (2026-11-04): Latest Products: Bold Statement Graphic Tee, Floral Elegance Sun Hat, Golden Glow Ribbed Knit Dress, Midnight Bloom Crochet Dress, Radiant One-Shoulder T-Shirt, Sophisticated Ribbed Turtleneck Tee, Sophisticated Striped Midi Dress, Sunset Glow Utility Dress. Trends: Golden Glow Ribbed Knit Dress, Midnight Bloom Crochet Dress, Sophisticated Striped Midi Dress, Sunset Glow Utility Dress.
- **AUT defect — wrong/dead card targets (stable):** the "Sophisticated Striped Midi Dress" card links to `/shop/midnight-bloom-crochet-dress/`; the "Sunset Glow Utility Dress" card links to `#dead-link` (clicking stays on Home). Both in both sections.
- **AUT defect — dead footer link (seen on first load of a fresh session, later loads were fine):** footer "Blouse" can have `href="#dead-link"` instead of `/category/blouse/`.
- **AUT defect — inflated prices (intermittent, about half of loads):** every card price is replaced by a random value like `$11000843.00` (normally e.g. `$15.00`/`$12.00`). Any price assertion on Home can fail on a bad load.
- `<body>` class includes `home`.

## Stale / unverified

None.
