---
name: html-presentation
description: Capa de implementación de las presentaciones HTML de un solo fichero de este repositorio: decks de slides y documentos long-scroll. Úsala cuando haya que escribir o editar el HTML de una presentación, y como referencia de la anatomía de slides, primitivas de CSS y sistema de exportación. La orquestación del encargo completo la lleva `presentacion-corporativa`; la dirección creativa, `frontend-design`.
---

Decks de slides y documentos long-scroll que se abren directamente en el navegador, sin build ni
servidor. Estética de consultoría, marca definida en `brand/brand.json` y aplicada con
`scripts/apply-brand.mjs`.

> Las plantillas de `references/` son **solo lectura**. Para un encargo concreto se copian con
> `node scripts/new-deck.mjs` y se edita la copia en `presentations/`.

## FORMATO PRINCIPAL — deck sobre lienzo

**Por defecto, todo deck de este repositorio usa `references/deck-stage.html`.** Lienzo fijo de
1600×900 escalado al viewport, tipografías Fraunces + Inter + JetBrains Mono incrustadas, cero
dependencias de red, co-marca cliente | nfq.

Antes de escribir o editar un deck con este formato, lee
**`references/deck-stage-stylebook.md`**: ahí está la anatomía de slide, la escala tipográfica,
los tokens de color, el catálogo de componentes y los anti-patrones.

```bash
node scripts/new-deck.mjs "<Título>" --format deck --cliente <id>
```

Los formatos que siguen son secundarios y solo se eligen cuando el encargo lo pide de forma
explícita: `deck-export` cuando hace falta exportación a PPTX editable, `deck-live` para
escenas 3D, y los cuatro `doc-*` para documentos de lectura larga.

## STEP 0 — Choose template upfront (secondary formats)

Before reading anything else, ask the user TWO questions in order:

**Q1 · Format family:**
> "¿Es un **deck de slides** (cover + section dividers + slide-by-slide) o un **documento long-scroll** (artículo, status report, playbook, concept explainer)?"

**Q2 (if deck) · Output medium:**
> "¿Para **exportar a PDF/PPTX** o para **presentar en pantalla** con efectos visuales avanzados?"

**Q2 (if doc) · Doc type:**
> "¿Qué tipo de doc? **POV** (thought leadership), **Status report** (weekly cliente), **Playbook** (plan / metodología) o **Concept explainer** (didáctico financiero)?"

Then pick the matching template:

| User intent | Template |
|---|---|
| **Deck · cualquier presentación (por defecto)** | **`references/deck-stage.html`** |
| Deck · hace falta PPTX editable | `references/presentation-template.html` |
| Deck · Live on-screen, pitch, demo, conference | `references/presentation-template-live.html` |
| Doc · POV / thought leadership | `references/doc-pov.html` |
| Doc · Weekly client status report | `references/doc-status.html` |
| Doc · Implementation playbook / methodology | `references/doc-playbook.html` |
| Doc · Concept explainer (didáctico financiero) | `references/doc-concept.html` |

**Browse all formats with the user:** `references/gallery.html` is a visual index of all 6 templates organized by commercial objective (Pitch / Análisis / Proyecto). Open it when format choice is unclear.

**When in doubt for decks → use the export template.** A deck that looks slightly less flashy on screen but exports perfectly is worth more than a stunning live deck the client cannot take home.

The two **deck** templates share the same slide markup, CSS variables, navigation, theme toggle, and export buttons. They differ only in: importmap (live preloads three.js addons), title suffix (`(Live)`), and a visible LIVE chip. Structural changes to slide anatomy, theme tokens, or nav must be applied to both files to prevent drift.

The four **doc** templates share the NFQ tokens, theme toggle (Light/Dark), NFQ logo, and print CSS — but each has its own anatomy specific to the deliverable type. See `references/doc-stylebook.md` for cross-doc rules.

## CRITICAL: For slide decks, ALWAYS read these files first
1. Read the chosen template (`presentation-template.html` OR `presentation-template-live.html`) — this is the STARTING TEMPLATE. Copy its structure, CSS, navigation system, and theme toggle. Do NOT invent your own slide deck format.
2. Read `references/presentation-stylebook.md` — complete visual specs for components, visualizations, and patterns.
3. El isotipo no se escribe a mano: vive en `brand/logo.svg` y lo inyecta `scripts/apply-brand.mjs`
   dentro del bloque `<!-- brand:logo:start -->`. En el markup solo se referencia con
   `<use href="#brand-iso"/>`.

