# Presentation Stylebook — NFQ Advisory

Visual reference for HTML slide decks. McKinsey-grade consulting aesthetic adapted to NFQ's Meridian Obsidian design system.

**Reference implementation:** `references/presentation-template.html` — open in browser to see all patterns in action.

---

## 1. Slide Anatomy

Every content slide has these elements, top to bottom:

```
┌─────────────────────────────────────────────────────┐
│ EYEBROW: "Exhibit 03 — Seccion"                     │
│                                                      │
│ TITLE: "La plataforma integra análisis predictivo    │
│ con motor de reglas configurable"                    │
│                                                      │
│ SUBTITLE (optional): secondary context text          │
│                                                      │
│ ┌──────────────────┐  ┌──────────────────────────┐  │
│ │                  │  │                          │  │
│ │   TEXT CONTENT   │  │     VISUALIZATION        │  │
│ │   (40-45%)       │  │     (55-60%)             │  │
│ │                  │  │     diagram / chart /     │  │
│ │   - feature boxes│  │     table / screenshot    │  │
│ │   - bullet lists │  │                          │  │
│ │   - KPI cards    │  │                          │  │
│ │                  │  │                          │  │
│ └──────────────────┘  └──────────────────────────┘  │
│                                                      │
│ ──────────────────── (takeaway border, 2px)          │
│ TAKEAWAY: "Key insight in bold — one sentence max"   │
└─────────────────────────────────────────────────────┘
```

### Mandatory elements
- **NFQ Logo**: The NFQ isotipo (color SVG) MUST appear on every slide. Use the inline SVG `<symbol>` pattern with `<use href="#brand-iso"/>`. On the cover: 28x35px in the header. On all other slides: 20x25px fixed top-left (as a persistent UI element alongside the section tag). The logo file is at `references/brand-isotipo.svg`.
- **Visualization**: Every content slide MUST include at least one visual. No exceptions.
- **Takeaway**: Every content slide MUST end with a takeaway line. Border-top 2px + bold text.

---

## 2. Slide Types

### Cover (ALWAYS dark, regardless of theme)
- Logo top-left + date top-right (mono, muted)
- Hero title: clamp(3.5rem, 7vw, 5.5rem), font-black, tracking-tight
- Accent line: 4rem wide, 3px height, NFQ amber
- Subtitle: xl, font-light, 70% opacity
- Description: sm, 40% opacity
- Capability map visual: grid of modules bottom-right (branded colors)
- Footer: mono, 20% opacity, company line

### Section Divider (ALWAYS dark)
- Section number: mono, 0.6rem, 30% opacity, tracking 0.2em
- Title: clamp(2.5rem, 5vw, 4rem), font-black
- Accent line: 3rem wide, 3px height, NFQ amber
- Subtitle: base, 50% opacity

### Content Slide
- Eyebrow: `Exhibit NN — Section Name`
- Title: heading, max 2 lines
- Layout: flex with gap-8, text (40%) + visualization (60%)
- Takeaway at bottom

### Data Slide
- Eyebrow + title
- KPI cards: grid 2x2 or 4x1, each with large mono number + label
- Data table or chart below KPIs
- Takeaway

### Screenshot Slide
- Layout: text (40%) + browser frame (60%)
- Browser frame: dots (red/yellow/green) + URL bar + image/placeholder
- Feature boxes on text side: icon + title + bullet list

---

## 3. Typography

| Element | Font | Size | Weight | Tracking | Color |
|---------|------|------|--------|----------|-------|
| Eyebrow | JetBrains Mono | 0.6rem | 600 | 0.12em | `--sl-text-muted` |
| Title | Inter | clamp(1.4rem, 2.6vw, 2rem) | 700 | normal | `--sl-text` |
| Subtitle | Inter | 0.85rem | 400 | normal | `--sl-text-sec` |
| Body | Inter | 0.8rem | 400 | normal | `--sl-text-sec` |
| KPI number | JetBrains Mono | 1.4rem+ | 700 | normal | brand color |
| KPI label | JetBrains Mono | 0.55rem | 500 | 0.1em | `--sl-text-muted` |
| Takeaway | Inter | 0.75rem | 600 | normal | `--sl-text` |
| Tag/badge | JetBrains Mono | 0.55rem | 600 | 0.06em | varies |
| Data row | Inter/Mono | 0.8rem | 400 | normal | `--sl-text-sec` |
| Section divider title | Inter | clamp(2.5rem, 5vw, 4rem) | 900 | tight | white |
| Cover hero | Inter | clamp(3.5rem, 7vw, 5.5rem) | 900 | tight | white |

---

## 4. Theme System

Three themes available via toggle. Light is the DEFAULT for content slides.

### Light (default — McKinsey/corporate)
```css
--sl-bg: #FFFFFF;
--sl-bg-card: #FFFFFF;       /* with border: 1px solid #E2E4EB */
--sl-bg-alt: #F8F9FB;
--sl-text: #0B1026;          /* navy */
--sl-text-sec: #6B7185;
--sl-text-muted: #9DA2B3;
--sl-accent: #0B1026;        /* navy for lines, borders, takeaway */
--sl-progress: #0B1026;
--sl-border: #E2E4EB;
--sl-nav-bg: #0B1026;
--sl-nav-text: #9DA2B3;
```

