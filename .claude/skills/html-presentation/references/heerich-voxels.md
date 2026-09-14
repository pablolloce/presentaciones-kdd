# 3D Voxel Visuals — Heerich.js

Optional visual enhancement for cover slides, section dividers, and data visualizations. Generates 3D voxel scenes rendered as crisp, scalable SVG.

**When to use:** Cover heroes, section divider art, abstract data visualizations, ambient backgrounds. NOT for every slide — use sparingly for impact.

**When NOT to use:** Simple content slides, text-heavy slides, or when the presentation already has screenshots/diagrams as visuals.

---

## Integration

Add inside `<head>` alongside other CDN scripts:

```html
<script type="module">
import { Heerich } from 'https://esm.sh/heerich';
window.Heerich = Heerich;
</script>
```

### Safe SVG injection helper

Since `toSVG()` returns an SVG string, use `DOMParser` to safely inject it (never use `innerHTML` with generated markup):

```js
function injectSVG(targetEl, svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.tagName === 'svg') {
    targetEl.replaceChildren(svg);
  }
}
```

### Basic usage

```html
<script type="module">
document.addEventListener('DOMContentLoaded', () => {
  const engine = new window.Heerich({
    tile: [24, 24],
    camera: { type: 'oblique', angle: 315, distance: 20 },
    style: { fill: '#333', stroke: 'rgba(255,255,255,0.06)', strokeWidth: 0.5 }
  });
  engine.addBox({ position: [0, 0, 0], size: [6, 4, 3] });
  injectSVG(document.getElementById('voxel-target'), engine.toSVG({ padding: 20 }));
});
</script>
```

**Fallback:** If CDN is unavailable, the container simply stays empty. Always design the slide to work without the 3D visual (text content must stand alone).

---

## API Quick Reference

### Constructor
```js
new Heerich({
  tile: [w, h],           // pixel size per voxel face (default [40,40])
  camera: {
    type: 'oblique',      // or 'perspective'
    angle: 315,           // degrees (315 = classic isometric-ish)
    distance: 20          // depth projection distance
  },
  style: { fill, stroke, strokeWidth }  // default face style
})
```

### Shapes
```js
engine.addBox({ position: [x,y,z], size: [w,h,d], style, mode })
engine.addSphere({ center: [x,y,z], radius, style, mode })
engine.addLine({ from: [x,y,z], to: [x,y,z], radius, shape, style, mode })
engine.removeBox({ position: [x,y,z], size: [w,h,d] })   // carve out
```

### Boolean modes
- `'union'` (default) — add voxels
- `'subtract'` — carve out voxels
- `'intersect'` — keep only overlap
- `'exclude'` — XOR

### Styling
Per-face styles with optional coordinate callbacks:
```js
style: {
  default: { fill: '#1a1919', stroke: 'rgba(255,255,255,0.05)', strokeWidth: 0.5 },
  top:     { fill: '#F48B4A' },                          // static color
  front:   (x, y, z) => ({ fill: `hsl(${x * 15}, 60%, 50%)` }),  // procedural
  right:   { fill: '#E04870', opacity: 0.8 }
}
```

### Restyle existing voxels
```js
engine.styleBox({ position: [x,y,z], size: [w,h,d], style })    // restyle box region
engine.styleSphere({ center: [x,y,z], radius, style })           // restyle sphere region
engine.styleLine({ from: [x,y,z], to: [x,y,z], radius, shape, style })  // restyle line
```
These methods only modify styles of existing voxels — they do not add or remove voxels.

### Render
```js
const svg = engine.toSVG({ padding: 20 });
injectSVG(document.getElementById('target'), svg);
```

---

## Predefined Scenes

### 1. Cover Monolith — Architectural hero for cover slides

A tall geometric block with carved-out windows. Place on the right side of the cover slide (60% column).

