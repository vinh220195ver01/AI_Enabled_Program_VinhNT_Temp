# Page: Product category listing

- **URL:** `https://actp1.csc.edu.vn/category/<slug>/` (`blouse`, `clothing`, `clothing/dresses`, `clothing/tshirt`, `uncategorized`)
- **Purpose:** Lists the products assigned to one category (a parent category includes its children's products).
- **Last verified:** 2026-11-04

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Listing identity | page `<title>` = `<Category> – ACTP Clothes Shop` | `//title` | There is no h1 on this page; identity comes from the title and breadcrumb |
| Breadcrumb | `getByRole('navigation', { name: 'Breadcrumb' })` | `//nav[contains(@class,'woocommerce-breadcrumb')]` | e.g. `Home \ Shop \ Clothing \ Dresses` |
| Product names | `getByRole('main').getByRole('heading', { level: 2 })` | `//main//li[contains(@class,'product')]//h2` | Sidebar widgets use paragraphs, so only products are level-2 headings inside main |

## Notable states

Membership (2026-11-04): Blouse = Classic Striped Knit Blouse; Clothing = Bold Statement Graphic Tee, Golden Glow Ribbed Knit Dress, Midnight Bloom Crochet Dress, Radiant One-Shoulder T-Shirt, Sophisticated Ribbed Turtleneck Tee, Sophisticated Striped Midi Dress, Sunset Glow Utility Dress; Dresses = Golden Glow Ribbed Knit Dress, Midnight Bloom Crochet Dress, Sophisticated Striped Midi Dress, Sunset Glow Utility Dress; Tshirt = Bold Statement Graphic Tee, Radiant One-Shoulder T-Shirt, Sophisticated Ribbed Turtleneck Tee; Uncategorized = Floral Elegance Sun Hat.

## Stale / unverified

None.
