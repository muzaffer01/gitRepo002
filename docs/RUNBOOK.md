# Runbook: SampleShop — Build, Test, Publish, Document

**Purpose:** This runbook captures the full requirements, goals, decisions, and step-by-step
procedure used to build the SampleShop project, so it can be recreated or repeated
end-to-end in **auto mode** (no clarifying questions, no permission prompts) on request,
without needing to re-derive scope from scratch.

**Last updated:** 2026-08-17
**Platform:** macOS 13 (Ventura) — Mac terminal Claude Code agent

---

## 1. Original Requirements (verbatim intent)

Build a web application like Amazon, with three pages for now:
- List Page for product
- Details page for product
- Cart Page

**Goals:**
1. Build the web application
2. Test the web application
3. Store all code locally
4. Integrate with the user's Git account and push the code to GitHub
5. Create documents in Google Drive: Test Plan, Test Cases, Test Run Reports, Product
   Requirements Document, Technical Design Document
6. Also commit those same documents into the Git repo (`docs/` folder)
7. Maintain this runbook itself in both Google Drive and the Git repo, kept up to date

**Target locations (this instance — gitRepo002):**
- Local repo: `/Users/muzzy/gitRepo002`
- GitHub repo: `https://github.com/muzaffer01/gitRepo002`
- Google Drive folder: "Sample002 Project" (My Drive, folder ID `1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW`)

If re-running for a **new** project, substitute new paths/URLs/names and follow sections 3–4.7.

---

## 2. User Preferences / Operating Mode (apply automatically)

- **Auto mode by default once confirmed.** Once the user says "run in auto mode," stop
  asking clarifying/confirmation questions — just proceed and report status/results.
- **Permission dialogs are the harness's, not Claude's.** The "Do you want to proceed?"
  prompts come from Claude Code's CLI permission mode. Press **Shift+Tab** in the CLI to
  cycle into auto-accept mode. Explain this once if the user is confused; don't repeat it.
- **Stay scoped.** Only touch the specific local path and GitHub repo named.
- **Tech stack decided once, reusable as default:** React + Vite, react-router-dom,
  React Context + localStorage, Vitest + React Testing Library, mock local data (no backend).
- **Interactive GitHub logins cannot be fully automated.** The final "Authorize github"
  button on `https://github.com/login/device` rejects scripted clicks — hand it to the user.
- **Verify with browser, not just tests.** Run the dev server and drive the app with
  browser automation before calling it done.

---

## 3. Prerequisites / Environment Setup

Run this check first — only install what is missing:

```bash
node -v; npm -v; git --version; ~/bin/gh --version; claude --version
```

### 3.1 Connect an existing local directory to Git

If the local folder already has project files but no git history:

```bash
cd <local-repo-path>
git init
git remote add origin https://github.com/<user>/<repo>.git
git branch -m main                          # rename master → main
git fetch origin
git pull origin main --allow-unrelated-histories
git status
```

### 3.2 Node.js via nvm (macOS — Homebrew may fail on macOS 13)

Homebrew formula incompatibility (`openssl@3: unknown keyword: :overwrite`) blocks
`brew install node` on macOS 13. Use nvm instead:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Source nvm in the current shell (also added to ~/.zshrc automatically):
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"

nvm install --lts        # installs Node.js LTS (v24.19.0 as of 2026-08-17)
node -v && npm -v        # verify
```

Every subsequent shell command that needs node/npm must source nvm first:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
```

### 3.3 gh CLI via zip download (Homebrew unavailable on macOS 13)

```bash
curl -fsSL "https://github.com/cli/cli/releases/download/v2.97.0/gh_2.97.0_macOS_amd64.zip" \
     -o /tmp/gh.zip
unzip -o /tmp/gh.zip -d /tmp/gh_extract/
mkdir -p ~/bin
cp /tmp/gh_extract/gh_2.97.0_macOS_amd64/bin/gh ~/bin/gh
chmod +x ~/bin/gh
~/bin/gh --version       # verify: gh version 2.97.0
```

Check for a newer release at `https://github.com/cli/cli/releases/latest` and substitute
the version number if needed.

### 3.4 Claude Code

Installed globally via npm (bundled with node from nvm):

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm install -g @anthropic-ai/claude-code
claude --version         # should show current version (e.g. 2.1.234)
```

`brew upgrade claude-code` does **not** work on this machine — Claude Code is npm-managed,
not brew-managed.

### 3.5 Git identity

Set once per machine if not already configured:

```bash
git config user.name "muzaffer01"
git config user.email "mhabib01@gmail.com"
git config --global init.defaultBranch main
```

---

## 4. Procedure

### 4.1 Create the project directory and scaffold

```bash
mkdir -p /Users/muzzy/gitRepo002
cd /Users/muzzy/gitRepo002

