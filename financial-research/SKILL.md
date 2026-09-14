---
name: financial-research
description: Conduct structured research on banking, insurance, wealth and asset management, regulation, fintech, and financial-technology topics for nfq advisory. Use when the user asks to research, investigate, analyze, or deep dive into a financial-services topic, regulation, technology trend, market development, or client issue. Default to markdown or chat synthesis; create premium HTML artifacts only when explicitly requested or when a presentation-style deliverable is needed.
---

Conduct structured research that is rigorous enough for consulting work and useful enough to feed meetings, POVs, proposals, and strategy.

## Workflow
1. Clarify scope only when needed: topic, purpose, geography, depth, and time horizon.
2. Read `references/research-structure.md` before drafting.
3. Read `references/sector-scope.md` when the topic crosses verticals or needs domain-specific framing.
4. Research market context, regulation, technology, challenges, benchmarks, and implications for nfq.
5. Synthesize findings into a short executive summary plus a structured body.

## Output modes
- **Default:** chat synthesis for quick asks.
- **Use markdown** for reusable internal research briefs.
- **Create HTML only when explicitly requested** or when a polished artifact is clearly required. In that case:
  - use `html-presentation` for implementation
  - use `frontend-design` for aesthetic direction

## Quality bar
- Prefer current, cited, primary-source-backed facts.
- Distinguish facts, informed interpretation, and explicit opinion.
- Connect every major finding to an implication for nfq or the client.
- Quantify when possible.

## Source diversity (mandatory order)
Without explicit ordering, research agents bias toward whichever sources rank highest in search — losing regulatory primary sources in favor of blog posts. Follow this hierarchy:

1. **Regulatory primary sources FIRST** — BIS, EBA, ECB, PRA, Fed, local regulators (BdE, Bafin). These are ground truth.
2. **Academic / institutional research** — arXiv papers, BIS working papers, IMF, World Bank studies.
3. **Tier-1 consultancy reports** — McKinsey, Oliver Wyman, Deloitte, Accenture, PwC (named reports with methodology).
4. **Specialized industry press** — Risk.net, The Banker, Central Banking, Regulation Asia, Finextra.
5. **General tech/business press and blogs** — only to fill gaps that the above didn't cover.
6. **Obsidian vault** — check vault for prior NFQ research on the same topic (use vault-researcher if available).

If you find yourself citing only sources from tier 5, stop and explicitly search for tiers 1-4 before continuing.

## Guardrails
- Never invent regulation numbers, benchmark figures, or client examples.
- Flag stale data if older than ~12 months and material.
- If the user really wants a thought-leadership artifact, prefer `pov-generator` after the research is done.