## Slide Deck Format (MANDATORY)

### Slide structure
Every slide follows this exact HTML pattern:
```html
<div class="slide slide-themed" data-section="Section Name">
  <div class="si">
    <div class="ex-num">Exhibit NN — Section</div>
    <div class="ex-title">Main insight title here</div>
    <p class="ex-sub">Supporting context text</p>
    <!-- Content: 40/60 or 60/40 flex layout with visualization -->
    <div class="takeaway"><p>Key insight in one sentence.</p></div>
  </div>
</div>
```

### Slide types
- **Cover** (class `slide-dark`, ALWAYS dark): logo + date + hero title + accent line + subtitle + capability map
- **Section divider** (class `slide-div`, ALWAYS dark): section number + large title + accent line
- **Content slide** (class `slide-themed`): eyebrow + title + text/viz layout + takeaway
- **Data slide** (class `slide-themed`): eyebrow + KPI cards + data table + takeaway

### Mandatory per-slide elements
- **Isotipo**: `<svg><use href="#brand-iso"/></svg>`. Fijo 20x25px arriba a la izquierda en todas
  las slides; 28x35px en portada y cierre.
- **Visualization (with restraint)**: Most content slides should carry a visual element (flow diagram, KPI cards, architecture layers, timeline, capability map, screenshot frame, matrix). BUT a visual is only justified when it answers a real business question or compresses information that text cannot. **Editorial / thesis slides are allowed and encouraged** when the message is conceptual: a single bold statement (`.ex-title`), one paragraph of evidence, and a takeaway is a valid slide. Do NOT invent a chart to "fill" a slide.
- **Takeaway**: EVERY content slide MUST end with `.takeaway` — border-top 2px accent + bold 0.75rem sentence.

### Anti-patterns (BANNED — observed drift)
These patterns appear repeatedly in generated decks and the user has explicitly rejected them. Do not produce them, even when they would be technically valid HTML:

1. **Comparison tables with strikethrough on competitor columns.** No `text-decoration: line-through`, no greyed-out cells with red X marks, no "us vs them" tables where the rival column is visually killed. If a comparison is needed, use a neutral matrix (`.matrix-wrap`) with `✓` / `—` / `△` markers and equal visual weight per column.
2. **Decorative charts without an underlying business question.** Bar charts, donuts, sparklines, radar charts are forbidden unless: (a) the data is real or grounded in a citable source, AND (b) the chart answers a question the slide title poses. A chart that exists "to make the slide look quantitative" is banned.
3. **Fake KPI grids.** A 4-up grid of round numbers (87%, 3x, 12mo, €4.2M) with no source line is banned. Either cite the source under the KPI or remove it.
4. **Quadrant matrices with logos scattered around.** No "Gartner-style" 2x2 grids placing competitor logos in the lower-left quadrant. Use `.matrix-wrap` for capability dimensions, not for vendor mockery.
5. **Long bullet lists pretending to be a visualization.** A `<ul>` with 8+ items inside a `.box` is not a visual. Either turn it into a real flow/architecture diagram, group it into 3-4 thematic boxes (`.box` cards), or accept it as text and remove the visual ambition.
6. **Repeated identical layouts across consecutive slides.** Three slides in a row with the same KPI-grid + table pattern reads as a template, not a story. Vary the layout primitives slide to slide (KPI cards → flow → matrix → editorial → screenshot frame).

When in doubt: **a clean editorial slide beats a busy slide with fake data.**

### Theme toggle (MANDATORY)
Include Light/Dark/Glass toggle buttons in the nav bar. JavaScript switches CSS variables on `:root`.
Three themes defined: **Light** (default, corporate), **Dark** (Meridian Obsidian, warm), **Glass** (Apple Liquid Glass, frosted).
See `references/presentation-stylebook.md` § 4 "Theme System" for all CSS variable definitions per theme.