```js
function renderCoverMonolith(targetId, accentColor = '#F48B4A') {
  const h = new Heerich({
    tile: [22, 22],
    camera: { type: 'oblique', angle: 315, distance: 18 },
    style: { fill: '#252322', stroke: 'rgba(255,255,255,0.06)', strokeWidth: 0.5 }
  });

  // Main mass
  h.addBox({ position: [0, 0, 0], size: [7, 10, 5] });

  // Carved windows (subtract)
  h.removeBox({ position: [1, 1, -1], size: [2, 2, 2] });
  h.removeBox({ position: [4, 1, -1], size: [2, 2, 2] });
  h.removeBox({ position: [1, 4, -1], size: [2, 3, 2] });
  h.removeBox({ position: [4, 5, -1], size: [2, 2, 2] });

  // Stepped top
  h.addBox({ position: [0, -2, 0], size: [4, 2, 3] });
  h.addBox({ position: [0, -4, 0], size: [2, 2, 2] });

  // Accent: colored top faces
  h.styleBox({
    position: [0, -4, 0], size: [2, 1, 2],
    style: { top: { fill: accentColor } }
  });
  h.styleBox({
    position: [0, -2, 0], size: [4, 1, 3],
    style: { top: { fill: accentColor, opacity: 0.6 } }
  });

  const target = document.getElementById(targetId);
  if (target) injectSVG(target, h.toSVG({ padding: 30 }));
}
```

**HTML container:**
```html
<div id="cover-voxel" style="width:100%;max-width:420px;margin-left:auto;opacity:0.85"></div>
```

---

### 2. Section Divider — Ascending Terraces

Minimalist stepped composition for section divider slides. Center-aligned below the section title.

```js
function renderSectionTerraces(targetId, accentColor = '#F48B4A') {
  const h = new Heerich({
    tile: [20, 20],
    camera: { type: 'oblique', angle: 315, distance: 16 },
    style: { fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.08)', strokeWidth: 0.5 }
  });

  // Three ascending platforms
  h.addBox({ position: [0, 4, 0], size: [10, 2, 6] });
  h.addBox({ position: [2, 2, 1], size: [7, 2, 4] });
  h.addBox({ position: [4, 0, 2], size: [4, 2, 2] });

  // Accent on top step
  h.styleBox({
    position: [4, 0, 2], size: [4, 1, 2],
    style: { top: { fill: accentColor } }
  });

  // Subtle front face tint on middle step
  h.styleBox({
    position: [2, 2, 1], size: [7, 2, 1],
    style: { front: { fill: 'rgba(255,255,255,0.08)' } }
  });

  const target = document.getElementById(targetId);
  if (target) injectSVG(target, h.toSVG({ padding: 24 }));
}
```

**HTML container:**
```html
<div id="section-voxel" style="width:280px;margin:2rem auto;opacity:0.7"></div>
```

---

### 3. KPI Bars — 3D Data Visualization

Voxel columns of varying heights. Use inside a data slide's visualization area. Pass data as array of `{ value, label, color }`.

```js
function renderVoxelBars(targetId, data) {
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = 2;
  const barDepth = 2;
  const maxHeight = 8;
  const gap = 1;

  const h = new Heerich({
    tile: [24, 24],
    camera: { type: 'oblique', angle: 315, distance: 18 },
    style: { fill: '#1a1919', stroke: 'rgba(255,255,255,0.06)', strokeWidth: 0.5 }
  });

  // Base platform
  const totalWidth = data.length * (barWidth + gap) - gap + 2;
  h.addBox({ position: [-1, 0, -1], size: [totalWidth, 1, barDepth + 2] });
  h.styleBox({
    position: [-1, 0, -1], size: [totalWidth, 1, barDepth + 2],
    style: { top: { fill: 'rgba(255,255,255,0.06)' } }
  });

  // Bars
  data.forEach((d, i) => {
    const barH = Math.max(1, Math.round((d.value / maxVal) * maxHeight));
    const x = i * (barWidth + gap);
    const y = -barH;

    h.addBox({ position: [x, y, 0], size: [barWidth, barH, barDepth] });

    // Color the top and front faces
    h.styleBox({
      position: [x, y, 0], size: [barWidth, barH, barDepth],
      style: {
        top: { fill: d.color },
        front: (bx, by, bz) => ({
          fill: d.color,
          opacity: 0.3 + 0.7 * ((by - y) / barH)  // gradient: darker at bottom
        })
      }
    });
  });

  const target = document.getElementById(targetId);
  if (target) injectSVG(target, h.toSVG({ padding: 20 }));
}

// Usage:
// renderVoxelBars('bars-target', [
//   { value: 85, label: 'IRRBB', color: '#F48B4A' },
//   { value: 62, label: 'FTP',   color: '#E04870' },
//   { value: 94, label: 'ALM',   color: '#9B59B6' },
//   { value: 78, label: 'LCR',   color: '#5B7FC7' },
// ]);
```

