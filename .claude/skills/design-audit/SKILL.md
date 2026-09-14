---
name: design-audit
description: Audit this repository's presentation output for visual quality, accessibility, design system compliance, and AI-generated aesthetic anti-patterns. Generates a prioritized report without making changes. Use when reviewing HTML presentations, proposals, dashboards, or any UI output before delivery.
user-invocable: true
---

Perform a comprehensive quality audit of a presentation in `presentations/`. Document issues with severity ratings and actionable recommendations. **Do not fix anything — only report.**

## Pre-Audit: Load Design Context

1. Lee `CLAUDE.md` (§ 3 y § 4, los estándares del repositorio) y
   `.claude/skills/html-presentation/references/presentation-stylebook.md` para decks o
   `doc-stylebook.md` para documentos long-scroll.
2. Lee `brand/brand.json`: paleta, tipografías y nombre de la marca activa. Cualquier color
   fuera de esa paleta es una desviación que hay que reportar.
3. Check which **theme** applies (Dark=default, Light=corporate, Glass=premium)

## Diagnostic Dimensions

### 1. Design System Compliance

Check adherence to NFQ design system:

- **CSS variables**: All colors MUST use `--nfq-*` variables, never hardcoded hex. Exception: one-off creative elements in proposals
- **Typography pairing**: Inter for UI text, JetBrains Mono for ALL numbers, dates, rates, status codes, labels (UPPERCASE + tracking 0.16em+)
- **Surface hierarchy**: Tonal layering (darker parent → lighter child), NOT `1px solid` borders for sectioning
- **Ghost borders**: If borders exist, they must be `--nfq-border-ghost` (15% opacity) — never solid colored borders for layout
- **Spacing**: 24-32px gaps between sections, 24px card internal padding, 16px gaps between cards
- **Component specs**: Buttons 36px height + 6px radius, Cards 10px radius, Inputs 36px height + 6px radius
- **Financial data**: Thousand separators (es-ES locale: `1.234.567,89 €`), minimum 2 decimal places for rates/monetary values

### 2. AI Slop Detection (adapted for NFQ)

Check for generic AI-generated aesthetic tells. **CRITICAL: NFQ has intentional design choices that overlap with common AI patterns. Do NOT flag these as anti-patterns:**

#### NFQ Exceptions (NOT anti-patterns for us)
- Dark mode with accent glows → **INTENTIONAL** (Obsidian Architect philosophy)
- Cyan on dark backgrounds → **INTENTIONAL** for Alquid accent
- Inter as primary font → **INTENTIONAL** as our UI standard
- JetBrains Mono for data → **INTENTIONAL** as our data standard
- KPI/hero metric cards → **INTENTIONAL** core pattern for financial dashboards
- Card-based layouts for data → **INTENTIONAL** for structured financial data
- Glassmorphism in Glass theme → **INTENTIONAL** as a dedicated theme variant

#### Actual Anti-Patterns to Flag
- **Purple-to-blue gradients** when not using GDC/BRAIP accent palette
- **Gradient text** for "impact" — especially on metrics or headings
- **Bounce or elastic easing** — feels dated; NFQ uses smooth deceleration
- **Generic drop shadows** instead of NFQ's tonal layering or `--nfq-shadow-*` variables
- **Nested cards inside cards** — flatten the hierarchy, use spacing
- **Same spacing everywhere** — no rhythm, monotonous feel
- **Gray text on colored backgrounds** — use a shade of the background color or `--nfq-text-*` variables
- **Pure black (#000000)** for backgrounds — NFQ uses warm near-black (#0e0e0e). Exception: `--nfq-bg-input` is pure black for recessed effect
- **Pure white (#ffffff)** for text in dark theme — use `--nfq-text-primary` (#ffffff is acceptable but check it's via variable)
- **Sparklines as decoration** — charts must convey real data
- **Modals when not necessary** — prefer inline expansion, drawers, or page navigation
- **Icons above every heading** — avoid templated look
- **Redundant copy** — headers restating what's already visible
- **Every button styled as primary** — use ghost, secondary, tertiary variants

### 3. Accessibility (a11y)

- **Contrast ratios**: Text ≥ 4.5:1 (normal), ≥ 3:1 (large text). Critical for dark themes where `--nfq-text-tertiary` (#8a8686) on `--nfq-bg-surface` (#1a1919) can be borderline
- **Missing ARIA**: Interactive elements need proper roles, labels, states
- **Keyboard navigation**: Focus indicators present (accent color at 40% + 2px glow), logical tab order
- **Semantic HTML**: Proper heading hierarchy, landmarks, buttons not divs
- **Form inputs**: Labels, required indicators, error messaging
- **Alt text**: All images described

### 4. Performance

- **Animation properties**: Only animate `transform` and `opacity`. Flag any animation of `width`, `height`, `top`, `left`, `padding`, `margin`
- **Image optimization**: Lazy loading for off-screen content, appropriate formats
- **Layout shift**: No CLS — elements must not jump after load
- **Render performance**: Minimal re-renders, appropriate memoization
- **Font loading**: Inter and JetBrains Mono should load without FOUT/FOIT

### 5. Responsive Design

- **Breakpoints**: Works at 1920px+ desktop, tablet width, and mobile
- **Touch targets**: ≥ 44x44px on touch devices
- **No horizontal scroll**: Content fits viewport at all sizes
- **Text scaling**: Layouts survive text size increase
- **Sidebar handling**: 64px collapsed, 256px expanded as per spec

### 6. Print & Export (for presentations)

- **Print CSS**: White backgrounds, visible borders on tables, hidden nav, 11pt body
- **PDF export**: `@media print` rules applied
- **PPTX export**: High-quality backgrounds, readable text overlays

## Report Format

### AI Slop Verdict
**Start here.** Pass/fail: Does this look like generic AI output, or does it look like intentional NFQ design? List specific tells found. Be brutally honest but respect NFQ's intentional choices.

### Design System Score
Rate compliance with the repository standards (CLAUDE.md § 3-4 + stylebook): **Strict / Mostly Compliant / Drifting / Non-Compliant**

### Executive Summary
- Total issues by severity (Critical / High / Medium / Low)
- Top 3-5 most impactful issues
- Recommended next steps

### Detailed Findings

For each issue:
| Field | Content |
|-------|---------|
| **Location** | Component, file, line |
| **Severity** | Critical / High / Medium / Low |
| **Category** | System Compliance / AI Slop / Accessibility / Performance / Responsive / Print |
| **Description** | What the issue is |
| **Impact** | How it affects users or brand |
| **Fix** | Specific, actionable recommendation |

Group by severity: Critical → High → Medium → Low.

### Positive Findings
Note what's working well — good practices to maintain and replicate.

### Recommendations
1. **Immediate**: Critical blockers
2. **Short-term**: High-severity issues
3. **Medium-term**: Quality improvements
4. **Long-term**: Nice-to-haves

**IMPORTANT**: Be thorough but actionable. Focus on what actually matters for NFQ deliverables. A banking client seeing a proposal cares about professionalism and data clarity, not theoretical a11y edge cases.

**NEVER**:
- Flag NFQ intentional design choices as anti-patterns
- Report issues without explaining impact
- Provide generic recommendations (be specific to the file and line)
- Skip positive findings
- Report false positives without verification