export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm create vite@latest . -- --template react -y
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom \
               @testing-library/user-event jsdom
```

Clean up unused scaffold files:
```bash
rm -rf src/App.css src/assets
```

Update `index.html` — change `<title>` to `SampleShop`.

### 4.2 Build the app structure (35 files)

Create these directories first:
```bash
mkdir -p src/{data,context,components,pages,test}
mkdir -p docs
```

**Data & state:**
- `src/data/products.js` — array of 10 mock products (id, name, category, price, rating,
  reviewCount, image, description, stock) + `getProductById(id)` export
- `src/context/CartContext.jsx` — `CartProvider` with `addToCart(product, qty)`,
  `removeFromCart(id)`, `updateQuantity(id, qty)`, `clearCart()`, `itemCount` (memoized),
  `subtotal` (memoized); initializes from and syncs to `localStorage` key `sample-shop-cart`

**Components:**
- `src/components/Header.jsx` / `Header.css` — sticky `#131921` header; logo links to `/`;
  cart icon with live `itemCount` badge (hidden when 0)
- `src/components/ProductCard.jsx` / `ProductCard.css` — grid tile with image, name, star
  rating, review count, price; `out-of-stock` label when `stock === 0`; entire card is a
  `<Link>` to `/products/:id`

**Pages:**
- `src/pages/ProductList.jsx` / `ProductList.css` — live search (`useMemo` on `query`),
  category `<select>` filter, responsive CSS grid, empty-state message
- `src/pages/ProductDetails.jsx` / `ProductDetails.css` — reads `:id` via `useParams`;
  qty `<select>` capped at `Math.min(10, stock)`; "Add to Cart" shows 3 s confirmation;
  "Buy Now" calls `addToCart` then `navigate('/cart')`; out-of-stock hides both buttons;
  unknown id renders `.not-found` with back link
- `src/pages/Cart.jsx` / `Cart.css` — line items with `.cart-row` (image, name, unit
  price, qty select, remove btn, line total); order summary panel with subtotal and
  "Proceed to Checkout" (visual only, Phase 1); empty state with continue-shopping link

**Wiring:**
- `src/App.jsx` — `<Header />` above `<Routes>`; routes: `/` → `ProductList`,
  `/products/:id` → `ProductDetails`, `/cart` → `Cart`
- `src/main.jsx` — `<BrowserRouter><CartProvider><App /></CartProvider></BrowserRouter>`
- `src/index.css` — global reset (`box-sizing`, `margin: 0`, base font)

### 4.3 Configure Vitest and write unit/component tests

**Config:**
```js
// vite.config.js — add inside defineConfig({})
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  globals: true,
  include: ['src/**/*.test.{js,jsx}'],  // REQUIRED: prevents Vitest scanning e2e/ and features/
},
```

**package.json scripts — add:**
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Helper files:**
- `src/test/setup.js`:
  ```js
  import '@testing-library/jest-dom/vitest';
  beforeEach(() => { localStorage.clear(); });
  ```
- `src/test/testUtils.jsx` — `renderWithProviders(ui, { route='/', path='/' })` wraps
  `MemoryRouter` + `CartProvider` + `<Routes><Route path={path} element={ui}/></Routes>`

**Test files (19 tests total):**

| File | Count | Key cases |
|------|-------|-----------|
| `Header.test.jsx` | 3 | logo present, no badge when empty, badge = sum of quantities |
| `ProductList.test.jsx` | 5 | all 10 products, search filter, category filter, empty state, out-of-stock label |
| `ProductDetails.test.jsx` | 6 | render, not-found, out-of-stock (no buttons), add-to-cart confirmation, buy-now navigation, qty cap |
| `Cart.test.jsx` | 5 | empty state, render from seeded localStorage, qty update, remove item, subtotal |

**Known gotcha — Cart tests:** When a single-item cart has line total = subtotal, both
render the same dollar value. `getByText('$X.XX')` throws "multiple elements found." Use
`getAllByText('$X.XX').length >= 1` instead.

