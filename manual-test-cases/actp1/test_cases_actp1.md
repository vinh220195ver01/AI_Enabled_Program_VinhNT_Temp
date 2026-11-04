# Manual Test Suite: ACTP Clothes Shop

**Target Website**: [ACTP Clothes Shop](https://actp1.csc.edu.vn/)  
**Platform/Tech Stack**: WordPress + WooCommerce (Neve Theme)  
**Total Test Cases**: 20  
**Date**: September 18, 2026  

---

## Executive Summary Matrix

| TC ID | Feature / Module | Test Case Title | Priority |
|---|---|---|---|
| **TC_NAV_001** | Navigation | Verify Header Navigation Links & Category Dropdown | High |
| **TC_NAV_002** | Search | Verify Global Product Search with Valid Keyword | High |
| **TC_NAV_003** | Search | Verify Global Product Search with Non-Existent Keyword | Medium |
| **TC_AUTH_001** | Account / Auth | Verify User Registration with Valid Details | High |
| **TC_AUTH_002** | Account / Auth | Verify User Registration with Existing Email | Medium |
| **TC_AUTH_003** | Account / Auth | Verify User Login with Valid Credentials | High |
| **TC_AUTH_004** | Account / Auth | Verify User Login with Invalid Password | High |
| **TC_AUTH_005** | Account / Auth | Verify "Lost Your Password?" Reset Password Workflow | Medium |
| **TC_CAT_001** | Catalog / Shop | Verify Product Catalog Sorting by Price (Low to High / High to Low) | Medium |
| **TC_CAT_002** | Catalog / Shop | Verify Category Filtering (e.g., Clothing, Dresses, T-Shirt, Blouse) | High |
| **TC_PDP_001** | Product Detail | Verify Product Details Page (PDP) Display & Gallery | High |
| **TC_PDP_002** | Product Detail | Verify Adding Custom Quantity to Cart from PDP | High |
| **TC_PDP_003** | Product Detail | Verify Submitting Product Review and Rating | Low |
| **TC_CART_001** | Shopping Cart | Verify Adding Product to Cart directly from Shop Catalog Grid | High |
| **TC_CART_002** | Shopping Cart | Verify Updating Item Quantity in Cart & Price Recalculation | High |
| **TC_CART_003** | Shopping Cart | Verify Coupon Code Application (Valid & Invalid Coupons) | Medium |
| **TC_CART_004** | Shopping Cart | Verify Removing Item from Shopping Cart | High |
| **TC_CHK_001** | Checkout | Verify Form Field Validation on Mandatory Billing Information | High |
| **TC_CHK_002** | Checkout | Verify End-to-End Order Placement and Thank You Page | High |
| **TC_ACC_001** | My Account | Verify Updating Billing & Shipping Address in Account Dashboard | Medium |

---

## Detailed Test Cases

---

### Module 1: Navigation & Search

#### TC_NAV_001: Verify Header Navigation Links & Category Dropdown
* **Module**: Header & Navigation
* **Priority**: High
* **Preconditions**: Browser is open and navigated to `https://actp1.csc.edu.vn/`.
* **Test Steps**:
  1. Observe the top navigation bar items: `Home`, `Shop`, `Categories` (Clothing, Dresses, T-shirt, Blouse), `Blog`, `My Account`, and `Cart`.
  2. Click on `Shop`.
  3. Hover over / click on `Clothing` category and select `Dresses`.
  4. Click on `My Account`.
  5. Click on the website logo/title `ACTP Clothes Shop`.
* **Expected Result**:
  * Step 2: Navigates to `/shop/` page showing all published products.
  * Step 3: Navigates to `/category/clothing/dresses/` showing only dress items.
  * Step 4: Navigates to `/my-account/` page.
  * Step 5: Returns user to homepage `https://actp1.csc.edu.vn/`.

---

#### TC_NAV_002: Verify Global Product Search with Valid Keyword
* **Module**: Search
* **Priority**: High
* **Preconditions**: User is on the homepage.
* **Test Steps**:
  1. Click on the search input icon/bar in the header.
  2. Type a valid product keyword (e.g., `dress` or `shirt`).
  3. Press `Enter` or click the Search button.
* **Expected Result**:
  * Search result page displays items matching the search query (e.g., *Golden Glow Ribbed Knit Dress*, *Midnight Bloom Crochet Dress*, *Radiant One Shoulder T-Shirt*).
  * Result page URL contains search parameter (e.g., `?s=dress`).

---

#### TC_NAV_003: Verify Global Product Search with Non-Existent Keyword
* **Module**: Search
* **Priority**: Medium
* **Preconditions**: User is on the homepage.
* **Test Steps**:
  1. Click on the search bar.
  2. Enter a non-matching keyword (e.g., `xyz123laptop`).
  3. Press `Enter`.
* **Expected Result**:
  * Search results page displays a friendly message such as *"No products were found matching your selection"* or *"Nothing Found"*.
  * No error pages or broken UI components occur.

---

### Module 2: Authentication & Account Management

#### TC_AUTH_001: Verify User Registration with Valid Details
* **Module**: Authentication
* **Priority**: High
* **Preconditions**: User is not logged in.
* **Test Steps**:
  1. Navigate to `https://actp1.csc.edu.vn/my-account/`.
  2. Locate the **Register** section (if enabled).
  3. Enter a valid unique email address (e.g., `testuser_actp_01@example.com`).
  4. Enter a strong password meeting security requirements.
  5. Click `Register`.
* **Expected Result**:
  * Account is created successfully.
  * User is automatically logged in and redirected to the My Account Dashboard.
  * Welcome notification displayed with username/email.

---

#### TC_AUTH_002: Verify User Registration with Existing Email
* **Module**: Authentication
* **Priority**: Medium
* **Preconditions**: An account with email `testuser_actp_01@example.com` already exists.
* **Test Steps**:
  1. Navigate to `/my-account/`.
  2. Enter `testuser_actp_01@example.com` in the Register Email field.
  3. Enter a valid password.
  4. Click `Register`.
* **Expected Result**:
  * Registration fails.
  * Error alert banner appears stating: *"An account is already registered with your email address. Please log in."*

---

#### TC_AUTH_003: Verify User Login with Valid Credentials
* **Module**: Authentication
* **Priority**: High
* **Preconditions**: Registered account exists with known username/email and password.
* **Test Steps**:
  1. Navigate to `/my-account/`.
  2. Enter valid registered email/username in the Login section.
  3. Enter correct password.
  4. (Optional) Check `Remember me`.
  5. Click `Log in`.
* **Expected Result**:
  * User logs in successfully.
  * Dashboard displays options: *Dashboard, Orders, Downloads, Addresses, Account details, Logout*.

---

#### TC_AUTH_004: Verify User Login Failure with Invalid Password
* **Module**: Authentication
* **Priority**: High
* **Preconditions**: Registered account exists.
* **Test Steps**:
  1. Navigate to `/my-account/`.
  2. Enter valid email/username.
  3. Enter an incorrect password (e.g., `wrongpass123`).
  4. Click `Log in`.
* **Expected Result**:
  * Login fails.
  * Error notice displayed: *"Error: The password you entered for the username ... is incorrect."*
  * User remains on the login page.

---

#### TC_AUTH_005: Verify "Lost Your Password?" Reset Password Workflow
* **Module**: Authentication
* **Priority**: Medium
* **Preconditions**: User is on `/my-account/` login page.
* **Test Steps**:
  1. Click the `Lost your password?` link.
  2. Verify redirection to lost password page (`/my-account/lost-password/`).
  3. Enter registered email address.
  4. Click `Reset password`.
* **Expected Result**:
  * Success notification shown: *"Password reset email has been sent."*
  * Reset link instructions sent to user email.

---

### Module 3: Product Catalog & Browsing

#### TC_CAT_001: Verify Product Catalog Sorting Options
* **Module**: Product Catalog
* **Priority**: Medium
* **Preconditions**: Navigate to `/shop/`.
* **Test Steps**:
  1. Locate the default sorting dropdown (`Default sorting`).
  2. Select `Sort by price: low to high`.
  3. Verify product price order.
  4. Select `Sort by price: high to low`.
  5. Verify product price order.
* **Expected Result**:
  * Step 2-3: Catalog reloads showing products sorted in ascending price order.
  * Step 4-5: Catalog reloads showing products sorted in descending price order.

---

#### TC_CAT_002: Verify Category Filtering
* **Module**: Product Catalog
* **Priority**: High
* **Preconditions**: User is on `/shop/`.
* **Test Steps**:
  1. Select category `Blouse` from menu or category widget.
  2. Observe displayed products and breadcrumb navigation.
  3. Switch category to `Clothing -> Tshirt`.
* **Expected Result**:
  * Step 1: Only products under `Blouse` category are displayed. Breadcrumb shows `Home / Shop / Blouse`.
  * Step 3: Only products assigned to `Tshirt` category are displayed.

---

### Module 4: Product Detail Page (PDP) & Reviews

#### TC_PDP_001: Verify Product Detail Page Display & Elements
* **Module**: Product Detail Page
* **Priority**: High
* **Preconditions**: Navigate to a product page (e.g., `/shop/golden-glow-ribbed-knit-dress/`).
* **Test Steps**:
  1. Inspect primary product image and gallery thumbnail zoom.
  2. Verify presence of Title, Price, Availability status ("In stock"), SKU, Categories, and Tags.
  3. Verify tabs section: `Description`, `Additional information`, `Reviews`.
* **Expected Result**:
  * All product details display accurately without visual glitches or missing content placeholders.

---

#### TC_PDP_002: Verify Selecting Product Quantity and Adding to Cart from PDP
* **Module**: Product Detail Page
* **Priority**: High
* **Preconditions**: User is on a single product page.
* **Test Steps**:
  1. Change quantity selector from default `1` to `3`.
  2. Click the `Add to cart` button.
  3. Observe cart widget badge in header and page banner notification.
* **Expected Result**:
  * Success message displayed: *“3 × ‘Golden Glow Ribbed Knit Dress’ have been added to your cart.”* with a `View cart` link.
  * Header cart count updates to reflect added items.

---

#### TC_PDP_003: Verify Submitting Product Review and Rating
* **Module**: Product Detail Page
* **Priority**: Low
* **Preconditions**: User is on single product page under `Reviews` tab.
* **Test Steps**:
  1. Click on `Reviews` tab.
  2. Select star rating (e.g., 5 stars).
  3. Fill in comment field: *"Great quality and fit!"*.
  4. Fill in Name and Email fields (if guest user).
  5. Click `Submit`.
* **Expected Result**:
  * Review submits successfully.
  * Notice displays *"Your review is awaiting approval"* or review appears instantly in list.

---

### Module 5: Shopping Cart Management

#### TC_CART_001: Verify Adding Product to Cart from Catalog Grid
* **Module**: Shopping Cart
* **Priority**: High
* **Preconditions**: Navigate to `/shop/`.
* **Test Steps**:
  1. Locate product card (e.g., *Bold Statement Graphic Tee*).
  2. Click `Add to cart` button directly on card.
  3. Click header `Cart` icon.
* **Expected Result**:
  * Button text changes / spinner shows item added.
  * Cart page/drawer reflects selected product with correct item count and price.

---

#### TC_CART_002: Verify Updating Item Quantity in Cart & Price Recalculation
* **Module**: Shopping Cart
* **Priority**: High
* **Preconditions**: Navigate to `/cart/` with at least 1 item present.
* **Test Steps**:
  1. Note original Subtotal and Total.
  2. Change item quantity input field from `1` to `2`.
  3. Click `Update cart` button (or check auto-update trigger).
* **Expected Result**:
  * Cart updates successfully with notice *"Cart updated."*.
  * Line item total and overall Cart Subtotal recalculate accurately (`Unit Price x 2`).

---

#### TC_CART_003: Verify Coupon Code Application (Valid & Invalid)
* **Module**: Shopping Cart
* **Priority**: Medium
* **Preconditions**: User has items in `/cart/`.
* **Test Steps**:
  1. Enter invalid coupon code `DISCOUNT999` in coupon input field.
  2. Click `Apply coupon`.
  3. Observe error message.
  4. Enter valid coupon code (if configured, e.g., `WELCOME10`).
  5. Click `Apply coupon`.
* **Expected Result**:
  * Step 3: Error notice displayed: *"Coupon 'discount999' does not exist!"*.
  * Step 5: Discount line item added to total summary and total price deducted accordingly.

---

#### TC_CART_004: Verify Removing Item from Shopping Cart
* **Module**: Shopping Cart
* **Priority**: High
* **Preconditions**: User has items in `/cart/`.
* **Test Steps**:
  1. Locate remove item button (`×` icon) next to product row.
  2. Click `×` button.
* **Expected Result**:
  * Item is removed from list.
  * Banner notification displayed: *“[Product Name] removed. Undo?”*.
  * If cart becomes empty, displays *"Your cart is currently empty."* with `Return to shop` CTA.

---

### Module 6: Checkout & Order Placement

#### TC_CHK_001: Verify Form Field Validation on Mandatory Billing Information
* **Module**: Checkout
* **Priority**: High
* **Preconditions**: Cart has items. Navigate to `/checkout/`.
* **Test Steps**:
  1. Leave required fields blank (First Name, Last Name, Street Address, City, Phone, Email).
  2. Click `Place order` button.
* **Expected Result**:
  * Order is not submitted.
  * Validation error notices appear top of page for missing required fields (e.g., *"Billing First name is a required field."*).
  * Inputs highlighted in red border styling.

---

#### TC_CHK_002: Verify End-to-End Order Placement Workflow
* **Module**: Checkout
* **Priority**: High
* **Preconditions**: Cart has items. Navigate to `/checkout/`.
* **Test Steps**:
  1. Fill valid Billing Details:
     * First Name: `John`
     * Last Name: `Doe`
     * Country/Region: `Vietnam`
     * Street Address: `123 Main Street`
     * Town / City: `Ho Chi Minh City`
     * Phone: `0901234567`
     * Email Address: `john.doe@example.com`
  2. Select payment method (e.g., `Cash on delivery` or `Direct bank transfer`).
  3. Check `I have read and agree to the website terms and conditions` (if present).
  4. Click `Place order`.
* **Expected Result**:
  * Order processed successfully.
  * User redirected to Order Received / Thank You page (`/checkout/order-received/[order_id]/`).
  * Page displays Order Number, Date, Total, Payment Method, and Order Details summary.

---

### Module 7: Account Dashboard Management

#### TC_ACC_001: Verify Updating Billing and Shipping Addresses
* **Module**: Account Management
* **Priority**: Medium
* **Preconditions**: User is logged in at `/my-account/`.
* **Test Steps**:
  1. Click `Addresses` on My Account navigation menu.
  2. Click `Edit` under **Billing address**.
  3. Modify Street address to `456 New Blvd` and click `Save address`.
  4. Click `Edit` under **Shipping address**.
  5. Update details and click `Save address`.
* **Expected Result**:
  * Success message displayed: *"Address changed successfully."*.
  * Updated address details accurately displayed on Addresses page.
