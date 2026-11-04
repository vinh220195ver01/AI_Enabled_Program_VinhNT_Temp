# Page: Shop

- **URL:** <https://actp1.csc.edu.vn/shop/>
- **Purpose:** Product catalog with a left sidebar (search, "Product categories") and a product grid.
- **Last verified:** 2026-11-04

## Key elements

| Element | Playwright locator | XPath (fallback) | Notes |
|---|---|---|---|
| Sidebar "Product categories" label | `getByRole('complementary').getByText('Product categories', { exact: true })` | `//aside//p[normalize-space()='Product categories']` | |
| Sidebar category link | `<label>.locator('xpath=following-sibling::ul[1]').getByRole('link', { name: 'Dresses', exact: true })` | `//aside//ul[contains(@class,'product-categories')]//a[normalize-space()='Dresses']` | Links go to `/category/...`; here Blouse works (`/category/blouse/`) |
| Sort dropdown | `getByRole('combobox', { name: 'Shop order' })` | | Not used by the current specs |

## Notable states

- The primary-menu Shop link has a submenu (Clothing, Dresses, Tshirt, Blouse) opened with the "Open Submenu" button; the Shop page itself also offers the category list. Which route is the approved one is open question Q04 in the manual cases; specs use the Shop page's sidebar.

## Stale / unverified

None.