### 4.3b Add Playwright E2E tests

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium   # skip on macOS 13 — use channel:'chrome' instead
```

On **macOS 13**, Playwright cannot download browser binaries. Use `channel: 'chrome'` (system Chrome):

```js
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173', channel: 'chrome' },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
});
```

Write `e2e/sampleshop.spec.js` — 23 tests covering all pages and flows.

**package.json scripts — add:**
```json
"test:e2e": "playwright test",
"test:e2e:report": "playwright show-report"
```

### 4.3c Add Cucumber BDD tests

```bash
npm install -D @cucumber/cucumber
```

Create `cucumber.json` at the project root. **Important:** `package.json` has `"type": "module"`,
so use `"import"` (not `"require"`) in cucumber.json — Cucumber v9+ ESM requirement:

```json
{
  "default": {
    "paths": ["features/**/*.feature"],
    "import": [
      "features/support/**/*.js",
      "features/step_definitions/**/*.js"
    ],
    "format": ["progress-bar", "json:reports/cucumber-report.json"],
    "parallel": 1
  }
}
```

Create directory structure:
```bash
mkdir -p features/{support,step_definitions}
```

**`features/support/world.js`** — Custom World class (browser lifecycle):
```js
import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

class SampleShopWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = 'http://localhost:5173';
    this.browser = null; this.context = null; this.page = null;
  }
  async openBrowser() {
    this.browser = await chromium.launch({ channel: 'chrome', headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  async closeBrowser() {
    if (this.browser) { await this.browser.close(); this.browser = null; }
  }
  async go(path = '/') { await this.page.goto(`${this.baseUrl}${path}`); }
}
setWorldConstructor(SampleShopWorld);
```

**`features/support/hooks.js`** — Lifecycle hooks (auto-starts dev server, clears cart):
```js
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { spawn } from 'child_process';

setDefaultTimeout(30_000);
let devServer = null;

BeforeAll(async function () {
  let running = false;
  for (let i = 0; i < 15; i++) {
    try { await fetch('http://localhost:5173'); running = true; break; }
    catch {
      if (i === 0) devServer = spawn('npm', ['run', 'dev'], { cwd: process.cwd(), stdio: 'ignore' });
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  if (!running) throw new Error('Dev server did not start within 15 seconds');
});

AfterAll(async function () { if (devServer) { devServer.kill('SIGTERM'); devServer = null; } });

Before(async function () {
  await this.openBrowser();
  await this.go('/');
  await this.page.evaluate(() => localStorage.removeItem('sample-shop-cart'));
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED' && this.page) {
    try { const screenshot = await this.page.screenshot({ fullPage: true }); this.attach(screenshot, 'image/png'); } catch {}
  }
  await this.closeBrowser();
});
```

Write 4 feature files and their step definitions:
- `features/header.feature` (3 scenarios)
- `features/product_list.feature` (6 scenarios)
- `features/product_details.feature` (8 scenarios)
- `features/cart.feature` (6 scenarios)
- `features/step_definitions/common_steps.js`, `header_steps.js`, `product_list_steps.js`, `product_details_steps.js`, `cart_steps.js`

**package.json scripts — add:**
```json
"test:bdd": "cucumber-js",
"test:bdd:report": "cucumber-js --format json:reports/cucumber-report.json"
```

**Known gotcha — Vitest picking up e2e/features after installing Cucumber:**
After `npm install -D @cucumber/cucumber`, `npm run test` may fail because Vitest starts
scanning `e2e/` and `features/`. Fix: ensure `include: ['src/**/*.test.{js,jsx}']` is set
in `vite.config.js` test config (added in section 4.3 above).

### 4.4 Verify (automated)

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
cd /Users/muzzy/gitRepo002
npm run test         # must show: Tests 19 passed (19)
npm run build        # must show: ✓ built in <time>ms, 0 errors
npm run test:e2e     # must show: 23 passed
npm run test:bdd     # must show: 23 scenarios (23 passed)
```

### 4.5 Browser verification

The Playwright E2E suite (`npm run test:e2e`) and Cucumber BDD suite (`npm run test:bdd`)
both provide full browser-driven verification using system Chrome (`channel: 'chrome'`).
Running both is sufficient for browser verification.

If you need a quick manual check, start the dev server and open the app:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm run dev
# Open http://localhost:5173 in a browser
```

**macOS 13 note:** Playwright cannot download Chromium (`ERROR: Playwright does not support
chromium on mac13`). Both E2E and BDD suites work around this with `channel: 'chrome'`,
which uses the system-installed Google Chrome at
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

If you need a standalone one-off browser check (no Playwright), use `puppeteer-core`:
```bash
cd /tmp && npm install puppeteer-core
# Write a CJS script using executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

**10 core flows verified (covered by both Playwright and Cucumber):**

| # | Flow | Expected |
|---|------|----------|
| 1 | Product List renders | 10 cards, search box, category select |
| 2 | Search filter | "Wireless" → Headphones; Yoga Mat hidden |
| 3 | Category filter | "Electronics" → 3 cards |
| 4 | Product Details | name, price, Add to Cart + Buy Now buttons |
| 5 | Add to Cart → badge | header badge shows "1" |
| 6 | Cart with item | product listed, Checkout button |
| 7 | Remove → empty cart | "Your cart is empty." message |
| 8 | Out-of-stock product | "Out of stock" label, no action buttons |
| 9 | Unknown product id | "Product not found." with back link |
| 10 | Buy Now | URL becomes `/cart` after click |

### 4.6 Git init, commit, push

```bash
cd /Users/muzzy/gitRepo002
git init && git branch -m main
git config user.name "muzaffer01"
git config user.email "mhabib01@gmail.com"
git remote add origin https://github.com/muzaffer01/gitRepo002.git

git add src docs index.html package.json package-lock.json vite.config.js .gitignore README.md public
git commit -m "Initial commit: SampleShop with ProductList, ProductDetails, Cart pages"
```

**GitHub auth — device flow (human click required for final step):**
```bash
~/bin/gh auth login --hostname github.com --git-protocol https --web
```
1. Read the one-time code from the command output (format: `XXXX-XXXX`)
2. Go to `https://github.com/login/device` in a browser
3. Enter the code and click Continue
4. **User must personally click the final "Authorize github" button** — GitHub's
   bot-detection returns `access_denied` if that click is scripted
5. Poll `~/bin/gh auth status` until it shows `Logged in to github.com`

**Create the repo and push:**
```bash
~/bin/gh repo create muzaffer01/gitRepo002 --public \
  --description "SampleShop — Amazon-style e-commerce prototype (React + Vite)"
~/bin/gh auth setup-git
git push -u origin main
```

Verify:
```bash
~/bin/gh repo view muzaffer01/gitRepo002 --json name,url,pushedAt
```

### 4.7 Write and publish documentation

**Six documents — committed in `docs/` and uploaded to Google Drive:**

| Filename | Drive title |
|----------|-------------|
| `PRD.md` | SampleShop - Product Requirements Document |
| `TDD.md` | SampleShop - Technical Design Document |
| `TestPlan.md` | SampleShop - Test Plan |
| `TestCases.md` | SampleShop - Test Cases |
| `TestRunReport.md` | SampleShop - Test Run Report |
| `RUNBOOK.md` | SampleShop - Runbook |

**Google Drive procedure (via MCP tools in Claude Code):**
1. Create the project folder in My Drive:
   ```
   mcp__claude_ai_Google_Drive__create_file
     title: "Sample002 Project"
     contentMimeType: "application/vnd.google-apps.folder"
     parentId: "root"
   ```
   Save the returned `id` (this instance: `1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW`)

2. Before creating each doc, search for an existing one with the same title to avoid
   duplicates:
   ```
   mcp__claude_ai_Google_Drive__search_files
     query: "title = '<doc title>' and parentId = '<folder id>'"
   ```

3. Create (or recreate) each doc:
   ```
   mcp__claude_ai_Google_Drive__create_file
     title: "<doc title>"
     parentId: "<folder id>"
     contentMimeType: "text/plain"
     textContent: "<full markdown content>"
   ```
   Drive converts `text/plain` → `application/vnd.google-apps.document` automatically.

4. To update an existing doc: trash the old one first (`mcp__claude_ai_Google_Drive__trash_file`
   with its `fileId`), then create the new version.

### 4.8 Create project skills

Create 5 Claude Code skills in `.claude/skills/` to replace manual runbook execution:

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `run-tests` | "run tests", "verify" | Vitest 19 + Playwright 23 + Cucumber 23 |
| `dev` | "start the app", "run it" | Start Vite dev server, open browser |
| `deploy` | "push to github", "deploy" | Test → build → commit → push |
| `sync-docs` | "update google drive", "sync docs" | Upload all 6 docs to Drive |
| `build-app` | "rebuild", "run the runbook" | Full end-to-end project rebuild |

Each skill lives at `.claude/skills/<name>/SKILL.md`. Commit and push them:
```bash
git add .claude && git commit -m "Add project skills" && git push
```

### 4.9 Report back

Summarize: local path, GitHub URL, Drive folder, test results (19/19 unit + 23/23 e2e),
build status, skills created (5), any open follow-ups.

---

## 5. Quick Reference — this instance's values

| Item | Value |
|---|---|
| App name | SampleShop |
| Local path | `/Users/muzzy/gitRepo002` |
| GitHub repo | https://github.com/muzaffer01/gitRepo002 |
| GitHub account | muzaffer01 |
| Drive folder | "Sample002 Project" — ID `1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW` |
| Dev server | `npm run dev` → http://localhost:5173/ |
| Tech stack | React 19 + Vite 8, react-router-dom v7, Context + localStorage, Vitest 4 + RTL |
| Pages | `/` (Product List), `/products/:id` (Product Details), `/cart` (Cart) |
| Tests | 19 unit (Vitest) + 23 e2e (Playwright) + 23 BDD (Cucumber) — all system Chrome |
| Skills | 5 — run-tests, dev, deploy, sync-docs, build-app |
| Node | v24.19.0 via nvm |
| gh CLI | v2.97.0 at `~/bin/gh` |

---

## 6. Session Actions Summary (2026-08-17)

A complete log of what was done in the session that produced this instance:

1. **Git-connected** `/Users/muzzy/Artificial_Intelligence_Project_mac` to gitRepo001 and pulled history
2. **Read the gitRepo001 runbook** to understand the full build procedure
3. **Installed Node.js** via nvm (Homebrew blocked on macOS 13)
4. **Installed gh CLI** via zip download to `~/bin/gh`
5. **Confirmed Claude Code** was already installed (v2.1.234); `brew upgrade claude-code` not applicable
6. **Created** `/Users/muzzy/gitRepo002` and scaffolded with Vite React template
7. **Installed** all npm dependencies (react-router-dom, vitest, RTL, jsdom)
8. **Wrote** 35 source files: data, context, 2 components, 3 pages, App, main, index.css, 4 test files, test helpers
9. **Fixed** Cart test: `getByText` → `getAllByText` for dollar amounts that appear in both line total and subtotal
10. **Ran tests**: 19/19 passed; production build: 0 errors
11. **Git init + commit**: 35 files in initial commit
12. **GitHub auth**: device flow; user clicked final Authorize; repo created; code pushed
13. **Wrote 6 docs** in `docs/`: PRD, TDD, TestPlan, TestCases, TestRunReport, RUNBOOK
14. **Created** "Sample002 Project" folder in Google Drive (My Drive)
15. **Uploaded** all 6 docs to Drive via MCP Google Drive tools
16. **Started dev server** (`npm run dev`) and ran 10 browser checks via puppeteer-core + system Chrome
17. **Updated RUNBOOK** with full session details; committed and pushed
18. **Added Playwright** e2e tests (`e2e/sampleshop.spec.js`, 23 tests); committed and pushed
19. **Created 5 project skills**: `run-tests`, `dev`, `deploy`, `sync-docs`, `build-app` in `.claude/skills/`
20. **Built SkillsFlowDiagram**: `docs/SkillsFlowDiagram.md` — 4 Mermaid diagrams showing skill interactions, data flow, and build phases
21. **Added Playwright e2e suite** — `playwright.config.js` + `e2e/sampleshop.spec.js` (23 tests); `channel: 'chrome'` for macOS 13; `webServer` auto-starts dev server
22. **Added Cucumber BDD suite** — `cucumber.json`, `features/support/world.js` + `hooks.js`, 4 feature files, 5 step definition files (23 scenarios); ESM `import` key in cucumber.json; `vite.config.js` `include` fix to prevent Vitest scanning e2e/features
23. **Added platform note** everywhere — `**Agent:** Mac terminal Claude Code agent (macOS 13 Ventura)` added to all 6 docs and Drive docs; committed as `d5a7b61`
24. **Updated Drive** — trashed old docs; recreated all 5 (PRD, TestCases, TestRunReport, TDD, TestPlan) with updated content; Runbook and SkillsFlowDiagram already current
25. **Updated RUNBOOK** with full BDD setup, Playwright E2E, browser verification section, and this summary

---

## 7. Re-run Trigger

If the user says "recreate this," "do it again," "run the runbook," or asks for a similar
Amazon-style app in a new location — treat this document as the default procedure:
substitute new paths/URLs/names as given, skip questions already answered here (tech stack,
doc set, auto-mode expectations), and follow sections 3–4.8 in order.
