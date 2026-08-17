---
name: build-app
description: Full end-to-end rebuild of the SampleShop app from scratch following the RUNBOOK — scaffold, build all source files, run tests, push to GitHub, write docs, and sync to Google Drive. Use this skill when the user wants to recreate the project, start fresh, run the runbook, or rebuild the app end-to-end. Trigger on phrases like "rebuild", "recreate", "run the runbook", "start over", "build from scratch", "do it again".
---

# Build App — SampleShop (Full End-to-End)

Follow the RUNBOOK at `/Users/muzzy/gitRepo002/docs/RUNBOOK.md` to build the complete
SampleShop project from scratch. This skill encodes the full procedure.

## Environment (Mac terminal)

- Node.js via nvm: `export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"`
- gh CLI: `~/bin/gh`
- Project: `/Users/muzzy/gitRepo002`
- GitHub: `https://github.com/muzaffer01/gitRepo002`
- Drive folder: "Sample002 Project" (ID: `1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW`)

Before starting, read `docs/RUNBOOK.md` for the full authoritative procedure.

## Phase 1 — Prerequisites

Check what's installed:
```bash
node -v; npm -v; git --version; ~/bin/gh --version; claude --version
```

If Node.js is missing, install via nvm (Homebrew fails on macOS 13):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
nvm install --lts
```

If gh CLI is missing, install via zip:
```bash
curl -fsSL "https://github.com/cli/cli/releases/download/v2.97.0/gh_2.97.0_macOS_amd64.zip" -o /tmp/gh.zip
unzip -o /tmp/gh.zip -d /tmp/gh_extract/
mkdir -p ~/bin && cp /tmp/gh_extract/gh_2.97.0_macOS_amd64/bin/gh ~/bin/gh && chmod +x ~/bin/gh
```

## Phase 2 — Scaffold

```bash
mkdir -p /Users/muzzy/gitRepo002 && cd /Users/muzzy/gitRepo002
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
npm create vite@latest . -- --template react -y
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
rm -rf src/App.css src/assets
mkdir -p src/{data,context,components,pages,test} docs e2e .claude/skills
```

Update `index.html` title to "SampleShop".

## Phase 3 — Build source files

Create all source files per the RUNBOOK section 4.2:
- `src/data/products.js` — 10 mock products + `getProductById()`
- `src/context/CartContext.jsx` — cart state with localStorage sync
- `src/components/Header.jsx/.css`
- `src/components/ProductCard.jsx/.css`
- `src/pages/ProductList.jsx/.css`
- `src/pages/ProductDetails.jsx/.css`
- `src/pages/Cart.jsx/.css`
- `src/App.jsx` — routes, Header outside Routes
- `src/main.jsx` — BrowserRouter + CartProvider + App
- `src/index.css` — global reset

## Phase 4 — Tests

Configure Vitest in `vite.config.js` (jsdom environment, globals, setupFiles).
Add `"test": "vitest run"`, `"test:e2e": "playwright test"` to `package.json` scripts.

Create:
- `src/test/setup.js` — jest-dom + localStorage.clear()
- `src/test/testUtils.jsx` — renderWithProviders helper
- `src/test/Header.test.jsx` — 3 tests
- `src/test/ProductList.test.jsx` — 5 tests
- `src/test/ProductDetails.test.jsx` — 6 tests
- `src/test/Cart.test.jsx` — 5 tests (use `getAllByText` not `getByText` for dollar amounts)
- `playwright.config.js` — channel:'chrome', webServer, e2e testDir
- `e2e/sampleshop.spec.js` — 23 tests across all pages

## Phase 5 — Verify

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002
npm run test        # 19/19 must pass
npm run build       # 0 errors
npm run test:e2e    # 23/23 must pass
```

## Phase 6 — Git + GitHub

```bash
cd /Users/muzzy/gitRepo002
git init && git branch -m main
git config user.name "muzaffer01" && git config user.email "mhabib01@gmail.com"
git remote add origin https://github.com/muzaffer01/gitRepo002.git
git add src docs e2e .claude playwright.config.js package.json package-lock.json vite.config.js index.html public .gitignore README.md
git commit -m "Initial commit: SampleShop with ProductList, ProductDetails, Cart pages"
```

GitHub auth (device flow — user must click final Authorize button):
```bash
~/bin/gh auth login --hostname github.com --git-protocol https --web
# Read one-time code → go to https://github.com/login/device → user clicks Authorize
~/bin/gh repo create muzaffer01/gitRepo002 --public
~/bin/gh auth setup-git && git push -u origin main
```

## Phase 7 — Documentation

Write all 6 docs in `docs/`: PRD.md, TDD.md, TestPlan.md, TestCases.md, TestRunReport.md, RUNBOOK.md.
Commit and push: `git add docs && git commit -m "Add project documentation" && git push`

Then invoke the `/sync-docs` skill to upload all docs to Google Drive.

## Phase 8 — Skills

Create/update all 5 project skills in `.claude/skills/`:
`run-tests`, `dev`, `deploy`, `sync-docs`, `build-app`

Commit: `git add .claude && git commit -m "Add project skills" && git push`

## Phase 9 — Report

Summarize:
- Local path, GitHub URL, Drive folder
- Test results: 19 unit + 23 e2e
- Build status
- Docs: 6 files in repo + Drive
- Skills: 5 created
