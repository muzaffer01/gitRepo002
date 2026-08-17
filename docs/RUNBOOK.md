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
6. (Added later) Also commit those same documents into the Git repo (`docs/` folder)
7. (Added later) Maintain this runbook itself in both Google Drive and the Git repo,
   kept up to date, for future auto-mode recreation

**Target locations (this instance — gitRepo002):**
- Local repo: `/Users/muzzy/gitRepo002`
- GitHub repo: `https://github.com/muzaffer01/gitRepo002`
- Google Drive folder: TBD (same account as gitRepo001)

If re-running this for a **new** project, ask the user (or reuse prior answers) for
equivalent values, then substitute throughout.

## 2. User Preferences / Operating Mode (apply automatically)

- **Auto mode by default once confirmed once.** The user explicitly said: "run in auto
  mode." Once a user gives this kind of standing instruction in a session, stop asking
  clarifying/confirmation questions for the remainder of that build — just proceed and
  report status/results.
- **Permission dialogs are the harness's, not mine.** Claude Code's built-in tool-approval
  prompts ("Do you want to proceed? 1. Yes 2. No") come from the CLI's permission mode,
  not from Claude asking questions. Press Shift+Tab in the Claude Code CLI to cycle into
  auto-accept mode. Don't over-explain it repeatedly.
- **Stay scoped.** Only touch the specific local path and GitHub repo named. Don't wander
  into other folders/files even in "auto mode."
- **Tech stack decided once, reusable as default:** React + Vite, react-router-dom for
  routing, React Context + localStorage for cart-like state, Vitest + React Testing
  Library for tests, mock local JSON/JS data (no backend).
- **Interactive logins cannot be automated end-to-end.** GitHub OAuth device-flow
  authorization pages actively reject automated/scripted clicks — get the device code,
  open the page, fill the code, then hand the final "Authorize" click back to the user.
- **Verify manually, not just automated tests.** For UI work, actually run the dev server
  and click through the app before calling it done.

## 3. Prerequisites / Environment Setup

Check first; only install what's missing (idempotent):

```bash
node -v; npm -v; git --version; gh --version
```

If Node.js is missing on macOS, use nvm (Homebrew may have formula compatibility issues):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
nvm install --lts
```

For gh CLI (if brew fails on macOS 13):
```bash
# Download zip from GitHub releases, extract, copy to ~/bin/gh
curl -fsSL "https://github.com/cli/cli/releases/download/v2.97.0/gh_2.97.0_macOS_amd64.zip" -o /tmp/gh.zip
unzip -o /tmp/gh.zip -d /tmp/gh_extract/
mkdir -p ~/bin && cp /tmp/gh_extract/gh_2.97.0_macOS_amd64/bin/gh ~/bin/gh && chmod +x ~/bin/gh
```

Also set git identity once if unset:

```bash
git config user.name "muzaffer01"
git config user.email "mhabib01@gmail.com"
git config --global init.defaultBranch main
```

## 4. Procedure

### 4.1 Scaffold the app
```bash
cd <local-repo-path>
npm create vite@latest . -- --template react -y
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
Remove unused Vite scaffold defaults (`src/App.css`, `src/assets/`), update
`index.html` `<title>` to "SampleShop".

### 4.2 Build the app structure
- `src/data/products.js` — 10 mock products + `getProductById()` helper
- `src/context/CartContext.jsx` — Context provider with `addToCart`, `removeFromCart`,
  `updateQuantity`, `clearCart`, `itemCount`, `subtotal`; backed by localStorage
- `src/components/Header.jsx` / `.css` — sticky header with logo + cart badge
- `src/components/ProductCard.jsx` / `.css` — grid tile with star rating
- `src/pages/ProductList.jsx` / `.css` — search + category filter + responsive grid
- `src/pages/ProductDetails.jsx` / `.css` — qty selector, Add to Cart, Buy Now, not-found
- `src/pages/Cart.jsx` / `.css` — line items, qty update, remove, subtotal, empty state
- `src/App.jsx` — routes; Header outside `<Routes>`
- `src/main.jsx` — wraps App in BrowserRouter + CartProvider

### 4.3 Configure and write tests
- `vite.config.js`: add `test` block — `environment: 'jsdom'`,
  `setupFiles: ['./src/test/setup.js']`, `globals: true`
- `src/test/setup.js`: import jest-dom; `localStorage.clear()` in `beforeEach`
- `src/test/testUtils.jsx`: `renderWithProviders(ui, { route, path })` helper
- `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`
- 4 test files: `Header.test.jsx`, `ProductList.test.jsx`, `ProductDetails.test.jsx`,
  `Cart.test.jsx` — 19 tests total

### 4.4 Verify
```bash
npm run test     # 19 tests must pass
npm run build    # production build must complete with 0 errors
```

### 4.5 Git init, commit, push
```bash
git init && git branch -m main
git config user.name "muzaffer01"
git config user.email "mhabib01@gmail.com"
git remote add origin https://github.com/muzaffer01/gitRepo002.git
git add src docs index.html package.json package-lock.json vite.config.js .gitignore README.md public
git commit -m "Initial commit: SampleShop with ProductList, ProductDetails, Cart pages"
```

**GitHub auth (human click required for final authorize step):**
```bash
~/bin/gh auth login --hostname github.com --git-protocol https --web
```
Get the one-time code from output. Navigate to https://github.com/login/device,
enter the code, click Continue — then ask the user to personally click the final
"Authorize github" button. Poll `gh auth status` until authenticated, then:
```bash
~/bin/gh auth setup-git
git push -u origin main
```

### 4.6 Write and publish documentation

Five documents in `docs/`: PRD.md, TDD.md, TestPlan.md, TestCases.md,
TestRunReport.md, RUNBOOK.md — committed alongside the source code.

Optionally also create in Google Drive (same Drive folder as the gitRepo001 project
or a new folder). Use `mcp__claude_ai_Google_Drive__create_file` with
`contentMimeType: 'text/plain'` and appropriate `parentId`.

### 4.7 Report back
Summarize what was built, where it lives, test results, any open follow-ups.

## 5. Quick Reference — this instance's values

| Item | Value |
|---|---|
| App name | SampleShop |
| Local path | `/Users/muzzy/gitRepo002` |
| GitHub repo | https://github.com/muzaffer01/gitRepo002 |
| GitHub account | muzaffer01 |
| Dev server | `npm run dev` → http://localhost:5173/ |
| Tech stack | React 19 + Vite, react-router-dom v7, Context + localStorage, Vitest + RTL |
| Pages | `/` (Product List), `/products/:id` (Product Details), `/cart` (Cart) |
| Tests | 19 automated tests, 4 test files |

## 6. Re-run Trigger

If the user says "recreate this," "do it again," or asks for a similar Amazon-style
app, treat this document as the default procedure: substitute new paths/URLs/names
as given, skip questions already answered here, and follow sections 3–4.7 in order.
