---
name: run-tests
description: Run all tests for the SampleShop project — both the Vitest unit/component tests and the Playwright e2e browser tests. Use this skill whenever the user asks to run tests, check test results, verify the app works, or wants to know if anything is broken. Trigger on phrases like "run tests", "test it", "check tests", "are tests passing", "verify", "test the app".
---

# Run Tests — SampleShop

Run both test suites in order and report a combined summary.

## Environment

This project runs on a Mac terminal. Node.js is managed via nvm. Always source nvm before running any node/npm command:

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
```

Project directory: `/Users/muzzy/gitRepo002`

## Step 1 — Vitest (unit/component tests)

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002 && npm run test 2>&1
```

Expected: `Tests 19 passed (19)` across 4 files (Header, ProductList, ProductDetails, Cart).

## Step 2 — Playwright (e2e browser tests)

The dev server must be running. Playwright's `webServer` config starts it automatically if not already running.

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002 && npm run test:e2e 2>&1
```

Expected: `23 passed` across Product List, Product Details, Cart, Header suites.

Browser: system Google Chrome via `channel: 'chrome'` (Playwright cannot download browsers on macOS 13).

## Step 3 — Report

Report results clearly:
- Vitest: X/19 passed
- Playwright: X/23 passed
- Any failures: show the failing test name and error message
- If all pass: state "All 42 tests passing (19 unit + 23 e2e)"

## Known issues

- Playwright uses system Chrome — if Chrome is not installed at `/Applications/Google Chrome.app`, e2e tests will fail
- If the dev server is already running on port 5173, Playwright reuses it (`reuseExistingServer: true`)
- Cart tests: `getAllByText` used instead of `getByText` for dollar amounts that appear in both line total and subtotal