### Dark (Meridian Obsidian — warm tones)
```css
--sl-bg: #0e0e0e;
--sl-bg-card: #1a1919;       /* with border: 1px solid #2a2827 */
--sl-bg-alt: #201f1f;
--sl-text: #ffffff;
--sl-text-sec: #adaaaa;      /* warm grey */
--sl-text-muted: #64605e;
--sl-accent: #F48B4A;        /* NFQ amber */
--sl-progress: #ffffff;
--sl-border: #2a2827;
--sl-nav-bg: #1a1919;
--sl-nav-text: #adaaaa;
```

### Glass (premium frosted)
```css
--sl-bg: rgba(45, 48, 75, 0.95);
--sl-bg-card: rgba(20, 22, 40, 0.65);
--sl-bg-alt: rgba(30, 33, 58, 0.75);
--sl-text: #ffffff;
--sl-text-sec: #e2e8f0;
--sl-text-muted: #8892a4;
--sl-accent: #53ddfc;        /* cyan */
--sl-progress: #53ddfc;
--sl-border: rgba(255, 255, 255, 0.15);
--sl-nav-bg: rgba(20, 22, 40, 0.8);
--sl-nav-text: #8892a4;
```

### Cover/Divider/Closing slides (theme-aware dark)

These slides are always dark but their exact shade adapts to the theme via `--sl-dark-*` variables:

| Variable | Light | Dark (Obsidian) | Glass |
|----------|-------|-----------------|-------|
| `--sl-dark-bg` | `#0B1026` (navy) | `#0a0a0a` (warm black) | `rgba(20,22,45,0.97)` (deep indigo) |
| `--sl-dark-accent` | `#0B1026` | `#F48B4A` (amber) | `#53ddfc` (cyan) |
| `--sl-dark-text-sec` | `rgba(255,255,255,0.7)` | `#adaaaa` | `#e2e8f0` |
| `--sl-dark-text-mut` | `rgba(255,255,255,0.4)` | `#64605e` | `#8892a4` |
| `--sl-dark-module-bg` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.08)` |

Use inline `style="background:var(--sl-dark-accent)"` for accent lines and `style="color:var(--sl-dark-text-sec)"` for secondary text in covers/dividers.

### Theme rules
- Cover and Section Divider slides use `--sl-dark-*` variables (navy in Light, warm black in Dark, deep indigo in Glass)
- Light is the default for content slides (McKinsey/consulting standard)
- The theme toggle sits in the bottom nav bar
- Theme change applies instantly via CSS variable swap (JavaScript)

---

## 5. NFQ Brand Colors (for visualizations)

| Name | Hex | Usage |
|------|-----|-------|
| Amber | `#F48B4A` | Primary accent, CTAs, first category |
| Coral | `#E04870` | Secondary, alerts, second category |
| Violet | `#9B59B6` | Tertiary, AI/innovation |
| Steel | `#5B7FC7` | Quaternary, data/tech |
| Azure | `#3B82F6` | Links, interactive, fifth category |

Use these consistently across all visualizations. Never use random or Tailwind default colors.

---

## 6. Components

### Card (`.box`)
```css
border: 1px solid var(--sl-border);
border-radius: 4px;
padding: 1.25rem;
background: var(--sl-bg-card);
```

### Card alt (`.box-m`)
Same as `.box` but with `background: var(--sl-bg-alt)`.

### KPI Display
```html
<div class="box text-center py-3">
  <p class="kpi text-[1.4rem]" style="color:#F48B4A">€14.2B</p>
  <p class="kpi-label">PORTFOLIO</p>
</div>
```
- Number: JetBrains Mono, bold, brand color
- Label: JetBrains Mono, 0.55rem, uppercase, tracking 0.1em, muted

### Takeaway (MANDATORY)
```html
<div class="takeaway">
  <p>La frase clave que resume el insight del slide en una línea.</p>
</div>
```
```css
.takeaway { border-top: 2px solid var(--sl-accent); padding-top: 0.85rem; margin-top: 1.25rem; }
.takeaway p { font-size: 0.75rem; font-weight: 600; color: var(--sl-text); }
```

### Data Row (`.row-l`)
```css
border-bottom: 1px solid var(--sl-border);
padding-bottom: 0.6rem;
margin-bottom: 0.6rem;
```
Last child: no border-bottom.

### Tag/Badge
```html
<span class="tag" style="background:rgba(244,139,74,0.1); color:#F48B4A">ACTIVO</span>
```

### Icon Box (`.ico-s`)
```css
width: 1.75rem; height: 1.75rem; border-radius: 4px;
display: flex; align-items: center; justify-content: center;
```
SVG inside: 0.9rem, stroke-width 1.75, stroke currentColor.

### Screenshot Frame
```html
<div class="screenshot-frame">
  <div class="browser-bar">
    <div class="dot dot-red"></div>
    <div class="dot dot-yellow"></div>
    <div class="dot dot-green"></div>
    <span class="ml-3 text-[.55rem] text-slate-400 mono">app.nfq.es/dashboard</span>
  </div>
  <img src="screenshot.png" alt="Description" loading="lazy">
</div>
```

