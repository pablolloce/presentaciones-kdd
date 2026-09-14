---
name: proposal-factory
description: Transform RFP documents into near-final proposal packs through an 8-agent pipeline for nfq advisory. Use when the user says "proposal factory", "run the proposal factory", "prepare a proposal for [client]", "process this RFP", or provides an RFP document to turn into a proposal.
---

# Proposal Factory — RFP-to-Proposal Agent Swarm

## Description
Transform RFP documents into near-final proposal packs through an 8-agent pipeline.
Use when: Gregor says "proposal factory", "run the proposal factory", "prepare a proposal for [client]", "process this RFP", or provides an RFP document to turn into a proposal.

## Invocation
User says something like:
- "Monta la propuesta para [cliente]"
- "Proposal factory para este RFP"
- "Procesa este RFP de [cliente]"
- "Prepárame una propuesta para [oportunidad]"

## Inputs Required
1. **RFP/Brief**: Document(s) describing the opportunity (PDF, doc, email, or description)
2. **Client name**: Who is this for
3. **Context** (optional): Meeting notes, emails, previous interactions
4. **Constraints** (optional): Budget range, team availability, timeline

If inputs are incomplete, run the Discovery Diagnostic first (see Phase 0).

## Pipeline (execute sequentially)

### Phase 0 — Discovery Diagnostic (if needed)
Run 3-5 rounds of structured questions to understand the real problem:
1. **Current Reality**: objective, baseline, attempted actions, perceived blocker
2. **Execution Audit**: what's happening vs planned
3. **Environment & Leverage**: org setup, dependencies, bottlenecks
4. **Belief & Decision Friction**: risk aversion, politics, hidden constraints
5. **Commitment & Stakes**: sponsorship strength, timeline realism

Output: `discovery-diagnostic.md`

### Phase 1 — Ingest & Parse
- Normalize all input documents into searchable corpus
- Extract: mandatory requirements, evaluation criteria, deadlines, legal constraints
- Identify gaps and ambiguities
- Output: `requirements-matrix.md` + `clarifications-log.md`

### ⛔ CHECKPOINT C1 (Scope)
Present to Gregor:
- Requirements matrix (Must/Should/Could)
- Assumptions list
- Identified gaps and questions
- Proposed solution direction

**Wait for approval before continuing.**

### Phase 2 — Solution Design
- Build functional/technical approach based on approved scope
- Design delivery model, governance, team structure
- Map NFQ capabilities to requirements
- Output: `solution-blueprint.md`

### Phase 3 — Estimation & Pricing
- Create effort model with team shape and timeline
- Build risk buffers and sensitivity scenarios
- Draft pricing (T&M with cap, or fixed per phase)
- Output: `effort-pricing-draft.md`

### ⛔ CHECKPOINT C2 (Commercial)
Present to Gregor:
- Effort model and team composition
- Pricing range and scenarios
- Risk assessment
- Timeline

**Wait for approval before continuing.**

### Phase 4 — Compliance & QA
- Check proposal against RFP constraints
- Verify all mandatory requirements are addressed
- Score compliance coverage
- Output: `compliance-checklist.md`

### Phase 5 — Write & Package
- Produce proposal narrative using NFQ positioning
- Structure: Executive Summary → Technical Approach → Methodology → Team → Timeline → Commercial → Annexes
- Include evidence, credentials, case references
- Output: `proposal-draft.md` + `executive-summary.md`

### ⛔ CHECKPOINT C3 (Pre-submit)
Present to Gregor:
- Complete proposal draft
- Executive summary
- Compliance score
- Any remaining risks or open items

**Nothing is sent externally without C3 approval.**

## Output Files
All outputs go to `~/.openclaw/workspace/proposals/[client-name]/`:
- `discovery-diagnostic.md` (if Phase 0 ran)
- `requirements-matrix.md`
- `clarifications-log.md`
- `solution-blueprint.md`
- `effort-pricing-draft.md`
- `compliance-checklist.md`
- `proposal-draft.md`
- `executive-summary.md`

## NFQ Context (always inject)
- Nfq = financial consulting firm, 2000+ people, Spain/Europe/LATAM
- Core: ALM, Risk, Regulatory, Compliance, Data, AI
- Products: Alquid (ALM), ATLAS (Wealth), Fortuna (Planning), Nafra (Financial Analysis), PRISMA (DPM), NfqFoundry (Platform)
- Differentiators: deep domain expertise + tech delivery capability, not just consulting
- Gregor = Partner, leads AI strategy

## Rules
- Never hallucinate credentials or case studies — only use verified NFQ experience
- Pricing always requires human approval (C2 checkpoint)
- No external sends without C3 checkpoint
- Use professional but direct tone — no fluff
- Spanish or English depending on client context
- Reference `proposal-factory-agent-design-v1.md` for full architecture details
