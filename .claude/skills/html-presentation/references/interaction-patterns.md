# Interaction patterns

## Slide decks
Use when the user wants a presentation narrative — meant to be presented full-screen, one slide at a time.

### Required features
- **Arrow-key navigation**: Left/Right arrows, Space to advance
- **Progress bar**: fixed at top, gradient fill, width = current/total %
- **Slide counter**: "3 / 27" in the nav pill
- **Section indicator**: fixed top-left, shows current section name, auto-switches color on dark slides
- **Smooth transitions**: translateX(100px) → translateX(0) → translateX(-100px) with opacity fade. Use cubic-bezier(0.4, 0, 0.2, 1).
- **Hash navigation**: `#slide-N` in URL so specific slides can be shared/bookmarked
- **Touch support**: swipe left/right when easy to add

### Recommended features
- **Nav pill**: floating centered pill at bottom with prev/next buttons + counter. Dark glass style (rgba bg + backdrop-filter blur + subtle border).
- **Section divider slides**: between major sections. Large number + title + subtitle. Creates rhythm.
- **Keyboard hint**: small text below nav pill on first load, fades after interaction. "← → or Space to navigate"

### Slide structure
```
.presentation { height: 100vh; width: 100vw; overflow: hidden; }
.slide { position: absolute; inset: 0; opacity: 0; transform: translateX(100px); transition: all 0.6s; }
.slide.active { opacity: 1; transform: translateX(0); z-index: 10; }
.slide.prev { transform: translateX(-100px); opacity: 0; }
```

### Slide types
- **Cover slide**: dark background, brand logo, title, subtitle, year/date
- **Section divider**: large number + title + subtitle, minimal content
- **Content slide**: section-header-inline + subtitle + intro-text + component(s) + optional takeaway/callout
- **Content slide (alt)**: same but with alternate background color for rhythm
- **Dark exec slide**: dark bg for emphasis, highlighted quote with left border

### Edit mode (optional, recommended for proposals)
Toggle button (bottom-right) that activates `contentEditable` on all text elements. Dashed outline on editable elements, solid on focus. Persist changes to localStorage per slide. Useful for sales teams that want to customize before presenting.

```js
// Toggle pattern
el.contentEditable = editMode ? 'true' : 'false';
// Persist per slide
localStorage.setItem('deck-slide-' + index, slideContent.innerHTML);
```

## Scroll documents
Use when the artifact is more briefing or report than deck — meant to be read, not presented.

### Required features
- **Anchored sections** with id attributes for deep linking
- **Scroll reveal animations**: IntersectionObserver with threshold ~0.06-0.08, translateY(28px) + opacity fade
- **Progress bar**: fixed at top, width based on scroll position

### Recommended features
- **Sticky navigation**: glass bar that appears after scrolling past hero. Shows section links, highlights active section.
- **Active section tracking**: IntersectionObserver on section elements, toggle `.active` class on matching nav link
- **Metric cards and comparison bands**: KPI rows at the top of key sections
- **Restrained reveal animations**: only on `.reveal` elements, not everything. Stagger with transition-delay where useful.
- **Divider lines**: gradient separators between major sections

### Structure
Vertical flow of sections, each containing subsections. No absolute positioning. Natural document flow with generous whitespace (py-24 between sections).

## Dashboards / one-pagers
Use when the artifact should be glanceable — a single screen of key information.

### Required features
- **Strong top-line KPIs**: large numbers at the top
- **Clear grouping**: visual clusters of related information
- **One obvious visual hierarchy**: the eye should know where to start

### Recommended features
- Avoid overbuilding interactions that add no decision value
- Fixed viewport (no scroll) when possible
- Use color and size, not motion, to convey importance

## Choosing the mode
| Signal | Mode |
|--------|------|
| "presentación", "deck", "slides", "para presentar" | Slide deck |
| "documento", "scroll", "briefing", "report", "propuesta" | Scroll document |
| "resumen", "dashboard", "one-pager", "snapshot" | Dashboard |
| Client-facing, will be projected | Slide deck |
| Will be read on screen, shared as link | Scroll document |
| Ambiguous | Ask the user |
