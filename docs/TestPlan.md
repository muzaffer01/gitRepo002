# Test Plan
## SampleShop — Phase 1

**Author:** Muzaffer
**Date:** 2026-08-17
**Version:** 1.1
**Agent:** Mac terminal Claude Code agent (macOS 13 Ventura)

---

## 1. Objective

Verify that all Phase 1 features of SampleShop work correctly: product browsing, search,
filtering, product details, cart management, localStorage persistence, and navigation.

## 2. Scope

### In scope
- Product List page: render, search, category filter, empty state
- Product Details page: render, quantity selector, Add to Cart, Buy Now, out-of-stock, not-found
- Cart page: render, line totals, subtotal, quantity update, item removal, empty state
- Header: logo, cart badge item count
- localStorage persistence across component remounts (simulated via seeding in tests)

### Out of scope
- Checkout / payment flow (not implemented in Phase 1)
- User authentication
- Backend/API integration
- Cross-browser visual regression
- Performance/load testing

## 3. Test Levels & Approach

| Level | Tool | Approach |
|-------|------|----------|
| Unit / Component (TDD) | Vitest + React Testing Library | Render pages in MemoryRouter with real CartProvider; interact via user-event |
| End-to-End (E2E) | Playwright | Drive the real app in system Chrome; verify full user flows in a real browser |
| Behaviour-Driven (BDD) | Cucumber.js + Playwright | Gherkin feature files describe user behaviour in plain English; step definitions drive the browser |
| Manual smoke test | Dev server + browser | Click through all pages and core flows |

## 4. Environment

- Node 24 LTS, npm 11 (via nvm)
- macOS 13 (Ventura)
- Local dev server: `npm run dev` → http://localhost:5173/
- Unit tests: `npm run test` (Vitest run mode, jsdom environment)
- E2E tests: `npm run test:e2e` (Playwright, system Chrome via `channel: 'chrome'`)
- BDD tests: `npm run test:bdd` (Cucumber.js, Playwright with system Chrome)

## 5. Entry / Exit Criteria

**Entry:** All source files written, dependencies installed, `npm run build` succeeds.

**Exit:**
- 19/19 Vitest unit/component tests pass
- 23/23 Playwright e2e tests pass
- 23/23 Cucumber BDD scenarios pass
- Production build completes with 0 errors
- Manual smoke test covers all 3 pages without blocking defects

## 6. Deliverables

- Test Cases document (`TestCases.md`)
- Test Run Report (`TestRunReport.md`)

## 7. Risks

| Risk | Mitigation |
|------|-----------|
| localStorage not cleared between tests | `localStorage.clear()` in `setup.js` beforeEach |
| Navigation side-effects in tests | Use `MemoryRouter` with routes to isolate each test |
| Image src warnings (empty string in tests) | Cosmetic only; does not affect test correctness |

## 8. Schedule

Built and tested in a single session on 2026-08-17.