### Typography
- **Fonts**: Inter (UI) + JetBrains Mono (data/labels). Google Fonts CDN.
- **Eyebrow**: JetBrains Mono, 0.6rem, weight 600, tracking 0.12em, uppercase, `--sl-text-muted`
- **Title**: Inter, clamp(1.4rem, 2.6vw, 2rem), weight 700, line-height 1.2, `--sl-text`
- **Subtitle**: Inter, 0.85rem, `--sl-text-sec`, max-width 38rem
- **KPI number**: JetBrains Mono, 1.4rem+, weight 700, NFQ brand color
- **KPI label**: JetBrains Mono, 0.55rem, uppercase, tracking 0.1em, `--sl-text-muted`
- **Takeaway**: Inter, 0.75rem, weight 600, `--sl-text`

### Colores de marca (para visualizaciones)

La paleta la define `brand/brand.json` y se aplica con `scripts/apply-brand.mjs`. En el markup se
usan como utilidades Tailwind `brand-amber`, `brand-coral`, `brand-violet`, `brand-steel`,
`brand-azure`, o como hex literal cuando hace falta en un atributo SVG.

Usa **solo** esos cinco acentos para series de datos, marcadores de categoría y fondos de icono.
Nunca colores genéricos de Tailwind: rompen la marca y `apply-brand` no sabrá sustituirlos al
cambiar de identidad.

### CSS classes (defined in template)
- `.box` — card with 1px border, 4px radius, 1.25rem padding
- `.box-m` — card with alt background
- `.kpi` — large mono number
- `.kpi-label` — small uppercase mono label
- `.takeaway` — border-top 2px accent + bold text (MANDATORY)
- `.tag` — inline badge, 3px radius, uppercase 0.55rem
- `.row-l` — data row with bottom border separator
- `.ico-s` — 1.75rem icon square with subtle bg
- `.screenshot-frame` — browser chrome with dots + content area
- `.flow-h` / `.flow-box` / `.flow-conn` — horizontal flow diagrams
- `.arch-layer` / `.arch-conn` — architecture layer diagrams
- `.matrix-wrap` / `.m-head` / `.m-cell` / `.m-row-head` — multi-axis grid tables (segmentation matrices, heatmaps). Rounded container with shadow, frosted in Glass mode
- `.tbl-wrap` — data table wrapper with border, radius 8px, shadow. Wraps `.data-tbl`. Frosted in Glass mode
- `.data-tbl` — standard data table (headers uppercase mono, numeric columns right-aligned)

### Section Navigator (auto-generated, recommended for 20+ slides)
- Auto-generated from unique `data-section` attributes on slides
- `.sec-nav` — fixed at `top: 1rem`, shows section names as clickable mono buttons
- Active section gets underline accent. Adapts to Light/Dark/Glass automatically
- Hidden on cover and closing slides (where `data-section=""`)
- No HTML markup needed — JavaScript creates buttons automatically from slide attributes

