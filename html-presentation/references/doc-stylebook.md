# NFQ Doc Stylebook

Long-scroll HTML documents for NFQ advisory deliverables. Companion to `presentation-stylebook.md` (which covers slide decks). Templates: `doc-pov.html`, `doc-status.html`, `doc-playbook.html`, `doc-concept.html`.

## 1. Page anatomy (mandatory in every doc)

- `<header class="masthead">` — eyebrow (project + date), `<h1>`, lede paragraph, NFQ logo top-right (28x35px).
- `<nav class="toc">` — sticky on scroll (top: 1rem), mono uppercase section links, active section highlighted via IntersectionObserver.
- `<main class="doc-body">` — sections with class `doc-section`, each with `<h2 class="section-title">` and an optional `<p class="section-lede">`.
- `<footer class="doc-foot">` — NFQ logo, contact line ("nfq.es"), printed-on date, page-break-before.

Body max-width: 760px (reading column). Wider 1080px wrappers allowed for tables, charts, swimlanes — use `.full-bleed` modifier.

## 2. Typography

Identical to deck stylebook. Inter for prose; JetBrains Mono for labels, dates, monetary, formulas. **Never** serif (this is the deviation from Thariq Shihipar's reference gallery — we keep Inter as the headline face for consistency with NFQ deck output).

- `h1`: Inter 700, clamp(2rem, 4vw, 2.6rem), tracking -0.02em
- `h2.section-title`: Inter 600, 1.5rem, tracking -0.01em, NFQ Amber bottom-border 2px on `:hover` for ToC anchors
- `h3`: Inter 600, 1.05rem
- Body: Inter 400, 1rem, line-height 1.65, color `--nfq-text-sec`
- Eyebrow / labels: JetBrains Mono 600, 0.7rem, uppercase, tracking 0.14em, color `--nfq-text-muted`
- Pull quote: Inter 500 italic, 1.25rem, line-height 1.4, color `--nfq-text`, left-border 3px NFQ Amber, padding-left 1.25rem

## 3. Color tokens (CSS variables, identical to decks)

```css
:root {
  --nfq-bg:           #FAFAF8;   /* warm paper */
  --nfq-bg-surface:   #FFFFFF;
  --nfq-text:         #0E0E0E;
  --nfq-text-sec:     #2C2C2C;
  --nfq-text-muted:   #6B6B6B;
  --nfq-rule:         #E5E1D8;
  --nfq-amber:        #F48B4A;
  --nfq-coral:        #E04870;
  --nfq-violet:       #9B59B6;
  --nfq-steel:        #5B7FC7;
  --nfq-azure:        #3B82F6;
  --nfq-success:      #10B981;
  --nfq-warning:      #F59E0B;
  --nfq-danger:       #F43F5E;
}
[data-theme="dark"] {
  --nfq-bg:           #0E0E0E;
  --nfq-bg-surface:   #181816;
  --nfq-text:         #F5F5F0;
  --nfq-text-sec:     #C7C7C2;
  --nfq-text-muted:   #8A8A85;
  --nfq-rule:         #2A2A28;
}
[data-theme="glass"] {
  --nfq-bg:           rgba(250,250,248,0.62);
  --nfq-bg-surface:   rgba(255,255,255,0.55);
  /* backdrop-filter: blur(20px) saturate(180%); applied per-component */
}
```

## 4. Layout primitives (cross-template)

- `.callout` — boxed aside, 1.25rem padding, 8px radius, accent left-border 3px (Amber default; `.warn` → Coral, `.info` → Steel)
- `.pull-quote` — see typography
- `.kpi-band` — horizontal flex of 3-5 KPIs with `.kpi-num` (mono 1.6rem) + `.kpi-label` (mono uppercase 0.6rem)
- `.data-tbl` — same as deck (headers uppercase mono, numeric columns right-aligned)
- `.timeline-h` — horizontal milestones (used in playbook + status)
- `.swimlane` — multi-row horizontal bars (playbook only)
- `.severity-dot` — 8px circle: success / warning / danger color
- `.cite` — superscript footnote ref → matched at end-of-section under `.cite-list`
- `.formula` — KaTeX block with `--nfq-rule` border-top + bottom (concept only)
- `details.faq-item` — collapsible Q&A with `<summary class="faq-q">` (Q letter prefix in mono amber, `+` toggle indicator) and `<div class="faq-a">` body. Pattern adapted from `thariqs.github.io/html-effectiveness/14-research-feature-explainer.html`. Use for "Lo que nos pregunta el cliente" sections in POVs and "Casos límite ampliados" in concepts. Print CSS forces `[open]` via `beforeprint` JS listener so all answers appear in PDF.

## 5. Navigation (ToC)

JS auto-generates the sticky ToC from `<h2.section-title>` elements. Active section detected via IntersectionObserver. Click scrolls smoothly. Mobile: collapses to a `<details>` accordion below the masthead.

## 6. Theme toggle

Identical pattern to decks: three buttons (Light / Dark / Glass) in the masthead top-right, set `data-theme` on `<html>`, persist in `localStorage` under key `nfq-doc-theme`. Glass theme requires a soft photographic gradient backdrop on `body::before`.

## 7. Print CSS (mandatory)

```css
@media print {
  :root { color-scheme: light; }   /* always force light for print */
  nav.toc, .theme-toggle, footer.doc-foot .ext-link { display: none; }
  .masthead { padding: 0 0 1cm; border-bottom: 0.5pt solid #000; }
  .doc-section { break-inside: avoid; }
  .pull-quote, .callout, .kpi-band { break-inside: avoid; }
  a { color: #000; text-decoration: underline; }
  body { background: white; color: black; font-size: 10.5pt; }
  @page { size: A4; margin: 1.6cm 1.8cm; }
}
```

## 8. Banned (same anti-patterns as decks)

No strikethrough comparison tables. No decorative charts without source. No fake KPI grids without citation. No long bullet lists pretending to be visualization. No NFQ vendor-shaming quadrants.

Doc-specific additions:
- **Walls of prose without scannable structure.** Every section needs at least one of: callout, pull-quote, KPI, table, list. Pure paragraph blocks > 200 words must be broken up.
- **Lorem-ipsum samples shipped with the template.** Never. Always realistic NFQ sample content (BBVA / Santander / generic ALM).

## 9. Sample content rule

Every template ships with a realistic NFQ sample. Do not ship lorem-ipsum templates — reviewers cannot judge layout against placeholder Latin.

### Sample distribution rule

When producing multiple docs in a session, distribute samples across the 6 NFQ Advisory sectors. Never anchor every sample on risk topics (IRRBB / FTP / capital). The shipped v1 covers WAM, Capital, Banca Empresas, Seguros — leaving Banca Minorista and Banca Mayorista as targets for v1.1 sample rotation.

### Sample topic library (defensible, citable)

Use this catalog when applying a template. Each topic has been validated as both relevant for NFQ Advisory and supportable with public regulation, public market data, or NFQ's internal methodology. No fabrication required — every claim should map to one of: EBA/BCBS/IFRS regulation, BdE/CNMV/DGSFP supervisión, ECB/EIOPA monitoring, sector survey (Inverco, AEB, ICEA, Oliver Wyman, Moody's Analytics), or NFQ's labelled methodology.

