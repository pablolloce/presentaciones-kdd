---
name: pr-reviewer
description: |
  Review PRs automatically using AI. Analyzes diffs for bugs, security issues,
  missing error handling, and style problems. Posts findings as PR comments.
  Inspired by MercadoLibre's Code Review Agents (Julián De Angelis, 2026).
  Use when: reviewing PRs, auditing code changes, or running pre-merge checks.
author: TARS
version: 1.0.0
date: 2026-03-01
---

# PR Reviewer

Automated code review for any repository. Reads the diff, classifies findings by severity, and posts structured feedback.

## When to Use
- User asks to review a PR
- Sub-agent completes work and needs quality check
- Periodic code audit of recent commits

## How to Review a PR

### Step 1: Get the diff
```bash
# For a GitHub PR
gh pr diff <PR_NUMBER> > /tmp/pr-diff.txt

# For local changes
git diff main...HEAD > /tmp/pr-diff.txt

# For recent commits
git diff HEAD~3..HEAD > /tmp/pr-diff.txt
```

### Step 2: Analyze
Read the diff and classify findings into:

1. **🔴 CRITICAL** — Must fix before merge:
   - Security vulnerabilities (SQL injection, XSS, credential exposure)
   - Data loss or corruption risks
   - Race conditions, deadlocks
   - Broken error handling that could crash production

2. **🟡 IMPORTANT** — Should fix:
   - Logic errors or edge cases not handled
   - Missing null/error checks
   - Performance issues (N+1 queries, unbounded loops)
   - Transaction boundary problems
   - Missing validation on API inputs

3. **🟢 SUGGESTIONS** — Nice to have:
   - Better naming or structure
   - Opportunities to reduce duplication
   - Test coverage gaps
   - Documentation improvements

### Step 3: Report Format
```markdown
## 🤖 Code Review

**Files:** X changed | **Lines:** +Y / -Z

### 🔴 Critical (X)
1. **[file:line]** Description of issue + why it's dangerous + fix suggestion

### 🟡 Important (X)
1. **[file:line]** Description + suggested fix

### 🟢 Suggestions (X)
1. **[file:line]** Observation + recommendation

### Summary
2-3 sentence overall assessment. Is this safe to merge?
```

## Rules
- Max 10 findings total (prioritize highest severity)
- Be specific: file names, line numbers, code snippets
- Don't flag subjective style preferences
- If the code is clean, say so briefly — don't invent problems
- For Java: check null safety, transactions, exception handling, thread safety
- For TypeScript/React: check types, effect deps, error states, key props
- For SQL: check injection, N+1, missing indexes, transaction isolation

## Integration with GitHub Actions
Copy `.github/workflows/pr-review-agent.yml` to any repo. Requires `ANTHROPIC_API_KEY` secret.
