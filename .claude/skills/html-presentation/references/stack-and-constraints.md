# Stack and constraints

## Default stack
- single self-contained HTML file
- Tailwind CSS v3 via Play CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- custom Tailwind config via `tailwind.config = { theme: { extend: { ... } } }` in a `<script>` tag
- vanilla JavaScript (no frameworks)
- CSS-only animations when possible; JS for IntersectionObserver reveals and slide navigation
- fonts via Google Fonts `<link>` tags
- Chart.js only if charts are needed
- Heerich.js (optional) for 3D voxel SVG visuals on cover/divider slides — see `references/heerich-voxels.md`
- Three.js (optional) for interactive/animated 3D via WebGL — architecture layers, particle networks, hero objects — see `references/threejs-scenes.md`

## Tailwind CDN — critical
**Always** use the Play CDN script tag, **never** a CSS `<link>` to a Tailwind .css file (it doesn't exist as a standalone CSS file on CDN and will silently fail, producing unstyled output).

```html
<!-- CORRECT -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- WRONG — will break styling completely -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.x/dist/tailwind.min.css" rel="stylesheet">
```

## Logo handling
- **Preferred**: SVG `<symbol>` + `<use href>` pattern. Define the logo once in a hidden SVG block, reuse everywhere with `<use>`.
- **Fallback**: `<img src="brand-logo.png">` when no SVG source is available.
- **Never** attempt to recreate a client logo as hand-coded SVG paths — it will look wrong. Use the actual asset file.

```html
<!-- Define once (hidden) -->
<svg style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="logo" viewBox="...">...</symbol>
</svg>

<!-- Reuse everywhere -->
<svg class="w-12 h-auto"><use href="#logo"/></svg>
```

## JavaScript safety
- Use safe DOM methods: `createElement`, `textContent`, `appendChild`.
- **Never** use `innerHTML` with dynamic content — security hooks will flag it.
- For static HTML templates, build with DOM methods or use template literals assigned to safe sinks.

## Images in presentations
- When including screenshots or local images, **embed them as base64 data URIs** in the HTML to ensure PDF/PPTX export works with `file://` protocol. Safari blocks `canvas.toDataURL()` on canvases that rendered cross-origin images, and `file://` treats ALL local images as cross-origin.
- Use a build step or inline script to convert: `<img src="data:image/png;base64,...">`
- This makes the HTML self-contained (~1-3MB larger) but eliminates all export security errors.

This is also documented in SKILL.md under "Core rules" and "Navigation & Export".

## Avoid
- React / Vue unless the user explicitly wants framework code
- Tailwind v4 CDN (incompatible API)
- Framer Motion
- ESM imports / importmaps
- anything requiring a local build step for a single-file artifact
- `innerHTML` for DOM construction

## html2canvas known issues
The template's export system (PDF, IMG, PPTX) uses html2canvas which has rendering limitations:
- **`letter-spacing` and `word-spacing`** cause justified text artifacts with huge gaps between characters. The template injects a temporary CSS reset (`letter-spacing: normal !important; text-align: left !important`) before capture and removes it after.
- **SVG `<use href>` references** are not rendered — the template inlines the symbol paths before capture and restores them after.
- **Complex SVG gradients** may not render. Prefer simpler fills for export-critical elements, or accept minor visual differences in PDF output.
- **Cross-origin images** (file:// protocol) taint the canvas — embed images as base64 data URIs (see "Images in presentations" above).

These workarounds are built into the template's export handlers. No action needed when using the template as-is.

## Principle
If the artifact is meant to open directly in a browser, optimize for reliability first. Fancy and broken is just embarrassment with gradients.
