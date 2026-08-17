# Test Cases
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Agent:** Mac terminal Claude Code agent (macOS 13 Ventura)

Automated cases reference their test file under `src/test/`. Manual cases cover flows
not covered by the automated suite.

---

## Header (src/test/Header.test.jsx)

| ID | Description | Type | Expected |
|----|-------------|------|----------|
| TC-H-01 | Renders logo and cart link | Automated | "SampleShop" text and cart link present |
| TC-H-02 | No badge when cart is empty | Automated | No numeric badge visible |
| TC-H-03 | Badge shows total item count from localStorage | Automated | Badge shows sum of quantities across all cart items |

## Product List (src/test/ProductList.test.jsx)

| ID | Description | Type | Expected |
|----|-------------|------|----------|
| TC-PL-01 | Renders all 10 products by default | Automated | All product names visible |
| TC-PL-02 | Search filters by name (case-insensitive) | Automated | Only matching products shown |
| TC-PL-03 | Category dropdown filters products | Automated | Only products in selected category shown |
| TC-PL-04 | Empty state when no products match | Automated | "No products match your filters." message |
| TC-PL-05 | Out-of-stock label on unavailable products | Automated | "Out of stock" label visible on stock=0 products |
| TC-PL-06 | Product card links to details page | Manual | Clicking a card navigates to /products/:id |

## Product Details (src/test/ProductDetails.test.jsx)

| ID | Description | Type | Expected |
|----|-------------|------|----------|
| TC-PD-01 | Renders product info for valid id | Automated | Name, price, description visible |
| TC-PD-02 | Not-found state for unknown id | Automated | "Product not found" + back link |
| TC-PD-03 | Out-of-stock: no Add/Buy buttons | Automated | Buttons absent for stock=0 product |
| TC-PD-04 | Add to Cart shows confirmation | Automated | Confirmation message appears after click |
| TC-PD-05 | Buy Now navigates to /cart | Automated | Cart page rendered after click |
| TC-PD-06 | Qty selector capped at min(10, stock) | Automated | Only options 1–8 for product with stock=8 |
| TC-PD-07 | Back link returns to product list | Manual | "← Back to products" navigates to / |

## Cart (src/test/Cart.test.jsx)

| ID | Description | Type | Expected |
|----|-------------|------|----------|
| TC-C-01 | Empty state when cart is empty | Automated | "Your cart is empty" + continue shopping link |
| TC-C-02 | Renders items from localStorage | Automated | Item name and totals visible |
| TC-C-03 | Quantity change updates line total | Automated | Line total recalculates on select change |
| TC-C-04 | Remove item empties one-item cart | Automated | Cart shows empty state after removal |
| TC-C-05 | Subtotal is sum of all line totals | Automated | Correct total for multi-item cart |
| TC-C-06 | Cart persists after page reload | Manual | Reload browser; items still present |
| TC-C-07 | Checkout button is visible | Manual | Button present (non-functional Phase 1) |

## Failure Demo

| ID | Description | Type | Status |
|----|-------------|------|--------|
| TC-FAIL-01 | Cart qty exceeds stock | Manual/Exploratory | Defect DEF-001 — not blocked by UI (no stock enforcement on Cart page) |
