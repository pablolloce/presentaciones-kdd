---
name: x-bookmarks-sync
description: Extract recent X (Twitter) bookmarks via Playwright MCP, triage by relevance to NFQ, and write synthesis notes to the Obsidian vault. Use when user wants to process accumulated X bookmarks or mentions "revisar bookmarks de X", "review X bookmarks", or "sync bookmarks". Default window is 7 days but accepts arguments like "10d" or "2w".
---

# X Bookmarks → Vault Sync

Replaces the manual Playwright bookmarks review workflow (executed Apr 9, Apr 17 2026) with a repeatable skill.

**Do not use** `mcp__computer-use__*` for this — X.com browsers are tier-"read" and clicks are blocked. Playwright MCP is the right tool (per `memory/feedback_playwright_bookmarks.md`).

## Input

- Optional window argument: `7d`, `10d`, `2w`, `30d`. Default: `10d`.
- Default user: `gregorio.gonzalo@nfq.es` (already logged into Chrome via Playwright MCP).

## Process

### Step 1 — Navigate and verify login

```
mcp__plugin_playwright_playwright__browser_navigate → https://x.com/i/bookmarks
mcp__plugin_playwright_playwright__browser_evaluate → check loggedIn + current URL
```

If not logged in → stop and ask user to run login manually (MFA usually required).

### Step 2 — Scroll + collect bookmarks

Evaluate a scroll+collect loop. Dedupe by URL. Stop when oldest bookmark is older than the window cutoff or after 3 consecutive stalls.

Collect for each bookmark:
- `url`, `dt` (ISO), `author`, `handle`, `text` (first 400 chars)

Save the raw JSON to `/tmp/x-bookmarks-{date}.json` for later inspection.

### Step 3 — Cross-reference with vault

Before opening threads, grep `04 - Resources/Articles/` for existing notes matching each bookmark URL. Mark as `already-captured` to skip.

### Step 4 — Triage by priority

For each new bookmark:

**Tier 1 (open thread + write note):**
- Substantial text (>200 chars)
- Author signals high domain relevance (Anthropic, OpenAI, Sequoia, Foundation Capital, McKinsey, Chamath, Garry Tan, Karpathy, etc.)
- Topic maps to NFQ focus: agents, memory, harness, ALM, IRRBB, regulatory, banking, services-thesis, governance, decision-traces
- Use Tier 1 mapping from `_Article-Project Connections.md`

**Tier 2 (note from bookmark text only, no thread open):**
- Product announcements, landscape references, supporting evidence for existing thesis

**Tier 3 (skip):**
- `text: null` (media-only)
- Reactions ("cool idea", "exactly", <20 chars)
- Crypto, politics, hype without thesis
- Already-covered content

### Step 5 — Open Tier 1 threads (Playwright)

For each Tier 1 bookmark, navigate to the tweet URL and extract:
- Main tweet + author thread (reply chain from same author)
- Top 3-5 reply comments (signal from community)
- Quoted tweets if referenced

### Step 6 — Write notes to vault

**Path:** `04 - Resources/Articles/`
**Naming:** `YYYY-MM-DD - {handle} - {short topic}.md`
**Frontmatter template:**
```yaml
---
source: {url}
author: {name} ({context if known})
date: YYYY-MM-DD
tags: [{topics}]
priority: 🔴 (Tier 1) | 🟡 (Tier 2)
---
```

**Body structure:**
- H1 title
- H2 `## {Core thesis / What they shipped}` — distilled claim
- H2 `## Evidence / Thread signals` — key quotes from thread and replies
- H2 `## Aplicación a NFQ` — mandatory. Connect to NFQ projects/MOCs using Tier 1 mapping.
- H2 `## Relevancia para NFQ` with `Connection type:` and `Why:` (per `_Article-Project Connections.md` format)
- H2 `## Related` — wikilinks to existing vault notes (check before writing)

### Step 7 — Update existing notes if applicable

If bookmark extends/contradicts an existing note, prefer an `## Updates` section over a new note. Use format:
```markdown
<!-- Manual update: YYYY-MM-DD — X bookmarks review -->
- **YYYY-MM-DD — {short title}** ({url}): {synthesis}
```

### Step 8 — Write session note + update log

**Session note:** `02 - Projects/Nfq/Claude-Sessions/YYYY-MM-DD — X Bookmarks Review {window}.md`

Structure:
- Summary (N extracted, M new notes, K updates, L skipped)
- Links to all new/updated notes
- Dominant themes (3-5 bullets)
- Synthesis of Relevancia para NFQ

**Append to `log.md`** with session entry.

### Step 9 — Update memory reference

Write `~/.claude/projects/-Users-gregoriogonzalo-Developer/memory/bookmarks-{date}.md` with:
- Method + window
- Stats comparison to previous batches
- Files written
- Any ops findings

Add entry to `MEMORY.md` References section.

## Output (return to user)

Concise summary:
- N bookmarks extracted
- M new notes written (with bulleted links)
- K existing notes updated
- Dominant themes
- Any TARS/ops findings to flag

## Failure modes

- **Not logged in:** stop, ask user to login manually.
- **Playwright MCP unavailable:** load via `ToolSearch("select:mcp__plugin_playwright_playwright__browser_navigate,browser_evaluate,browser_close")`.
- **X rate limiting (too many thread opens):** cap Tier 1 at 10 per run; if more, save to TODO list for next run.
- **X UI changes break selectors:** `article[data-testid="tweet"]`, `[data-testid="tweetText"]`, `[data-testid="User-Name"]`, `time[datetime]` — these are the canonical selectors as of 2026-04-17.

## Related

- `memory/feedback_playwright_bookmarks.md` — why Playwright, not computer-use
- `04 - Resources/Articles/_Article-Project Connections.md` — Tier 1 mapping
- `bookmarks-2026-04-09.md`, `bookmarks-2026-04-17.md` — previous runs for reference