---

## 7. Visualization Types

Every content slide MUST include one of these:

### Flow Diagram (`.flow-h`)
Horizontal connected boxes with arrows. Use for processes, pipelines.
```html
<div class="flow-h">
  <div class="flow-box">Input</div>
  <div class="flow-conn"></div>
  <div class="flow-box">Process</div>
  <div class="flow-conn"></div>
  <div class="flow-box">Output</div>
</div>
```

### Architecture Layers (`.arch-layer`)
Vertically stacked boxes connected by lines. Use for tech stacks.

### KPI Grid
2x2 or 4x1 grid of `.box` cards with `.kpi` + `.kpi-label`. Use for metrics.

### Data Table (`.tbl-wrap` + `.data-tbl`)
Wrap `<table class="data-tbl">` in a `<div class="tbl-wrap">` for rounded container with shadow. Headers mono uppercase, numeric columns right-aligned in JetBrains Mono. In Glass mode, the wrapper gets frosted treatment (blur + translucent bg + inset highlight). For simpler inline rows, use `.row-l`.

### Matrix / Multi-Axis Grid (`.matrix-wrap`)
Use for segmentation matrices, heatmaps, cross-tabulations. Container wraps a CSS grid with `.m-head` (header cells), `.m-cell` (data cells), and `.m-row-head` (row labels). Rounded 8px with shadow. In Glass mode, gets full frosted treatment matching cards.
```html
<div class="matrix-wrap" style="display:grid;grid-template-columns:120px repeat(N,1fr)">
  <div class="m-head" style="border-top:none">Label</div>
  <!-- ... more headers ... -->
  <div class="m-row-head">Row Name</div>
  <div class="m-cell">Cell content</div>
  <!-- ... more cells ... -->
</div>
```

### Capability Map
Grid of colored module boxes (brand colors at 20% opacity bg + 80% text). Use for platform overviews.

### Timeline
Connected steps with numbers/icons. Horizontal or vertical.

### Bar/Progress Visualization
Horizontal bars with percentage fills in brand colors. Use for comparisons.

### Screenshot in Browser Frame
`.screenshot-frame` with browser dots + image. Use for product demos.

---

## 8. Navigation

### Progress bar
Fixed top, 3px height, full width. Fill color: `--sl-progress`.

### Section tag
Fixed top-left (1.75rem top, 3rem left). JetBrains Mono, 0.6rem, muted. Shows current slide's `data-section` attribute.

### Section Navigator (`.sec-nav`) — recommended for 20+ slides
Fixed bar at `top: 1rem` (below the logo and section tag area). Contains one button (`.sec-nav-btn`) per section, labeled with short section names. Active section has 2px underline in accent color. Adapts to dark slides (`.on-dark`), Glass mode (frosted blur). Hidden on cover/closing slides. Buttons use `data-go-section` to navigate to first slide of each section.

### Nav bar
Fixed bottom-center. Pill shape with background `--sl-nav-bg`, border-radius 6px.
Contains: prev button, slide counter (mono, 0.6rem), next button, separator, theme toggle buttons.

### Transitions
```css
.slide {
  position: absolute; inset: 0;
  opacity: 0; transform: translateX(40px);
  transition: opacity .45s cubic-bezier(.25,1,.5,1),
              transform .45s cubic-bezier(.25,1,.5,1);
  pointer-events: none;
}
.slide.active { opacity: 1; transform: translateX(0); pointer-events: auto; }
.slide.prev { opacity: 0; transform: translateX(-40px); }
```

### Controls
- Arrow Left/Right: navigate
- Click anywhere (except nav bar): next slide
- Keyboard hint: `"← → Navigate"` in mono, fades after first interaction

---

## 9. Layout Rules

- **Slide padding:** `3.5rem 5.5rem` (generous margins for projection)
- **Max content width:** 68rem (`.si { width: 100%; max-width: 68rem; }`)
- **Content gap:** `gap-8` (2rem) between text and visualization columns
- **Section gap within text:** `gap-3` to `gap-5` between cards/elements
- **Grid columns:** Use `grid-cols-12` with `col-span-*` for precise layouts

---

## 10. Do's and Don'ts

### Do
- Always include a visualization — even a simple flow diagram is better than nothing
- Always include a takeaway — forces clarity of message
- Use KPI cards for any numeric data (never inline numbers in paragraphs)
- Use JetBrains Mono for all numbers, dates, and technical identifiers
- Keep cover and dividers dark — they create rhythm
- Use brand colors consistently for categorization
- Test readability when projected (arm's length rule)

### Don't
- No slides without visuals — text-only slides are banned
- No slides without takeaways — every slide must earn its place
- No generic colors — always use NFQ brand palette
- No heavy animations — smooth translateX transitions only
- No font mixing beyond Inter + JetBrains Mono
- No content below the takeaway line
- No more than 4 KPI cards per slide (cognitive overload)
- No tables with more than 8 rows (paginate or summarize)