### Navigation & Export
- Progress bar: 3px fixed top, color `--sl-progress`
- Section navigator: auto-generated from `data-section` attributes, fixed top, mono buttons per section. Active section underlined. Hidden on cover/closing slides (empty `data-section`).
- Section tag: fixed top-left, mono 0.6rem, next to NFQ logo
- Nav bar: fixed bottom-center, pill shape, prev/next + counter + theme toggle + export buttons
- Transitions: opacity + translateX(40px), 450ms cubic-bezier(.25,1,.5,1)
- Arrow keys to navigate. Space and Enter are NOT used for navigation (to avoid conflicts with Edit/Notes modes).
- **Language toggle** (buttons "ES" / "EN"): Switches all slide text between Spanish and English. Define translations in a `translations` object: `{ 'Texto en español': 'English text', ... }`. The `applyLang()` function swaps text in `.ex-title`, `.ex-sub`, `.takeaway p`, `h1`, `h2`, and other text elements. Exports auto-detect the active language and use the matching pre-captured images.
- **PDF export** (button label "PDF"): When `_PRECAPTURED` exists, instantly assembles a PDF from pre-captured images via jsPDF. Fallback: `window.print()` (browser print dialog — better text rendering than html2canvas).
- **IMG export** (button label "IMG"): When `_PRECAPTURED` exists, instantly assembles a PPTX from pre-captured images. Fallback: html2canvas capture with `fixTextInline()` (inline text fix), `hideBase64Images()` (shrinks large base64 to prevent hangs), `foreignObjectRendering` (for SVG-heavy slides), and 15s timeout. Layout: 10 x 5.625".
- **PPTX export** (button label "PPTX"): When `_PRECAPTURED` exists, uses pre-captured images as full-bleed slides with addImage. Fallback: html2canvas capture + editable text overlays (eyebrow, title, takeaway positioned via `getRect()`). Layout: 10 x 5.625".
- **Image handling for exports**: When the presentation includes screenshots or local images, embed them as base64 data URIs (`<img src="data:image/png;base64,...">`) to ensure all exports work with `file://` protocol. The `hideBase64Images()` helper replaces large base64 `<img>` with placeholders during html2canvas capture to prevent hangs on 200KB+ images — **placeholders in PDF/IMG/PPTX export are a symptom of running the html2canvas fallback path with embedded screenshots, not a bug**. The fix is always to pre-capture (next bullet).
- **Pre-captured exports (MANDATORY when the deck contains embedded images)**: After creating any deck, ejecuta `scripts/capture-slides.mjs` to embed pixel-perfect slide images as `_PRECAPTURED`. PDF/IMG/PPTX buttons then bypass html2canvas entirely. Usage:
  ```
  node scripts/capture-slides.mjs <fichero.html> [--theme light|dark|glass] [--lang es|en] [--width 1280] [--height 720]
  ```
  **When to run automatically (do not ask first):**
  - Deck contains any `<img>` with embedded base64 (screenshots, logos, photos) — html2canvas will silently swap them for placeholders without pre-capture.
  - Deck contains Three.js / WebGL scenes — html2canvas cannot render WebGL canvases.
  - Deck contains backdrop-filter (Glass theme), complex SVG `<use>` references, or large data tables.
  - Any deck the user is going to send to a client — quality bar > skipped step.

  **When to skip:** never automatically. Only skip if the user explicitly says "no pre-capture" or the deck is a throwaway draft.

  **Valores por defecto:** `--theme light --lang es --width 1280 --height 720`; los flags ausentes
  toman esos valores. Ejecútalo **una vez por idioma activo**: `--lang es` puebla `_PRECAPTURED` y
  `--lang en` puebla `_PRECAPTURED_EN`; `getPrecaptured()` elige según `currentLang`. Vuelve a
  ejecutarlo después de cualquier edición de slides, o el array se desincroniza del HTML y la
  exportación entrega contenido caducado.

  Si Playwright no encuentra su Chromium (contenedores, CI), apunta a uno del sistema con la
  variable de entorno `CHROMIUM_EXECUTABLE`.
- Include `<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>`, `html2canvas@1.4.1`, and `jspdf@2.5.2` in the `<head>` for export support.

## Document Format (long-scroll, when output is a doc not a deck)

When STEP 0 routed to a `doc-*.html` template, the rules below apply. The slide-deck rules above do NOT — different anatomy, different mental model.

### CRITICAL: For docs, ALWAYS read these files first
1. Read the chosen doc template (`doc-pov.html` / `doc-status.html` / `doc-playbook.html` / `doc-concept.html`) — copy structure, tokens, theme toggle, footer.
2. Read `references/doc-stylebook.md` — shared visual rules (tokens, typography, primitives, print CSS, anti-patterns).
3. El isotipo lo inyecta `scripts/apply-brand.mjs` en el `<symbol id="brand-iso">`
   (variante monocroma `brand/logo-mono.svg`, que hereda el color del tema).

### Mandatory anatomy
- `<header class="masthead">` — eyebrow + h1 + lede + meta-line (sector, sponsor, reading time, etc.)
- `<nav class="toc">` (POV + Concept) — sticky, JS-generated from `<h2.section-title>` with IntersectionObserver active-section sync
- `<main class="doc-body">` with 4-7 `<section class="doc-section" id="...">` blocks. Each `<h2 class="section-title" data-num="§ NN · LABEL">`.
- `<footer class="doc-foot">` — institutional line + date

