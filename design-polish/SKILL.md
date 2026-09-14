---
name: design-polish
description: Final quality pass for NFQ frontend deliverables before client delivery. Fixes alignment, spacing, consistency, interaction states, and detail issues. Use after the interface is functionally complete, before shipping presentations, proposals, or dashboards.
user-invocable: true
---

Perform a meticulous final pass on NFQ frontend output. Fix every detail that separates "done" from "polished." This is the last step before client delivery.

## Pre-Polish Check

1. **Is it functionally complete?** Polish is the last step, not the first. Don't polish incomplete work.
2. **Load design context**: Read `DESIGN.md` or `nfq-design.md` rules for the NFQ design system spec.
3. **What's the deliverable?** Presentation? Proposal? Dashboard? Artifact? The quality bar differs.

## Polish Dimensions

### Visual Alignment & Spacing

- All spacing uses NFQ scale: 4, 8, 12, 16, 24, 32px — no random values (13px, 17px, etc.)
- Card padding: 24px internal consistently
- Section gaps: 24px standard, 32px between major sections
- Grid gaps: 16px between cards, 24px between sections
- Optical centering: icons may need 1-2px offset to look centered
- Responsive spacing: verify at 1920px+ and tablet widths

### Typography Compliance

- **Every number, date, rate, status code** → JetBrains Mono. No exceptions.
- **Labels** → JetBrains Mono, UPPERCASE, tracking ≥ 0.16em
- **Body text** → Inter, 0.875rem (14px), weight 400
- **Headings** → Inter, proper scale (Display 3.5rem → Headline 1.75rem → Title 1.25rem)
- **KPI numbers** → JetBrains Mono, 2.5rem, weight 700
- **Line length**: 45-75 characters for body text
- **Financial formatting**: Thousand separators (es-ES: `1.234.567,89 €`), min 2 decimal places
- **No orphans**: Avoid single words on last line of paragraphs in presentations

### Color & Token Usage

- All colors via `--nfq-*` CSS variables — zero hardcoded hex values
- Surface hierarchy follows tonal layering (root → surface → elevated → highest → bright)
- Text hierarchy: primary (#fff) → secondary (#adaaaa) → tertiary (#8a8686) → muted (#64605e)
- Semantic colors correct: success=#10b981, warning=#f59e0b, danger=#f43f5e, info=#06b6d4
- Ghost borders only at 15% opacity — no solid colored borders for layout divisions
- Accent color matches the application context (Alquid=cyan, GDC=blue, etc.)

### Interaction States

Every interactive element must have:
- **Default** → resting state with correct token colors
- **Hover** → subtle feedback (surface shift, accent hint, scale)
- **Focus** → accent color at 40% opacity + 2px glow outline
- **Active** → `transform: scale(0.97)` for buttons
- **Disabled** → reduced opacity, no pointer events
- **Loading** → skeleton shimmer (1.5s) or spinner for async actions

Missing states break trust. A button without hover feedback feels broken.

### Motion & Transitions

- Color transitions: 150ms (fast)
- Layout transitions: 200ms (normal)
- Card hover: 200ms
- Modal/dialog: 250ms with spring feel
- Sidebar expand: 300ms
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` for ease-out (never ease-in for UI)
- **Only animate transform and opacity** — never width, height, padding, margin
- Respect `prefers-reduced-motion`: disable animations, keep functionality
- No bounce or elastic easing — smooth deceleration only

### Content & Copy

- **Language consistency**: Spanish for UI labels, English for code identifiers
- **Terminology**: Same concept = same word throughout
- **Capitalization**: Consistent (Title Case or Sentence case, pick one)
- **Abbreviations**: Spell out on first use in presentations
- **Financial precision**: Rates with 2+ decimals, amounts with separators, conventions explicit (ACT/360, etc.)

### Icons & Visual Elements

- All icons from Lucide React, 18px default, outline style (filled for active/selected)
- Icons optically aligned with adjacent text
- NFQ logo present where required: SVG from `Cowork/trans_ai/outputs/nfq-logo.svg`
  - Content slides: 20x25px top-left
  - Cover slides: 28x35px

### Data Tables (critical for NFQ)

- Headers: JetBrains Mono, UPPERCASE, tracking 0.1em
- Numeric columns: right-aligned
- Row padding: 8px vertical, 16px horizontal
- Alternating row backgrounds (subtle)
- Financial numbers: monospace, thousand separators, right-aligned, 2+ decimals
- No divider lines between rows — use spacing and alternating backgrounds

### Presentation-Specific Polish

If the deliverable is an HTML presentation:
- Every content slide has: eyebrow (`Exhibit NN — Section`) + title + visualization + takeaway
- Takeaway: border-top 2px accent + bold text
- Progress bar: 3px fixed top, accent color
- Navigation: bottom-center pill, functional prev/next
- Export buttons: PDF + PPTX + Slides visible and functional
- Slide count and numbering consistent

## Polish Checklist

Go through systematically:

- [ ] All spacing on NFQ 4px scale
- [ ] All numbers/dates/rates in JetBrains Mono
- [ ] All labels UPPERCASE with tracking
- [ ] All colors via `--nfq-*` variables
- [ ] Surface hierarchy follows tonal layering
- [ ] Ghost borders only (no solid borders for layout)
- [ ] All interactive states present (hover, focus, active, disabled)
- [ ] Transitions smooth at 60fps (transform/opacity only)
- [ ] Financial data formatted correctly (es-ES locale)
- [ ] Tables right-aligned for numbers, monospace headers
- [ ] Icons consistent (Lucide, 18px, outline)
- [ ] NFQ logo present and correctly sized
- [ ] No hardcoded hex values
- [ ] No bounce/elastic easing
- [ ] Responsive at desktop + tablet
- [ ] Focus indicators visible (accent + glow)
- [ ] No console errors or warnings
- [ ] Print/export CSS functional (if presentation)
- [ ] `prefers-reduced-motion` respected

## Final Verification

Before marking as done:
- **View at full screen**: Does it feel like a premium NFQ deliverable?
- **Check all data**: Are financial numbers realistic and correctly formatted?
- **Test interactions**: Click every button, hover every card, tab through forms
- **Test theme**: If multi-theme, verify all variants
- **Compare to DESIGN.md**: Does it match the Obsidian Architect philosophy?

Polish until it feels effortless, looks intentional, and communicates competence. The difference between "AI made this" and "a design-conscious consultancy made this" is in these details.
