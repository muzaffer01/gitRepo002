# Runbook: SampleShop — Build, Test, Publish, Document

**Purpose:** This runbook captures the full requirements, goals, decisions, and step-by-step
procedure used to build the SampleShop project, so it can be recreated or repeated
end-to-end in **auto mode** (no clarifying questions, no permission prompts) on request,
without needing to re-derive scope from scratch.

**Last updated:** 2026-08-17

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

### 4.3 Configure Vitest and write tests

**Config:**
```js
// vite.config.js — add inside defineConfig({})
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  globals: true,
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

### 4.4 Verify (automated)

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
cd /Users/muzzy/gitRepo002
npm run test     # must show: Tests 19 passed (19)
npm run build    # must show: ✓ built in <time>ms, 0 errors
```

### 4.5 Browser verification (manual / automated)

Start the dev server in the background:
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm run dev &> /tmp/vite-dev.log &
# ready at http://localhost:5173
```

**Browser automation on macOS 13:**
Playwright cannot download Chromium on macOS 13 (`ERROR: Playwright does not support
chromium on mac13`). Use `puppeteer-core` with the installed system Chrome instead:

```bash
cd /tmp && npm install puppeteer-core
```

Write a CJS test script (`/tmp/test-sampleshop.cjs`) that uses:
```js
const puppeteer = require('/tmp/node_modules/puppeteer-core');
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```

**10 browser checks performed and passed:**

| # | Check | Expected |
|---|-------|----------|
| 1 | Product List renders | heading "Products", 10 cards, search box, category select |
| 2 | Search filter | "yoga" → 1 card |
| 3 | Category filter | "Electronics" → 3 cards |
| 4 | Product Details | name, price, Add to Cart + Buy Now buttons |
| 5 | Add to Cart → badge | header badge shows "1" |
| 6 | Cart with item | "Your Cart", 1 row, Checkout button |
| 7 | Remove → empty cart | "Your cart is empty." message |
| 8 | Out-of-stock product | "Out of stock" label, 0 action buttons |
| 9 | Unknown product id | "Product not found." with back link |
| 10 | Buy Now | URL ends with `/cart` after click |

Screenshots saved to `/tmp/sampleshop-screenshots/`.

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

### 4.8 Report back

Summarize: local path, GitHub URL, Drive folder, test results (19/19), build status,
browser checks (10/10), any open follow-ups (DEF-001: no stock enforcement on Cart page).

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
| Tests | 19 automated (4 files) + 10 browser checks |
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
17. **Updated RUNBOOK** with full session details (this edit); committed and pushed

---

## 7. Re-run Trigger

If the user says "recreate this," "do it again," "run the runbook," or asks for a similar
Amazon-style app in a new location — treat this document as the default procedure:
substitute new paths/URLs/names as given, skip questions already answered here (tech stack,
doc set, auto-mode expectations), and follow sections 3–4.8 in order.