### Mandatory per-doc elements
- **NFQ logo** fixed top-left (28x35px). Inline SVG `<symbol id="nfq-iso">` + `<use href="#nfq-iso"/>`.
- **Theme toggle** Light/Dark fixed top-right. Persist in `localStorage` under `nfq-doc-theme`.
- **Citations**: every claimed datum gets a `.cite` superscript matched at end of section under `ol.cite-list`. No uncited numbers.
- **Sample content**: every doc ships with realistic NFQ sample content distributed across sectors. Lorem-ipsum forbidden. **Never anchor every sample on risk topics (IRRBB / FTP / capital)** — NFQ Advisory cubre 6 sectores; rotate samples across banca minorista, mayorista, empresas, payments, seguros y wealth & asset management.
- **Print CSS**: every doc has the `@media print` block from doc-stylebook § 7. PDF export = browser print (Cmd+P), NOT `scripts/capture-slides.mjs` (solo decks).

### Mandatory sections per doc type

**POV** (`doc-pov.html`):
- § 01 Contexto · § 02 Nuestra Visión (con `.pull-quote`) · § 03 Evidencia (`.kpi-band` + `.callout`) · § 04 Implicaciones para capacidades NFQ · § 05 Lecturas
- 2-column layout: 760px body + 280px sticky `aside.glossary` on viewports ≥ 1080px (collapses below body on narrow). Inline `<span class="term" data-term="X">` highlights matching `<dt data-g="X">` on hover.

**Status** (`doc-status.html`):
- KPI band (4 KPIs + trend tags) · § 01 Highlights (`ul.highlights` con status dots) · § 02 Shipped + § 03 In flight (`.data-tbl` con `.status-tag`) · § 04 Riesgos (`.severity-dot` table) · § 05 Decisiones (`ol.decisions` con `.dec-meta`) · § 06 Próxima semana · § 07 Velocity (inline SVG bar chart, current week en coral)
- Single-column layout, max-width 980px.

**Playbook** (`doc-playbook.html`):
- KPI band · § 01 Alcance (2-column scope in/out) · § 02 Hitos (SVG `.timeline-block`) · § 03 Workstreams (`.swimlane` con bars color-coded) · § 04 RACI (`table.raci` con R/A/C/I letters) · § 05 Riesgos · § 06 Open questions (`ol.open-q` con Q01-Qnn leaders)
- Print CSS uses **A4 landscape** (timeline + swimlane need horizontal space). Single-column, max-width 1080px.

**Concept** (`doc-concept.html`):
- Sticky ToC · § 01 Definición (con `.callout.info` regulatory quote) · § 02 Por qué importa · § 03 Cómo funciona (`.formula` blocks con KaTeX, `.formula .legend dl`) · § 04 Ejemplo trabajado (`.flow-diagram` SVG + `.data-tbl` con `tr.total`) · § 05 Casos límite (`.callout.warn`) · § 06 Referencias regulatorias
- Online dependency: KaTeX from `cdn.jsdelivr.net` — concept docs require an online first-render. Document this when shipping to clients.

### Doc-specific anti-patterns (in addition to deck anti-patterns)
- **Walls of prose without scannable structure.** Every section needs at least one of: callout, pull-quote, KPI, table, list. Pure paragraph blocks > 200 words must be broken up.
- **Lorem-ipsum samples shipped with the template.** Never. Always realistic NFQ sample content from a defined sector.
- **All samples in one sector.** When multiple docs are produced together, distribute topics across sectors (see doc-stylebook § 9).

### Visual gallery
`references/gallery.html` is the curated index of all 6 formats (2 deck + 4 doc) organized by commercial objective. **Open this with the user when format choice is unclear.** Each card includes screenshot + tag + when-to-use.

## Core rules
- HTML must open directly in a browser — no build step, no server.
- Usa el CDN de Tailwind (`<script src="https://cdn.tailwindcss.com">`). La llamada a
  `tailwind.config` va protegida con `if (typeof tailwind !== "undefined")`: si el CDN está
  bloqueado el deck se degrada, pero no rompe el resto del `<head>`. Para entrega en frío
  (sin red garantizada) exporta a PDF o PPTX con pre-captura.
