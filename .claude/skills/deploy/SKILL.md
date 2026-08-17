---
name: deploy
description: Build, commit, and push the SampleShop project to GitHub. Use this skill whenever the user wants to push code, deploy changes, commit and push, update GitHub, or publish the latest code. Trigger on phrases like "push to github", "deploy", "commit and push", "update the repo", "push the changes", "publish".
---

# Deploy — SampleShop

Build the production bundle, commit any staged changes, and push to GitHub.

## Environment

Mac terminal. Always source nvm first:

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh"
```

Project directory: `/Users/muzzy/gitRepo002`
GitHub repo: `https://github.com/muzaffer01/gitRepo002`
gh CLI: `~/bin/gh`

## Steps

### 1. Run tests first

Before deploying, verify nothing is broken:

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002 && npm run test 2>&1
```

If any tests fail, stop and report the failures — do not push broken code.

### 2. Production build

```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd /Users/muzzy/gitRepo002 && npm run build 2>&1
```

Must complete with 0 errors. If it fails, stop and report.

### 3. Check git status

```bash
cd /Users/muzzy/gitRepo002 && git status && git diff --stat
```

Identify changed files. Never stage `.env` files or secrets.

### 4. Stage and commit

Stage only source and docs files — not `dist/`, `node_modules/`, screenshots:

```bash
cd /Users/muzzy/gitRepo002 && git add src docs e2e playwright.config.js package.json package-lock.json vite.config.js index.html public
git status
```

Write a concise commit message describing what changed:

```bash
git commit -m "$(cat <<'EOF'
<summary of changes>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### 5. Push

```bash
cd /Users/muzzy/gitRepo002 && git push 2>&1
```

### 6. Verify

```bash
~/bin/gh repo view muzaffer01/gitRepo002 --json name,url,pushedAt
```

### 7. Report

Tell the user:
- Tests: passed/failed
- Build: success/failure
- Commit hash and message
- Push status
- GitHub URL

## GitHub auth

If `git push` fails with auth errors:
```bash
~/bin/gh auth status
~/bin/gh auth login --hostname github.com --git-protocol https --web
~/bin/gh auth setup-git
```
The final "Authorize github" browser button must be clicked by the user — it cannot be automated.
