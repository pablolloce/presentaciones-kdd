---
name: obsidian-bridge
description: Bidirectional bridge between Claude Code memory and Obsidian vault. Read vault context at session start, write session notes at session end.
version: 1.0.0
---

## When to Use

- **Always at session start** (passive read): scan vault INDEX.md for recent changes and new breadcrumbs from TARS
- **At session end** when the session produced strategic insights, decisions, or discoveries worth preserving in the vault
- **On demand** when user asks to sync, check vault, or consult Obsidian research

## Vault Location

```
/Users/gregoriogonzalo/Developer/Obsidian/Goals/
```

## Read Protocol (Session Start)

When beginning a session that involves strategy, research, client work, or project decisions:

1. **Read `INDEX.md`** — check for new entries or breadcrumbs since last session
2. **Scan `02 - Projects/Nfq/Claude-Sessions/`** — check last 3 session notes for continuity
3. **If topic-relevant**: read specific notes from the vault (follow wiki links in INDEX)
4. **Update Claude memory** (`obsidian-index.md`) if INDEX.md has new entries

Do NOT read the entire vault. Be surgical — use INDEX as the map.

## Write Protocol (Session End)

Only write a session note when the session produced one or more of:
- Strategic decision with rationale
- New pattern or insight worth preserving
- Research finding that connects to existing vault notes
- Significant project milestone or architecture decision

### Session Note Format

Create in: `02 - Projects/Nfq/Claude-Sessions/YYYY-MM-DD — Topic.md`

```markdown
---
date: YYYY-MM-DD
agent: claude-code
tags: [session, topic-tags]
---

# Topic Title

## Context
What was asked and why. 1-3 sentences.

## Decisions
- Decision — Rationale

## Artifacts
- `path/to/file` — what was created/modified

## Insights
Key discoveries or patterns useful for the vault.

## Links
- [[Related vault note]] — how it connects
- [[Another note]] — why it matters
```

### Post-Write

After creating a session note:
1. **Suggest INDEX.md update** — propose a one-liner for TARS to add
2. **Update Claude memory** if the session changed something structural (new project, new pattern, new preference)

## Vault Navigation Rules

- **INDEX.md** is the entry point — always start there
- **Follow `[[wiki links]]`** in sentences to build understanding chains
- **`/04 - Resources/Articles/`** for research (297 curated articles)
- **`/02 - Projects/Nfq/Advisory/MOCs/`** for client account context
- **`/02 - Projects/Nfq/Alquid/`** for product specs
- **Never modify existing vault notes** unless explicitly asked — that's TARS's domain
- **Only write in `Claude-Sessions/`** — this is Claude's designated zone

## Integration with Claude Memory

The bridge connects two systems:

```
Claude Memory (~/.claude/.../memory/)     Obsidian Vault (Goals/)
├── MEMORY.md (global context)     ←→     INDEX.md (vault scan)
├── obsidian-index.md (vault map)  ←      Full vault structure
├── alquid.md (project detail)     ←→     02 - Projects/Nfq/Alquid/
├── projects.md (inventory)        ←→     02 - Projects/
└── skills-inventory.md                   (no vault equivalent)
                                   →      02 - Projects/Nfq/Claude-Sessions/
```

- **←** Claude reads from vault (INDEX, articles, specs)
- **→** Claude writes to vault (session notes only)
- **←→** Both systems inform each other, updated independently

## What NOT to Do

- Don't dump entire session transcripts — extract insights only
- Don't create a session note for routine coding (bug fixes, refactors)
- Don't modify notes outside `Claude-Sessions/` without explicit user request
- Don't duplicate what's already in Claude memory files
- Don't write notes that don't link to at least one existing vault note