- Configure Tailwind via `tailwind.config = { theme: { extend: { ... } } }` in a script tag.
- Use safe DOM methods in JS — never `innerHTML` for dynamic content.
- Keep proper accents in Spanish text (á, é, í, ó, ú, ñ).
- Cover and section dividers are ALWAYS dark, regardless of theme.
- Slide padding: 3.5rem 5.5rem. Max content width: 68rem.
- When including screenshots or external images, **embed as base64 data URIs** for `file://` compatibility. Safari blocks canvas export on cross-origin images, and `file://` protocol treats all local files as cross-origin.

## 3D Visuals (optional)

Two libraries available for 3D visuals. Choose based on the use case:

### Heerich.js — Static 3D voxel SVG (lightweight, reliable)
Best for: static geometric visuals, data bars, architectural patterns, PDF-export-critical slides.
Read `references/heerich-voxels.md` for integration, API, and 4 predefined scenes.

### Three.js — Interactive/animated 3D via WebGL (high-impact)
Two reference files, paired with the matching template (see STEP 0):

- **Export-safe (default):** `references/threejs-scenes.md`. Pinned `three@0.184.0`, dispose pattern, color management, fat-line diagrams. Se captura limpiamente con `scripts/capture-slides.mjs`. Use with `presentation-template.html`. Predefined scenes: Architecture Layers, Particle Network, Rotating Solid, Fat-Line Flow.
- **Live-only:** `references/css3d-scenes-live.md`. CSS-3D + SVG scene engine — holographic cube, gimbal rings, particle field, light tunnel, isometric heatmap, stacked cylinders, flow graph, energy field. Zero WebGL, zero Three.js, zero shader compilation. Use with `presentation-template-live.html`. Capture-friendly via `?capture=true` URL flag.

### Shared rules
- Only on dark slides (cover, divider, special). Skip on light content slides.
- Always design the slide to work without the 3D visual (graceful fallback).
- Heerich: use `injectSVG()` helper — never innerHTML. Keep under ~200 voxels.
- Three.js: always check `supportsWebGL()`. Pause animation on inactive slides. Call `disposeScene(ctx)` on teardown. Max 2-3 Three.js slides per deck.
- Never mix versions: addons must come from the same pinned three.js release as the core.

## Additional references
- `references/deck-stage.html` — **plantilla principal**: deck sobre lienzo 1600×900, autosuficiente.
- `references/deck-stage-stylebook.md` — **su estilobook**. Lectura obligatoria antes de tocar un deck.
- `references/design-system.md` — shared visual system, component library
- `references/stack-and-constraints.md` — Tailwind CDN rule, logo handling
- `references/interaction-patterns.md` — navigation, animation details
- `references/heerich-voxels.md` — 3D voxel scenes (Heerich.js) for cover/divider visuals
- `references/threejs-scenes.md` — Three.js export-safe scenes (architecture layers, particles, rotating hero, fat-line diagrams). Pair with `presentation-template.html`.
- `references/css3d-scenes-live.md` — CSS-3D + SVG scene engine for the live template (holographic cube, particle field, light tunnel, isometric heatmap, flow graph, etc.). Pair with `presentation-template-live.html`.
- `scripts/capture-slides.mjs` — pre-captura con Playwright, solo para decks. Auto-detects template mode and adjusts settle timing. **Deck-only** — docs use browser print for PDF.
- `scripts/capture-thumb.mjs` — captura de una sola PNG (miniaturas de la galería). Does not modify source HTML.
- `references/doc-stylebook.md` — long-scroll doc visual rules (tokens, typography, primitives, print CSS, anti-patterns). Read before any doc work.
- `references/doc-pov.html` — POV / thought leadership template (sample: WAM mid-market ibérico)
- `references/doc-status.html` — weekly client status template (sample: Output Floor Basilea III, semana 19)
- `references/doc-playbook.html` — implementation plan template (sample: transformación cash management Banca Empresas, 14 sem)
- `references/doc-concept.html` — concept explainer template with KaTeX (sample: CSM bajo IFRS 17, Seguros)
- `references/gallery.html` — visual index of all 6 formats by commercial objective. Open this with the user when format choice is unclear.
