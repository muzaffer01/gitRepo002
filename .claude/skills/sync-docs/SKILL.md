---
name: sync-docs
description: Sync all SampleShop project documentation to Google Drive "Sample002 Project" folder. Use this skill whenever the user wants to update Google Drive docs, sync documentation, update Drive, or keep docs in sync. Trigger on phrases like "update google drive", "sync docs", "update docs", "push docs to drive", "update documentation", "sync to drive".
---

# Sync Docs — SampleShop

Upload all 6 project docs from `docs/` to the Google Drive "Sample002 Project" folder.

## Document map

| Local file | Drive title |
|------------|-------------|
| `docs/PRD.md` | SampleShop - Product Requirements Document |
| `docs/TDD.md` | SampleShop - Technical Design Document |
| `docs/TestPlan.md` | SampleShop - Test Plan |
| `docs/TestCases.md` | SampleShop - Test Cases |
| `docs/TestRunReport.md` | SampleShop - Test Run Report |
| `docs/RUNBOOK.md` | SampleShop - Runbook |

## Google Drive details

- Folder name: "Sample002 Project"
- Folder ID: `1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW`
- Owner: muzzyapp.ai@gmail.com

## Steps for each document

Repeat for all 6 docs:

### 1. Read local file

Read the current content from `/Users/muzzy/gitRepo002/docs/<filename>.md`.

### 2. Search for existing Drive doc

```
mcp__claude_ai_Google_Drive__search_files
  query: "title = '<Drive title>' and parentId = '1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW'"
```

### 3a. If existing doc found — trash it

```
mcp__claude_ai_Google_Drive__trash_file
  fileId: "<existing doc id>"
```

### 3b. Create new doc

```
mcp__claude_ai_Google_Drive__create_file
  title: "<Drive title>"
  parentId: "1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW"
  contentMimeType: "text/plain"
  textContent: "<full file content>"
```

Drive automatically converts `text/plain` to a native Google Doc.

## Report

After all 6 docs are synced, report:
- Each doc: Created / Updated
- Drive folder link: https://drive.google.com/drive/folders/1dh3iX2vEokgGMvRniTgCe78iWBVm2dtW

## Notes

- Always read the local file fresh before uploading — never use cached content
- Do all 6 docs even if only one changed — keeps Drive fully in sync
- If the MCP Google Drive tool is unavailable, tell the user and skip Drive sync
