---
name: dev
description: Start the SampleShop development server and open the app in the browser. Use this skill whenever the user wants to run the app, start the dev server, preview the app, see the app in the browser, or test it manually. Trigger on phrases like "start the app", "run the dev server", "open the app", "show me the app", "launch it", "run it".
---

# Dev Server — SampleShop

Start the Vite dev server and open the app in Chrome.

## Environment

Mac terminal. Always source nvm first:

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
```

Project directory: `/Users/muzzy/gitRepo002`
Dev server URL: `http://localhost:5173`

## Steps

### 1. Check if already running

```bash
lsof -ti:5173
```

If a process is already on port 5173, the server is running — skip to step 3.

### 2. Start the dev server in the background

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002 && npm run dev &> /tmp/vite-dev.log &
sleep 2 && cat /tmp/vite-dev.log
```

Confirm output shows `VITE v8.x ready` and `Local: http://localhost:5173/`.

### 3. Open in browser

```bash
open http://localhost:5173
```

### 4. Report

Tell the user:
- Dev server is running at http://localhost:5173
- To stop it: `kill $(lsof -ti:5173)`
- To view logs: `cat /tmp/vite-dev.log`
