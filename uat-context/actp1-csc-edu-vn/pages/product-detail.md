# Page: Product Detail

- **URL:** `https://actp1.csc.edu.vn/shop/<product-slug>/` (example: <https://actp1.csc.edu.vn/shop/bold-statement-graphic-tee/>)
- **Purpose:** Single WooCommerce product page: title, price, quantity, Add to cart, categories, Description/Reviews tabs, related products.
- **Last verified:** 2026-11-04

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Product title (h1) | `getByRole('heading', { level: 1 })` | `//h1[contains(@class,'product_title')]` | Exactly one h1 |
| Quantity input | `getByRole('spinbutton', { name: 'Product quantity' })` | `//input[contains(@class,'qty')]` | Defaults to 1 |
| Add to cart button | `getByRole('button', { name: 'Add to cart' })` | `//button[@name='add-to-cart']` | `value` attribute is the catalog product id (e.g. 97 for Bold Statement Graphic Tee) — used as the catalog identity |
| Current price | `locator('div.summary p.price')` then `ins .amount` if present, else `.amount` | `//div[contains(@class,'summary')]//p[contains(@class,'price')]` | Sale products show `<del>` original and `<ins>` current price. No testid |
| Description tab | `getByRole('tab', { name: 'Description' })` | `//a[@href='#tab-description']` | Selected by default |
| Reviews tab | `getByRole('tab', { name: /^Reviews/ })` | `//a[@href='#tab-reviews']` | Name includes count, e.g. `Reviews (0)` |
| Breadcrumb | `getByRole('navigation', { name: 'Breadcrumb' })` | `//nav[contains(@class,'woocommerce-breadcrumb')]` | Home / Shop / Category / … / Product name |

Playwright locators come from `playwright-cli generate-locator` and in-session verification; XPaths were each verified to match exactly one element.

## Notable states

- `<body>` classes include `single single-product postid-<id>`; `<title>` is `<Product Name> – ACTP Clothes Shop`.
- Catalog ids (2026-11-04): Floral Elegance Sun Hat 57, Classic Striped Knit Blouse 62, Golden Glow Ribbed Knit Dress 67, Midnight Bloom Crochet Dress 72, Sophisticated Striped Midi Dress 77, Sunset Glow Utility Dress 82, Radiant One-Shoulder T-Shirt 87, Sophisticated Ribbed Turtleneck Tee 92, Bold Statement Graphic Tee 97.
- Sale prices: Bold Statement Graphic Tee $18.00 → $15.00, Golden Glow Ribbed Knit Dress $15.00 → $12.00, Sophisticated Ribbed Turtleneck Tee $15.00 → $12.00.
- The inflated-price defect described in [home.md](home.md) was not seen on product detail pages when fetched directly, but a Home card can disagree with the PDP when Home is in the bad state.

## Stale / unverified

None.