| Sector | POV (thought leadership) | Status (weekly) | Playbook (kickoff) | Concept (didáctico) |
|---|---|---|---|---|
| **Banca minorista** | El coste oculto del IRRBB en la rentabilidad del retail español | Implementación nuevo modelo scoring crediticio | Programa de digitalización oficinas Tier-2 | NMD duration y deposit beta — fundamentos |
| **Banca mayorista** | Repos, RWA y el coste oculto de la financiación interbancaria | Optimización RWA cartera repo Tier-1 | Rebuild plataforma de tesorería corporate | Standardised approach RWA — fundamentos |
| **Banca empresas** | El cliente empresa ya no quiere productos: cash management embebido | Rollout pricing comercial dinámico | Transformación cash management (sample v1) | Working capital cycle: DSO, DPO, DIO |
| **Payments** | El nuevo mapa de pagos B2B en España: instant + R2P | Rollout SCT Inst empresas, semana N | Programa SEPA Instant → embedded finance | Interchange fees mechanism EU |
| **Seguros** | El reset de la rentabilidad vida-ahorro tras IFRS 17 | Implementación reporting Solvencia II Pillar 3 | Adopción IFRS 17 en aseguradora mid-tier | CSM bajo IFRS 17 (sample v1) |
| **Wealth & AM** | Mid-market WAM ibérico: ventana 3-5 años (sample v1) | Lanzamiento nueva propuesta gestión discrecional | Programa transformación banca privada Tier-2 | Sharpe ratio: fundamentos y trampas |

### Numbers and citations

When samples include numeric data, cite the source via `<a class="cite" href="#cite-N">`. Acceptable sources by sector:

- **Risk / regulatory**: EBA GL 2018/02, BCBS d368, EBA RTS 2022/05/19, EBA stress test methodology, BCBS TLAC standard
- **Solvency / ICAAP**: BdE Memoria de Estabilidad Financiera, ECB SREP guidelines, EBA SREP framework
- **Insurance**: IFRS Foundation IFRS 17 standard, EIOPA Solvency II framework, DGSFP guías, ICEA estadísticas
- **WAM / IIC**: Inverco estadísticas trimestrales, APFIPP boletín mensual, CNMV Plan de Actividades, Oliver Wyman European Wealth Management Survey
- **Payments**: ECB SEPA reports, EBA PSD2 RTS, Banco de España estadísticas pagos minoristas
- **Estimaciones NFQ**: válidas si se etiquetan explícitamente como tales y se contextualiza con muestra de proyectos (n &gt; X)

NFQ-internal methodologies (Marco IRRBB, Marco FTP, Marco IFRS 17, Marco WAM, etc.) son citables como referencia interna sin URL.
