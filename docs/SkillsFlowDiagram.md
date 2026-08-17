# SampleShop — Skills Flow Diagram

> How the 5 project skills interact with each other, the app, and external systems.

---

## High-Level Skills Overview

```mermaid
flowchart TD
    USER([" User / Claude Code "])

    USER -->|"rebuild / run the runbook"| BUILD
    USER -->|"run tests / verify"| TESTS
    USER -->|"start the app / run it"| DEV
    USER -->|"push to github / deploy"| DEPLOY
    USER -->|"sync docs / update drive"| SYNCDOCS

    BUILD["🏗️ build-app\nFull end-to-end rebuild"]
    TESTS["🧪 run-tests\nVitest + Playwright"]
    DEV["🖥️ dev\nVite dev server"]
    DEPLOY["🚀 deploy\nBuild → Commit → Push"]
    SYNCDOCS["📄 sync-docs\nUpload all docs to Drive"]

    BUILD -->|"Phase 4 — verify"| TESTS
    BUILD -->|"Phase 5 — publish"| DEPLOY
    BUILD -->|"Phase 7 — upload"| SYNCDOCS
    DEPLOY -->|"Step 1 — gate"| TESTS
    TESTS -->|"e2e needs server"| DEV
```

---

## Detailed Skill Flow

```mermaid
flowchart LR
    subgraph USER_INPUT["User Input"]
        U([User / Claude Code])
    end

    subgraph SKILLS["Project Skills (.claude/skills/)"]
        direction TB
        BA["🏗️ build-app"]
        RT["🧪 run-tests"]
        DV["🖥️ dev"]
        DP["🚀 deploy"]
        SD["📄 sync-docs"]
    end

    subgraph APP["Application (/Users/muzzy/gitRepo002)"]
        direction TB
        subgraph SRC["Source"]
            DATA["src/data/products.js\n10 mock products"]
            CTX["src/context/CartContext.jsx\nlocalStorage sync"]
            COMP["components/\nHeader · ProductCard"]
            PAGES["pages/\nProductList · ProductDetails · Cart"]
            WIRE["App.jsx + main.jsx\nBrowserRouter + CartProvider"]
        end
        subgraph TESTS_RUN["Test Suites"]
            VT["Vitest + RTL\n19 unit tests\nHeader · ProductList\nProductDetails · Cart"]
            PW["Playwright\n23 e2e tests\nSystem Chrome (channel:'chrome')"]
        end
        subgraph BUILD_SYS["Build"]
            VITE["Vite Dev Server\nlocalhost:5173"]
            PROD["Production Build\ndist/"]
        end
    end

    subgraph EXTERNAL["External Systems"]
        GH["GitHub\nmuzaffer01/gitRepo002"]
        GHCLI["gh CLI\n~/bin/gh"]
        DRIVE["Google Drive\nSample002 Project\n(6 docs)"]
        BROWSER["Browser\nProduct List\nProduct Details\nCart"]
    end

    subgraph DOCS["Documentation (docs/)"]
        D1["RUNBOOK.md"]
        D2["PRD.md"]
        D3["TDD.md"]
        D4["TestPlan.md"]
        D5["TestCases.md"]
        D6["TestRunReport.md"]
    end

    %% User → Skills
    U -->|"rebuild"| BA
    U -->|"run tests"| RT
    U -->|"start the app"| DV
    U -->|"deploy"| DP
    U -->|"sync docs"| SD

    %% build-app phases
    BA -->|"Phase 1: prerequisites"| GHCLI
    BA -->|"Phase 2: scaffold"| VITE
    BA -->|"Phase 3: write 35+ files"| SRC
    BA -->|"Phase 4: verify"| RT
    BA -->|"Phase 5: publish"| DP
    BA -->|"Phase 6: write docs"| DOCS
    BA -->|"Phase 7: upload"| SD

    %% run-tests flow
    RT -->|"npm run test"| VT
    RT -->|"npm run test:e2e"| PW
    PW -->|"webServer: reuseExistingServer"| VITE

    %% dev flow
    DV -->|"check port 5173"| VITE
    VITE -->|"serves"| BROWSER

    %% deploy flow
    DP -->|"Step 1: gate on tests"| RT
    DP -->|"Step 2: npm run build"| PROD
    DP -->|"Step 3: git commit + push"| GH
    DP -->|"Step 4: verify"| GHCLI

    %% sync-docs flow
    SD -->|"reads"| DOCS
    SD -->|"search → trash → create"| DRIVE

    %% Source → tests
    SRC --> VT
    SRC --> PW
```

---

## Build-App Phase Breakdown

```mermaid
flowchart TD
    START([build-app triggered]) --> P1

    P1["Phase 1\nPrerequisites\nnode · npm · git · gh · claude"]
    P2["Phase 2\nScaffold\nnpm create vite@latest\nnpm install react-router-dom\nnpm install -D vitest playwright"]
    P3["Phase 3\nSource Files\n35+ files\ndata · context · components\npages · App · main · CSS"]
    P4["Phase 4\nVerify\nnpm run test → 19/19 ✓\nnpm run build → 0 errors ✓\nnpm run test:e2e → 23/23 ✓"]
    P5["Phase 5\nGit + GitHub\ngit init · commit\ngh auth login (device flow)\ngh repo create → git push"]
    P6["Phase 6\nDocumentation\nWrite 6 docs to docs/\ngit add docs · commit · push"]
    P7["Phase 7\nGoogle Drive\nsync-docs skill\ntrash old → create new\n6 docs uploaded"]
    P8["Phase 8\nSkills\nCreate/update 5 skills\ngit add .claude · push"]
    P9["Phase 9\nReport\nSummarize all results"]

    P1 --> P2 --> P3 --> P4
    P4 -->|"any failure → stop & report"| FAIL([Stop])
    P4 --> P5 --> P6 --> P7 --> P8 --> P9 --> DONE([Done])
```

---

## Data Flow: User Action → App State → Persistence

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant PL as ProductList
    participant PD as ProductDetails
    participant CC as CartContext
    participant LS as localStorage
    participant C as Cart page

    U->>PL: visit /
    PL->>PL: filter by search + category
    U->>PD: click product card → /products/:id
    PD->>PD: load product by id
    U->>PD: set qty, click Add to Cart
    PD->>CC: addToCart(product, qty)
    CC->>LS: persist cart (sample-shop-cart)
    CC-->>PD: itemCount updated → badge shows
    U->>C: click cart icon → /cart
    C->>CC: read items + subtotal
    U->>C: change qty or remove item
    C->>CC: updateQuantity / removeFromCart
    CC->>LS: persist updated cart
```

---

_Last updated: 2026-08-17_
