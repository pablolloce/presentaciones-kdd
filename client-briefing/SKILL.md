---
name: client-briefing
description: Generate pre-meeting client briefings for nfq advisory consultants. Use when the user asks to prepare for a client meeting, prospect call, steering committee, commercial prep, or says "brief me on [client]" / "prepárame una ficha de [cliente]". Default to concise chat or markdown outputs; create a premium HTML artifact only when explicitly requested or clearly needed for internal sharing.
---

Generate concise, decision-useful client briefings that help Gregor or an nfq consultant walk into a meeting with context, angles, and concrete talking points.

## Workflow
1. Clarify only the missing context that materially changes the output: meeting type, purpose, date, geography, or known relationship.
2. Read `references/briefing-structure.md` before drafting.
3. Read `references/sector-lenses.md` only when sector-specific emphasis matters.
4. Research current company context, leadership, strategy, technology, regulatory/risk context, and recent news.
5. Translate findings into nfq-relevant opportunity framing and concrete talking points.

## Output modes
- **Default:** concise chat brief or markdown briefing.
- **Use markdown** when the user wants something reusable or shareable internally.
- **Create HTML only when explicitly requested** or when a premium artifact is clearly useful. In that case:
  - use `html-presentation` to build the artifact
  - use `frontend-design` for creative direction

## Quality bar
- Prioritize current facts and useful framing over generic company history.
- Make the briefing actionable for the meeting.
- Keep it short enough to be read before the call.
- Surface 3-5 strong talking points, not 15 weak ones.

## Guardrails
- Never invent relationship history or previous nfq work.
- Flag speculative items clearly.
- Prefer primary or company-controlled sources when possible.
- If key information is missing, say so instead of filling gaps with consultancy perfume.