**HTML container:**
```html
<div id="bars-target" style="width:100%;max-width:360px"></div>
```

---

### 4. Background Pattern — Ambient Scattered Blocks

Floating geometric blocks as a subtle slide background. Low opacity, positioned absolutely behind content. Use on cover or special slides only.

```js
function renderBackgroundBlocks(targetId) {
  const h = new Heerich({
    tile: [18, 18],
    camera: { type: 'oblique', angle: 315, distance: 14 },
    style: { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.04)', strokeWidth: 0.5 }
  });

  // Scattered clusters at different depths
  const clusters = [
    { pos: [0, 0, 0], size: [3, 2, 2] },
    { pos: [6, 3, 4], size: [2, 3, 2] },
    { pos: [12, 1, 1], size: [2, 2, 3] },
    { pos: [3, 6, 6], size: [4, 1, 2] },
    { pos: [10, 5, 3], size: [2, 2, 2] },
    { pos: [16, 2, 5], size: [3, 3, 1] },
    { pos: [8, 0, 7], size: [1, 4, 2] },
  ];

  const colors = ['#F48B4A', '#E04870', '#9B59B6', '#5B7FC7', '#3B82F6'];

  clusters.forEach((c, i) => {
    h.addBox({ position: c.pos, size: c.size });
    // Tint top face with brand color at very low opacity
    h.styleBox({
      position: c.pos, size: c.size,
      style: {
        top: { fill: colors[i % colors.length], opacity: 0.15 }
      }
    });
  });

  const target = document.getElementById(targetId);
  if (target) injectSVG(target, h.toSVG({ padding: 40 }));
}
```

**HTML container (absolute behind content):**
```html
<div id="bg-voxels" style="position:absolute;inset:0;opacity:0.4;pointer-events:none;z-index:0"></div>
```

---

## Theme Integration

Heerich SVG respects CSS variables when used in static style objects. Use `var()` in fill/stroke for auto theme adaptation:

```js
style: {
  default: {
    fill: 'var(--sl-bg-card)',
    stroke: 'var(--sl-border)',
    strokeWidth: 0.5
  },
  top: { fill: 'var(--sl-accent)' }
}
```

**Caveat:** Functional styles `(x,y,z) => style` cannot use `var()` directly since they are evaluated at render time, not by CSS. For theme-aware procedural colors, read the computed style first:

```js
const accent = getComputedStyle(document.documentElement).getPropertyValue('--sl-accent').trim();
style: { top: (x, y, z) => ({ fill: accent, opacity: 0.5 + z * 0.1 }) }
```

---

## Guidelines

1. **Max scene complexity**: Keep scenes under ~200 voxels for fast rendering. The predefined scenes above are all under 150.
2. **Always set `opacity` on the container** (0.6-0.85) so voxels don't overpower text content.
3. **Tile size matters**: 18-24px for slide backgrounds, 22-26px for featured visuals. Larger tiles = more prominent grid.
4. **Camera angle 315** gives the classic architectural isometric look. Use 225 for left-facing compositions.
5. **Strokes**: Use very subtle strokes (`rgba(255,255,255,0.04-0.08)`) for the "smooth solid" look. Thicker strokes make the grid visible (useful for data viz, not for architectural art).
6. **Dark slides only**: These visuals work best on dark backgrounds (cover, divider). On light theme slides, invert to dark fills with light strokes — or skip voxels entirely.
7. **Fallback**: Always design the slide so it works without the 3D visual. Wrap the render call in a try-catch.
8. **Safe injection**: Always use `injectSVG()` helper (DOMParser) — never assign SVG strings with innerHTML.
