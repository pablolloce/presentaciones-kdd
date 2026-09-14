---
name: value-studio
description: Create client-tailored value propositions and opportunity maps proactively before RFPs land, for nfq advisory commercial work. Use when the user says "value proposition", "value studio", "prepare a value prop for [client]", "what can we offer [client]", or "map opportunities for [sector/client]".
---

# Value Proposition Studio — Proactive Commercial Agent Swarm

## Description
Create client-tailored value propositions and opportunity maps before RFPs land.
Use when: Gregor says "value proposition", "value studio", "prepare a value prop for [client]", "what can we offer [client]", "map opportunities for [sector/client]".

## Invocation
User says something like:
- "Prepárame una value prop para [cliente]"
- "Value studio para [sector/cliente]"
- "¿Qué podemos ofrecer a [cliente]?"
- "Mapea oportunidades en [área] para [cliente]"

## Inputs Required
1. **Client or sector**: Who/what this targets
2. **Context** (optional): Known pain points, recent news, regulatory pressure, existing relationship
3. **Focus area** (optional): Specific NFQ capability area (ALM, Risk, Regulatory, AI, etc.)

## Pipeline (execute sequentially)

### Phase 1 — Client Intelligence
- Research client's current situation: strategy, regulation pressure, operating pain
- Check existing NFQ relationship history (memory/people/, memory/projects/)
- Scan recent news, earnings, regulatory changes affecting the client
- Output: `client-intelligence.md`

### Phase 2 — Opportunity Mapping
- Map client pain points to NFQ capabilities by area
- Identify whitespace (needs not yet addressed)
- Cross-reference with NFQ product portfolio
- Output: `opportunity-map.md`

### Phase 3 — Use Case Design
- Read `references/ai-value-framework.md` for Bessemer's pricing power spectrum
- Create use-case catalog with:
  - Description, KPI targets
  - Effort estimate, dependencies
  - ROI hypothesis
  - Data readiness assessment
  - **AI Value Level** (1-4: Enhanced → Autonomous) from Bessemer framework
- Score each use case (impact × readiness × urgency)
- Output: `use-case-inventory.md` + `prioritization-matrix.md`

### Phase 4 — Differentiation & Evidence
- Articulate "Why NFQ" with proof points
- Pull relevant credentials and case references
- Benchmark against likely competitors
- Output: embedded in final deliverables

### Phase 5 — Storyline & Packaging
- Build C-level narrative: Problem → Opportunity → Roadmap
- Package into three formats:
  1. **1-pager**: elevator pitch with key numbers
  2. **Deck** (8-12 slides): for first meeting
  3. **Deep doc**: full analysis for internal use
- Output: `value-proposition-1pager.md` + `value-proposition-deck.md` + `value-proposition-full.md`

### ⛔ CHECKPOINT (Review)
Present to Gregor:
- Opportunity map
- Top 3-5 use cases with ROI
- Draft 1-pager
- Recommended approach angle

**Wait for direction before packaging final version.**

## Output Files
All outputs go to `~/.openclaw/workspace/value-propositions/[client-name]/`:
- `client-intelligence.md`
- `opportunity-map.md`
- `use-case-inventory.md`
- `prioritization-matrix.md`
- `value-proposition-1pager.md`
- `value-proposition-deck.md`
- `value-proposition-full.md`

## Prioritization Framework
Score each use case 1-5 in:
- **Business impact**: revenue/cost effect
- **Time-to-value**: weeks to first result
- **Data readiness**: can we start now?
- **Delivery complexity** (inverse): simpler = higher score
- **Regulatory urgency**: compliance deadline pressure

Tiers:
- **Tier 1 (Launch now)**: high impact + high readiness
- **Tier 2 (Build next)**: high impact, medium readiness
- **Tier 3 (Watchlist)**: strategic but not yet ready

## NFQ Context (always inject)
- Same as Proposal Factory — see that skill for full context
- Key: position NFQ as "Context Provider" not code vendor
- Products: Alquid, ATLAS, Fortuna, Nafra, PRISMA, NfqFoundry
- Vision: x3 delivery in 18 months, 35% revenue from AI

## Rules
- Base everything on real NFQ capabilities — no overselling
- Include concrete numbers where possible (effort, timeline, ROI range)
- Adapt language to audience (C-level = strategic, technical = detailed)
- Spanish for Spanish clients, English for international
- Reference `proposal-factory-agent-design-v1.md` for full architecture
