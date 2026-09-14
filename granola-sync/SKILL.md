---
name: granola-sync
description: Sync recent Granola meeting transcripts to Obsidian vault. Extracts decisions, action items, and client context from meetings and writes structured notes to the vault. Use after client meetings or at session start to capture meeting context.
---

# Granola → Obsidian Vault Sync

Queries Granola for recent meetings, extracts key information, and writes structured notes to the Obsidian vault.

## Process

### Step 1 — Query Recent Meetings

Use `mcp__claude_ai_Granola__list_meetings` to get meetings from the last 7 days (or since last sync).

If the user specifies a client name, filter by meetings mentioning that client.

### Step 2 — For Each Unsynced Meeting

For each meeting found, use `mcp__claude_ai_Granola__get_meeting_transcript` to get the full transcript.

Extract from each meeting:
- **Date and participants**
- **Client** (if identifiable from participants or content)
- **Key decisions** (commitments, agreements, approvals)
- **Action items** (who does what by when — convert relative dates to absolute)
- **Open questions** (unresolved items, parking lot)
- **Context for active projects** (references to Alquid, CapitalEngine, ATLAS, etc.)

### Step 3 — Write to Vault

For each meeting, write a structured note to the Obsidian vault using `mcp__obsidian-vault__vault_session_write`.

**File location:** `02 - Projects/Nfq/Claude-Sessions/`
**Filename:** `meeting-[YYYY-MM-DD]-[client-or-topic].md`

**Note format:**
```markdown
---
type: meeting-sync
date: [YYYY-MM-DD]
client: [client name or "internal"]
participants: [list]
source: granola
---

# Meeting: [topic]

## Decisions
- [decision 1]
- [decision 2]

## Action Items
- [ ] [who]: [what] — by [absolute date]
- [ ] [who]: [what] — by [absolute date]

## Open Questions
- [question 1]
- [question 2]

## Project Context
[Any references to active NFQ projects, with notes on what was discussed about them]

## Raw Notes
[Brief summary of discussion flow, key quotes if relevant]
```

### Step 4 — Report

Output a summary:
```
Synced [N] meetings to vault:
- [date] [client]: [topic] → [N decisions, N action items]
- [date] [client]: [topic] → [N decisions, N action items]
```

## Notes

- Skip meetings that already have a note in the vault (check by date + topic)
- If Granola MCP is not available, say so and suggest the user check their MCP configuration
- Keep notes concise — the vault note is a reference, not a full transcript
- Always convert relative dates ("next Thursday") to absolute dates ("2026-03-26")
- Tag action items with the responsible person's name when identifiable
