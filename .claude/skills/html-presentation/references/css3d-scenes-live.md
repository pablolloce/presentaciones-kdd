# CSS-3D Scenes — Live Mode (no WebGL, no Three.js)

**Pair with:** `presentation-template-live.html`
**Sister doc for export mode:** `threejs-scenes.md` (export-safe template still uses Three.js)

The live template ships a CSS-3D + SVG scene engine — zero WebGL, zero Three.js dependencies, zero shader compilation, zero `requestAnimationFrame` loops. Every visual is a DOM tree composited by the browser. This makes the deck:

- **Capture-friendly.** Playwright headless screenshots get pixel-identical frames; no async shader compilation or transmission render targets to worry about.
- **iPad-friendly.** No GPU shaders to fall back from; CSS animations run on the compositor thread at 60 fps even on a 2018 iPad Pro.
- **Lightweight.** ~25 KB of CSS + JS replace ~250 KB of Three.js + addons, and the cold start is instant.
- **Theme-reactive.** Every scene reads `--sl-dark-accent` from the active theme; switching themes re-colours the scenes without rebuilding them.

If you need real WebGL refraction or shader-based GPGPU effects, switch to the export template's Three.js engine — the live template no longer ships it.

---

## How the engine is wired

The template exposes `window.NFQ3D` with a `registry` mapping scene kinds to builder functions and a `scenes` object listing currently mounted instances. Mount any scene by adding a div with `data-brand-scene="<kind>"` to a slide. The bootstrap function picks the matching builder at load and constructs the DOM tree in place.

```html
<div id="brand-hero-3d"      data-brand-scene="hero"          style="position:absolute;inset:0"></div>
<div id="brand-divider-3d-1" data-brand-scene="particles"     style="position:absolute;inset:0;opacity:0.55;pointer-events:none;z-index:0"></div>
<div                       data-brand-scene="tunnel"        style="position:absolute;inset:0;opacity:0.7"></div>
<div                       data-brand-scene="energy"        style="position:absolute;inset:0;opacity:0.85"></div>
<div                       data-brand-scene="riskSurface"   style="position:absolute;inset:0"></div>
<div                       data-brand-scene="balanceFold"   style="position:absolute;inset:0"></div>
<div                       data-brand-scene="flowGraph"     style="position:absolute;inset:0"></div>
<div                       data-brand-scene="dataMonolith"  style="position:absolute;inset:0"></div>
```

Unknown `data-brand-scene` values log a warning but do not break the page. WebGL availability is irrelevant — the scenes are pure CSS/SVG.

**Scene continuity** is wired via CSS: `[data-brand-scene]` has a `.6s` opacity transition, and `.slide:not(.active) [data-brand-scene] { opacity: 0 }` fades scenes in and out as slides change.

**Capture mode**: append `?capture=true` to the URL. The bootstrap adds a `capture-mode` class to `<body>`, which a final block of CSS uses to set `animation: none` on every scene-element. `capture-slides.mjs` already adds the URL flag automatically when running against the live template.

---

## Scene catalogue

### `hero` / `holocube` / `monolith` — Holographic Cube

CSS 3D cube (`transform-style: preserve-3d`, six faces with `radial-gradient + backdrop-filter` for refraction-like translucency), three rotating gimbal rings on misaligned axes (`rotateX/Y/Z` keyframes), pulsing core (radial-gradient `filter: blur`), over-bright nucleus (white sphere with accent shadow), 32 halo dots orbiting on individual angles. Pure CSS animation; the `holoCubeSpin` keyframe rotates the whole cube on Y; rings have their own keyframes that compose tilt + spin without latching.

```js
NFQ3D.builders.buildHoloCube(mount, { haloCount: 32 });
```

### `particles` / `constellation` — Constellation Field

DOM dots (~70) absolutely positioned with random initial coordinates; each animates on a 4-keyframe `cstaFloat` cycle that translates through random offsets defined in CSS variables (`--x1..--y3`). Anchor nodes (~6) are larger white spheres that pulse on a separate keyframe. Static SVG-style chord lines connect near pairs, animated only via opacity flash. Visually equivalent to a Three.js Points field but composited natively by the browser.

```js
NFQ3D.builders.buildConstellation(mount, { count: 70, anchors: 6 });
```

### `tunnel` — Light Tunnel

14 receding rings drawn as `border-radius: 50%` divs, each animated on a 6-second loop translating from `translateZ(-3000px)` to `translateZ(300px)` with staggered animation-delay. Container has `perspective: 600px` so the rings actually recede in z. 30 streak particles overlay the tunnel for forward-motion feel.

