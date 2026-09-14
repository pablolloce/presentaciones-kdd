---
name: session-bootstrap
description: Load project + client context at session start. Reads CLAUDE.md, vault, Granola meetings, and last session notes to build a structured briefing. Use at the beginning of any work session, especially when switching between projects.
---

# Session Bootstrap

Quick context loading for the start of any work session. Gathers project state, client context, and recent activity in parallel.

## Process

### Step 1 — Identify Context

Determine from the current working directory or user input:
- **Project:** Which repo are we in? (read its CLAUDE.md if it exists)
- **Client:** Which bank/client does this project serve? (check memory files)

### Step 2 — Parallel Context Gathering

Launch these in parallel using available tools:

1. **Project state:**
   - Read the project's CLAUDE.md (if exists)
   - Run `git log --oneline -5` for recent commits
   - Run `git status` for uncommitted work
   - Check for any THEORY.MD in the repo

2. **Memory context:**
   - Read the project's dedicated memory file if it exists (e.g., `alquid.md`)
   - Read `projects.md` for the project's current status summary

3. **Vault context** (if client is known):
   - Use `vault-researcher` agent or `mcp__obsidian-vault__vault_search` to find:
     - Account Strategy MOC for the client
     - Recent session notes in `02 - Projects/Nfq/Claude-Sessions/`

4. **Recent meetings** (if Granola MCP available):
   - Query `mcp__claude_ai_Granola__query_granola_meetings` for meetings mentioning the project or client name in the last 2 weeks
   - Extract key decisions and action items

### Step 3 — Session Brief

Output a structured brief:

```
## Session Brief: [Project Name]
**Client:** [client name or "internal"]
**Status:** [phase/status from memory or CLAUDE.md]
**Last activity:** [last commit date + message]

### Uncommitted Work
[git status summary, or "clean"]

### Recent Commits
[last 5 commits]

### Key Context
[2-3 bullet points from vault/memory — what was happening last time]

### Recent Meetings
[key decisions/action items from Granola, or "none found"]

### Suggested Focus
[based on recent activity, suggest what to work on next]
```

### Step 4 — Verification Sweep (if in a dev project)

If the project has code (not just vault/advisory work), run a quick sweep of recently changed files:

1. `git diff --name-only HEAD~3` — get files changed in last 3 commits
2. For each file, check against known anti-patterns from `lessons.md`:
   - Java files: any `double`/`float` used for monetary values? (should be `BigDecimal`)
   - TypeScript files: any raw `number` for currency? (should be `Decimal.js` or integer cents)
   - Any hardcoded port 5000?
   - Any missing thousand separators in formatted outputs?
3. Report findings briefly — "Sweep clean" or "Found X potential issues in Y files"

This is a <10 second scan, not a full audit. If issues found, mention them but don't fix — the user decides.

### Step 5 — Update Memory (if needed)

If the session brief reveals outdated information in memory files:
- Note what should be updated at the end of this session
- Do NOT update memory files at bootstrap — wait until the session produces results

## Notes

- This skill is designed to be fast (< 30 seconds). Skip steps that have no data rather than waiting.
- If there's no CLAUDE.md, no memory file, and no vault context — say so explicitly and suggest creating them.
- The brief should be concise enough to scan in 10 seconds. No walls of text.
