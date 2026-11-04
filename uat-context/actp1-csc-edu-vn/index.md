# ACTP Clothes Shop — UAT Context

- **Base URL:** <https://actp1.csc.edu.vn/>
- **What it is:** WordPress + WooCommerce clothes shop (Neve theme), a training demo store that resets weekly (Saturday 01:00). Shoppers browse from Home and Shop, view product details, search, and use cart/checkout.
- **Auth required for testing:** no — Home, Shop, categories, product detail and search are public.
- **Last verified:** 2026-11-04

## Pages

| Page | File | Notes |
|---|---|---|
| Home | [pages/home.md](pages/home.md) | Header, search overlay, two product grids, footer categories; most known AUT defects live here |
| Product Detail | [pages/product-detail.md](pages/product-detail.md) | `/shop/<slug>/` — title, price, Add to cart, tabs; catalog ids |
| Shop | [pages/shop.md](pages/shop.md) | `/shop/` with sidebar category list |
| Category | [pages/category.md](pages/category.md) | `/category/...` listings and current membership |
| Search results | [pages/search-results.md](pages/search-results.md) | `/?s=` — mixed content, no-results and payload behavior |

## Flows

None recorded yet.

## Known AUT defects seen while exploring (do not adopt as expected behavior)

- Home card "Sophisticated Striped Midi Dress" links to the Midnight Bloom product; "Sunset Glow Utility Dress" links to `#dead-link`.
- Home footer "Blouse" can be `#dead-link` on a fresh session's first load.
- Home card prices are randomly replaced by values like `$11000843.00` on about half of loads.
- The `' OR '1'='1` search leaves the form disabled with empty error boxes.

## Known gaps / stale entries

Not yet explored: Cart, Checkout, My account, Blog, Reviews tab, no-results message.
