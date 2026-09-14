---
name: project-review
description: Compound review command — chains typecheck + lint + test + diff into one structured report with real shell output. Use when asked to review the project, check health, or before committing/pushing.
---

# Project Review

Compound command that runs all project health checks in sequence and produces a single structured report. Real shell output, not blind analysis.

## Step 1: Detect stack

Read the project root to identify the stack:

| Indicator | Stack | Typecheck | Lint | Test | Format |
|-----------|-------|-----------|------|------|--------|
| `pom.xml` | Java/Maven | `./mvnw compile` | (compiler warnings) | `./mvnw test` | — |
| `build.gradle` | Java/Gradle | `./gradlew compileJava` | (compiler warnings) | `./gradlew test` | — |
| `package.json` + tsconfig | TypeScript | `npx tsc --noEmit` | `npx eslint .` or check scripts | `pnpm test` or `npm test` | `npx prettier --check .` |
| `package.json` (no ts) | JavaScript | — | `npx eslint .` | `pnpm test` or `npm test` | `npx prettier --check .` |
| `pyproject.toml` | Python | `uv run mypy .` or `uv run pyright` | `uv run ruff check .` | `uv run pytest` | `uv run ruff format --check .` |
| `go.mod` | Go | `go build ./...` | `go vet ./...` | `go test ./...` | — |

If multiple stacks exist (monorepo), run each in its directory.

## Step 2: Run checks in sequence

Run each check that exists. Do NOT skip a check if the previous one fails — run all of them.

For each check, capture:
- Exit code (0 = pass, non-zero = fail)
- First 50 lines of output (enough to diagnose, not overflow context)
- Count of errors/warnings if parseable

**Important:** Use the project's actual scripts when available. Check `package.json` scripts first:
- `"typecheck"` or `"type-check"` → use that
- `"lint"` → use that
- `"test"` → use that
- `"format:check"` or `"format"` → use that

Fall back to the default commands in the table only if no script exists.

## Step 3: Git status

Run in parallel with checks:
- `git status --short` — uncommitted changes
- `git diff --stat` — staged/unstaged summary
- `git log --oneline -5` — recent commits

## Step 4: Structured report

Output a single structured report:

```
## Project Review: [project name]

### Health Check
| Check | Status | Details |
|-------|--------|---------|
| Typecheck | ✅/❌ | X errors, Y warnings |
| Lint | ✅/❌ | X issues |
| Tests | ✅/❌ | X passed, Y failed, Z skipped |
| Format | ✅/❌ | X files need formatting |

### Failures (if any)
[First 30 lines of each failing check output]

### Git Status
- Uncommitted: X files modified, Y untracked
- Recent: [last 3 commits, one line each]

### Verdict
[One sentence: "Clean — ready to commit" or "X issues to fix before committing"]
```

## Rules

- Never skip a check because another failed — run all, report all
- Use real shell output — never guess what a check would return
- If a check command doesn't exist (no eslint, no tests), report "N/A" not "pass"
- Keep output concise — this is a dashboard, not a debugging session
- If the project has no recognizable stack, say so and suggest what to add
