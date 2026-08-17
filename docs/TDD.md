# Technical Design Document (TDD)
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Related:** Product Requirements Document (PRD) — Phase 1
**Agent:** Mac terminal Claude Code agent (macOS 13 Ventura)

---

## 1. Architecture Overview

SampleShop is a client-only single-page application (SPA). There is no backend server in
Phase 1 — product data is bundled as a static JS module, and cart state lives in the
browser (React Context + localStorage).

```
Browser
 └─ React SPA (Vite build)
     ├─ React Router (client-side routing)
     ├─ CartContext (global cart state, backed by localStorage)
     └─ Pages: ProductList, ProductDetails, Cart
```

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI framework | React 19 | Component model fits page-based structure; wide ecosystem |
| Build tool | Vite | Fast dev server + build, minimal config |
| Routing | react-router-dom v7 | Standard client-side routing for SPAs |
| State | React Context API | Cart state is small and global; no need for Redux/Zustand at this scale |
| Persistence | Browser localStorage | Simplest option that survives page reloads without a backend |
| Styling | Plain CSS per component | No CSS framework dependency; keeps bundle small |
| Testing — unit/component (TDD) | Vitest + React Testing Library | Fast, Vite-native test runner; RTL encourages testing user-visible behavior |
| Testing — e2e | Playwright | Drives the real app in system Chrome; catches routing and integration issues |
| Testing — BDD | Cucumber.js + Playwright | Gherkin feature files describe user behaviour; step definitions use Playwright to drive the browser |

## 3. Project Structure

```
src/
  components/
    Header.jsx / .css        Top nav bar with cart badge
    ProductCard.jsx / .css   Product grid tile
  context/
    CartContext.jsx          Cart state, actions, localStorage sync
  data/
    products.js              Mock product catalog + getProductById()
  pages/
    ProductList.jsx / .css
    ProductDetails.jsx / .css
    Cart.jsx / .css
  test/
    setup.js                 jest-dom matcher setup for Vitest
    testUtils.jsx            renderWithProviders() helper (Router + CartProvider)
    Header.test.jsx
    ProductList.test.jsx
    ProductDetails.test.jsx
    Cart.test.jsx
  App.jsx                    Route definitions
  main.jsx                   App entry point, provider wiring
e2e/
  sampleshop.spec.js         23 Playwright e2e tests (system Chrome, channel:'chrome')
features/                    BDD Cucumber feature files + step definitions
  support/
    world.js                 CustomWorld — browser open/close helpers
    hooks.js                 BeforeAll/Before/After lifecycle (dev server + browser)
  step_definitions/
    common_steps.js          Shared navigation and text-assertion steps
    header_steps.js          Header-specific step definitions
    product_list_steps.js    Product list step definitions
    product_details_steps.js Product details step definitions
    cart_steps.js            Cart step definitions
  header.feature             3 BDD scenarios — header navigation
  product_list.feature       6 BDD scenarios — browse, search, filter
  product_details.feature    8 BDD scenarios — detail view, add to cart, buy now
  cart.feature               6 BDD scenarios — cart management
cucumber.json                Cucumber config (paths, import, format)
docs/
  PRD.md
  TDD.md
  TestPlan.md
  TestCases.md
  TestRunReport.md
  RUNBOOK.md
  SkillsFlowDiagram.md
```

## 4. Data Model

### Product (static, `src/data/products.js`)
```js
{
  id: number,
  name: string,
  category: string,
  price: number,
  rating: number,       // 0-5
  reviewCount: number,
  image: string,        // URL
  description: string,
  stock: number,
}
```

### Cart Item (runtime, stored in localStorage under key `sample-shop-cart`)
```js
{
  id: number,       // product id
  name: string,
  price: number,
  image: string,
  quantity: number,
}
```

## 5. State Management

`CartContext` (`src/context/CartContext.jsx`) exposes:

- `items` — array of cart items
- `addToCart(product, quantity)` — adds or increments an item
- `removeFromCart(productId)` — removes a line item
- `updateQuantity(productId, quantity)` — sets quantity; removes the item if `quantity <= 0`
- `clearCart()` — empties the cart
- `itemCount` — derived total quantity across all lines (memoized)
- `subtotal` — derived sum of `price * quantity` (memoized)

Cart state is initialized synchronously from `localStorage` on mount and written back via
a `useEffect` on every change, so it survives page reloads within the same browser.

## 6. Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `ProductList` | Default/home route |
| `/products/:id` | `ProductDetails` | `id` resolved via `getProductById` |
| `/cart` | `Cart` | |

`App.jsx` renders `Header` outside `<Routes>` so the cart badge is visible on every page.

## 7. Key Component Behaviors

- **ProductList**: derives `categories` and `filteredProducts` via `useMemo` from local
  `query`/`category` state — no network calls, filtering is instant.
- **ProductDetails**: reads `:id` via `useParams`, looks up the product synchronously.
  Unknown ids render a "not found" state instead of crashing. "Buy Now" calls
  `addToCart` then `navigate('/cart')`.
- **Cart**: renders `items` from context directly; quantity `<select>` and "Remove"
  button call context actions, which re-render the page reactively.

## 8. Testing Strategy

Three automated test layers run in parallel, all required to pass before merging:

### TDD — Unit / Component (Vitest + RTL)
- `npm run test` — 19 tests across 4 files (Header, ProductList, ProductDetails, Cart)
- Pages are tested through `MemoryRouter` (+ `Routes`) and a real `CartProvider`
- `localStorage` is cleared in `beforeEach`; pre-populated via direct seeding

### E2E — End-to-End (Playwright)
- `npm run test:e2e` — 23 tests driving the live app in system Chrome (`channel: 'chrome'`)
- Playwright auto-starts `npm run dev` via `webServer` if not already running
- Covers all pages: Product List, Product Details, Cart, Header

### BDD — Behaviour-Driven (Cucumber.js + Playwright)
- `npm run test:bdd` — 23 scenarios written in Gherkin across 4 feature files
- Feature files in `features/*.feature` describe user intent in plain English
- Step definitions (`features/step_definitions/`) use Playwright with system Chrome
- A custom World class (`features/support/world.js`) manages browser lifecycle
- BeforeAll hook auto-starts `npm run dev` if not running; Before hook clears cart state
- Scenarios cover the same flows as Playwright e2e, expressed as Given/When/Then

### Test command summary
| Command | Suite | Count |
|---------|-------|-------|
| `npm run test` | Vitest unit/component | 19 tests |
| `npm run test:e2e` | Playwright e2e | 23 tests |
| `npm run test:bdd` | Cucumber BDD | 23 scenarios |

## 9. Build & Deployment

- `npm run dev` — local dev server (Vite, HMR)
- `npm run build` — production bundle to `dist/`
- `npm run preview` — serve the production build locally
- No environment variables or backend required; `dist/` is static and can be hosted on
  any static file host (GitHub Pages, Netlify, S3, etc.) in a future phase.

## 10. Known Limitations / Future Work

- No backend: product catalog is fixed at build time; cart is per-browser only.
- No authentication or checkout flow.
- No image optimization/CDN — picsum.photos placeholder images used.
- Not yet deployed to a hosting provider (out of scope for Phase 1).