```js
NFQ3D.builders.buildLightTunnel(mount, { ringCount: 14 });
```

### `energy` — Energy Field

Four large blurred gradient blobs (`filter: blur(80px); mix-blend-mode: screen`) drift independently on 22-34 second loops with staggered delays. Pure CSS. Pairs nicely with `.bg-aurora` and `.bg-grid-anim` for layered ambient backgrounds.

```js
NFQ3D.builders.buildEnergy(mount);
```

### `riskSurface` — IRRBB Heatmap (3D Isometric)

SVG isometric grid built from 14×14 cells. Each cell is three polygons (top diamond + right side + left side) with colours interpolating between azure/violet/accent based on a Gaussian centre weight. Top diamond pulses on a 4-second `riskBreath` keyframe with random per-cell delay. Visually similar to a Three.js extruded grid but renders in 1ms instead of compiling shaders.

```js
NFQ3D.builders.buildRiskSurface(mount, { rows: 14, cols: 14 });
```

### `balanceFold` — ALM Stacked Cylinders

Two CSS 3D cylinders made of stacked discs. Each disc is a div with `border-radius: 50% / 14px` (creating an elliptical top edge that reads as 3D when the cylinder rotates). Cylinder rotates on a slow Y-axis keyframe; each band has a brightness pulse with staggered delay. Asset cylinder rotates one direction, liability the other.

```js
NFQ3D.builders.buildBalanceFold(mount, {
  asset: [0.25, 0.40, 0.55, 0.78, 0.95, 0.78, 0.50, 0.30],
  liab:  [0.45, 0.60, 0.85, 0.95, 0.65, 0.40, 0.25, 0.15],
});
```

### `flowGraph` — Hub-and-spokes with Flowing Pulses

SVG with central hub circle + 7 nodes around the perimeter + curved arcs (quadratic Bézier paths) connecting them. Each arc has `stroke-dasharray: 6 18` and an animated `stroke-dashoffset` keyframe that creates the "flowing pulse" travelling along the curve. Nodes pulse on a separate `flowNodePulse` keyframe. The hub gets `drop-shadow` glow.

```js
NFQ3D.builders.buildFlowGraph(mount, { nodeCount: 7 });
```

### `dataMonolith` — Holographic Cube with KPI Bars Inside

Same cube structure as `holocube`, but the `holo-core`/`holo-nucleus` are replaced by a stack of `data-bar` divs. Each bar's width is set from a value in `options.data`; bars pulse with staggered delay. The cube spins around them.

```js
NFQ3D.builders.buildDataMonolith(mount, {
  data: [0.4, 0.6, 0.85, 0.95, 0.7, 0.55, 0.3],
});
```

---

## Why CSS-3D over Three.js

Three.js gives you genuinely real refraction (`transmission`), iridescence, shader-based GPGPU compute, and HDRI-equivalent environment maps. None of those mattered for a financial advisory deck:

- **Audience attention** is on the slide content, not the visual layer. A 3D-rendered crystal is impressive for 15 seconds; the same crystal in CSS is impressive for 15 seconds. The marginal gain isn't worth the cost.
- **Capture reliability** matters more than peak fidelity. Playwright screenshots of a CSS-3D scene are deterministic; screenshots of Three.js scenes occasionally lose the transmission render target or catch a frame mid-shader-compile.
- **Cold start** in a sales meeting matters. CSS-3D is instant; Three.js takes ~600ms on a fresh tab to compile shaders before the hero is visible.
- **iPad fallback** is automatic. CSS animations run on the compositor; no `transmission` to fall back from.
- **Bundle size**. The live template is now ~140 KB total (HTML + CSS + JS); the Three.js variant was ~390 KB.

The export template still ships Three.js for cases where you genuinely need WebGL — extruded data terrains, custom GPGPU particle physics, real reflections on metallic logos. For everything else the live template handles, CSS 3D wins.

---

## Guidelines

1. **Reserve heroes for 1-3 slides.** CSS 3D is cheap, but visual saturation still fatigues the eye.
2. **Stack scenes with the visual primitives palette.** Aurora background + animated grid + energy blobs + a flow graph all on the same slide is fine — the browser composites them on the GPU.
3. **Capture mode (`?capture=true`) freezes every animation** by setting `animation: none` on every scene-class via a single CSS block. No JS hooks needed.
4. **Theme reactivity is automatic** for everything that uses `var(--sl-dark-accent)`. The flow graph, holocube halo dots, and tunnel rings all update on theme switch.
5. **For real WebGL needs, use the export template.** Don't try to bolt Three.js back onto the live template — the two engines are not designed to coexist.
