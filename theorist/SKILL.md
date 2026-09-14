---
name: theorist
description: |
  Maintain a per-repo THEORY.MD as a continuously updated narrative of the
  operating theory behind the current work. Adapted from Siqi Chen's
  github.com/blader/theorist. Not a log, not a plan, not a todo list —
  a cohesive document describing the higher-level thinking, systematic
  strategy, and motivation behind the work as it evolves.
author: TARS (adapted from blader)
version: 1.0.0
date: 2026-02-28
---

# Theorist

Maintain a per-repo narrative document at `THEORY.MD` that captures
the operating theory of the work being done. This is not a plan, not a log, not
a task list. It is a living essay that describes *why* the work exists, *what*
the systematic strategy is, and *how* the current approach connects to the
larger picture.

**This skill is always active during substantive work sessions. No trigger required.**

## What THEORY.MD Is

A cohesive narrative document — typically 1-3 pages — that a collaborator
could read to understand:

- **Problem thesis**: What problem is being solved and why it matters.
  Not "fix bug X" but "the export pipeline assumes Y, which breaks under Z."
- **Operating theory**: Current mental model of how the system works
  and where the leverage points are. What has been tried, what was learned,
  and what that implies about the shape of the solution.
- **Systematic strategy**: Not task-by-task steps, but the higher-order
  approach. Why this sequence of work? What principle connects the changes?
- **Key discoveries and pivots**: Moments where understanding shifted. What
  was the old theory, what broke it, and what replaced it.
- **Open questions and uncertainties**: What is still unknown. Where the
  current theory might be wrong. What would change the approach.

## What THEORY.MD Is Not

- **Not a changelog or log**: Never append timestamped entries. Rewrite holistically.
- **Not a plan or todo list**: No checkboxes. A theory says "X matters because of Y, and the right lever is Z."
- **Not a postmortem**: Written in present tense of ongoing work.
- **Not a status report**: Not "today I did X" but "the current approach is X because evidence shows Y."

## When to Update

Update when understanding shifts meaningfully:
- A root cause is identified that changes the approach
- A strategy pivot happens (tried X, learned Y, now doing Z)
- A key discovery narrows or expands the problem scope
- An open question gets answered, or a new uncertainty emerges

Do NOT update on every code change. Update when the *theory* changes.

## How to Update

Rewrite relevant sections in place. The entire document should read as a
coherent narrative at any point in time. Old theories that were superseded
should be briefly noted as pivots, not deleted — the evolution of understanding
is part of the theory.

## Document Structure

```markdown
# Theory: [Short Title]

## Problem
[Structural reason the problem exists, not just symptoms.]

## Operating Theory
[Current mental model. Key dynamics. Where is the leverage?]

## Strategy
[Systematic approach. Principles, not tasks. Why this sequence?]

## Key Discoveries
[Pivots in understanding. Specific, not vague.]

## Open Questions
[What remains uncertain. What would change the approach.]
```

## Practical Rules

- One THEORY.MD per repo, at repo root.
- Maximum ~200 lines. If longer, tighten.
- Rewrite holistically, never append.
- If the work is trivial, don't create one.
- For sub-agents: include THEORY.MD context in delegation envelopes for repos with active theories.

## Integration with TARS Harness

- **Boris Tane protocol**: THEORY.MD complements research.md/plan.md. Plans say *what* to do; theory says *why this shape*.
- **Memory system**: THEORY.MD is per-repo, not per-workspace. Don't duplicate into memory/.
- **Sub-agent delegation**: When delegating work on a repo with THEORY.MD, include it in context so sub-agents stay coherent with the operating theory.
- **Heartbeats**: During nightly code review, check if active THEORY.MD files need updating based on recent commits.
