# /obsidian-sync-lite

Lightweight sync command for keeping repo context in Obsidian without changing the existing vault architecture.

## Goal
Given a project directory, update (or create) a single project note with:
- metadata
- stack summary
- key files
- append-only dev log
- decisions section

## Inputs
- `PROJECT_PATH` (absolute path to repo)
- `VAULT_PATH` (Obsidian vault path)
- `PROJECT_NOTE_PATH` (target markdown file in vault)

## Workflow
1. **Detect project facts**
   - Read `package.json` / `pyproject.toml` / `requirements.txt` / `Cargo.toml` when available.
   - Read `git remote get-url origin` and recent commits (`git log --oneline -20`).
   - Scan top-level folders + key config files.

2. **Update note sections**
   - Refresh:
     - `## Metadata`
     - `## Stack`
     - `## Key Files`
   - Preserve existing user content outside managed sections.

3. **Append dev log (never rewrite history)**
   - Add new dated block at top of `## Dev Log`.
   - If date already exists, append bullets under same date.

4. **Decision capture**
   - Append new bullets under `## Decisions` in format:
     - `YYYY-MM-DD — Decision — Why`

5. **Safety checks before save**
   - Never delete unmanaged sections.
   - Keep valid markdown structure.
   - Show diff summary in response.

## Editing Rules
- Append-only for dev logs.
- Do not remove existing content unless explicitly requested.
- Keep entries concise and factual.
- Prefer deterministic extraction over inferred claims.

## Done Criteria
- Project note exists.
- Metadata/Stack/Key Files updated.
- New dev log entry appended.
- Decision section updated when relevant.
- Output reports what changed.
