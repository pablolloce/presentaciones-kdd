# 3D Scenes — Three.js (Export-Safe)

**Pair with:** `presentation-template.html`
**Sister doc for live mode:** `threejs-scenes-live.md` (post-processing, GLTF, OrbitControls, etc. — incompatible with `capture-slides.mjs`)

Optional visual enhancement for slide decks requiring lightweight 3D — translucent layer diagrams, particle backgrounds, rotating heroes, fat-line flow diagrams. All scenes here are designed to capture cleanly with Playwright (`capture-slides.mjs`) so the deck still exports to PDF/IMG/PPTX.

**When to use Three.js export-safe (not Heerich):**
- Interactive/animated 3D: rotating objects, particle systems
- Architecture layer diagrams with translucent stacked planes (e.g., Alquid platform layers)
- Premium covers and section dividers
- Anything that needs lighting, transparency, or smooth animation but must still render to PDF

**When to use the live variant (`threejs-scenes-live.md`):**
- Post-processing: bloom, depth of field, outline pass
- 3D model loading (GLTF/GLB)
- OrbitControls or any user-driven camera
- HDRI environment maps via PMREMGenerator
- Any custom shader work

**When to use Heerich instead:**
- Static geometric visuals (no animation needed)
- Maximum PDF fidelity (vector SVG)
- Light-theme slides where WebGL feels out of place

**When to use neither:**
- Standard content slides with flow diagrams, tables, KPIs — use CSS/HTML components

---

## Integration

Pin the three.js version to avoid silent breakage when esm.sh updates upstream. Bump deliberately, not accidentally.

```html
<script type="importmap">
{
  "imports": {
    "three": "https://esm.sh/three@0.184.0",
    "three/addons/": "https://esm.sh/three@0.184.0/examples/jsm/"
  }
}
</script>
<script type="module">
import * as THREE from 'three';
window.THREE = THREE;
window.dispatchEvent(new Event('three-ready'));
</script>
```

**Version policy:** review the pin every 6 months. Test capture-slides.mjs export after any bump.

### WebGL Detection & Fallback

Always wrap Three.js rendering with WebGL detection. If WebGL is unavailable (old GPU, projector, restricted browser), show a CSS gradient or Heerich SVG fallback.

```js
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}
```

### Canvas Setup Helper

Creates a Three.js renderer sized to its container, with proper pixel ratio and NFQ-compatible settings.

```js
function createThreeScene(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || !supportsWebGL()) return null;

  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(options.fov || 45, w / h, 0.1, 100);
  camera.position.set(...(options.cameraPos || [0, 2, 6]));
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,  // transparent background — slide bg shows through
    powerPreference: 'high-performance',
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Color management: linear → sRGB conversion happens at output.
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Tonemapping flattens harsh highlights and gives a premium "Apple" look.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer, container };
}
```

### Cleanup / Dispose

WebGL resources are not garbage-collected. If a deck has multiple Three.js slides (or the user re-renders on theme switch), undisposed geometries, materials, and textures leak GPU memory. Always provide a teardown.

```js
function disposeScene(ctx) {
  if (!ctx) return;
  ctx.scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((m) => {
        Object.values(m).forEach((v) => {
          if (v && typeof v === 'object' && 'isTexture' in v) v.dispose();
        });
        m.dispose();
      });
    }
  });
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  if (ctx.renderer.domElement.parentNode) {
    ctx.renderer.domElement.parentNode.removeChild(ctx.renderer.domElement);
  }
}
```

The `animateOnActiveSlide()` helper below returns a `stop()` function — pair it with `disposeScene(ctx)` when tearing down a slide.

### Slide-Aware Animation Loop

Only animate when the parent slide is active. Integrates with our slide navigation system.

```js
function animateOnActiveSlide(ctx, animateFn) {
  const slide = ctx.container.closest('.slide');
  let animId = null;

  function loop() {
    animId = requestAnimationFrame(loop);
    animateFn(ctx);
    ctx.renderer.render(ctx.scene, ctx.camera);
  }

  // Observer: start/stop animation based on slide visibility
  const obs = new MutationObserver(() => {
    const isActive = slide && slide.classList.contains('active');
    if (isActive && !animId) loop();
    if (!isActive && animId) { cancelAnimationFrame(animId); animId = null; }
  });

  if (slide) {
    obs.observe(slide, { attributes: true, attributeFilter: ['class'] });
    // Start immediately if already active
    if (slide.classList.contains('active')) loop();
  } else {
    // No slide wrapper (standalone demo) — just run
    loop();
  }

  return { stop: () => { if (animId) cancelAnimationFrame(animId); obs.disconnect(); } };
}
```

---

## Predefined Scenes

### 1. Architecture Layers — Stacked Translucent Planes

Interactive visualization of platform architecture layers (e.g., Alquid: Data → Engine → Agents → UI). Planes float with subtle vertical spacing, gently orbit. Each layer has its own NFQ brand color.

```js
function renderArchLayers(containerId, layers) {
  // layers: [{ label: 'Data Layer', color: '#F48B4A' }, ...]
  // Default layers if none provided:
  const defaultLayers = [
    { label: 'Infraestructura', color: '#5B7FC7' },
    { label: 'Motor de Cálculo', color: '#9B59B6' },
    { label: 'Capa de Agentes', color: '#E04870' },
    { label: 'Interfaz', color: '#F48B4A' },
  ];
  const data = layers || defaultLayers;

  const ctx = createThreeScene(containerId, { fov: 40, cameraPos: [3, 3, 5] });
  if (!ctx) return null;

  const { scene, camera } = ctx;
  const group = new THREE.Group();

  // Ambient + directional light
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);

  const planeW = 3.2;
  const planeD = 2.2;
  const gap = 0.65;
  const startY = -(data.length - 1) * gap / 2;

  data.forEach((layer, i) => {
    // Translucent plane
    const geo = new THREE.BoxGeometry(planeW, 0.08, planeD);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(layer.color),
      transparent: true,
      opacity: 0.55,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = startY + i * gap;
    group.add(mesh);

    // Edge wireframe for definition
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(layer.color),
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(mesh.position);
    group.add(wireframe);
  });

  scene.add(group);

  // Gentle orbit
  let angle = 0;
  animateOnActiveSlide(ctx, () => {
    angle += 0.003;
    group.rotation.y = Math.sin(angle) * 0.4;
    // Subtle float
    group.position.y = Math.sin(angle * 1.5) * 0.05;
  });

  return ctx;
}
```

**HTML container:**
```html
<div id="arch-3d" style="width:100%;height:320px;position:relative"></div>
```

**Note:** Layer labels should be placed as HTML overlays next to the container (not as 3D text), using our standard JetBrains Mono uppercase labels. This keeps text crisp and theme-aware.

---

### 2. Particle Network — Ambient Animated Background

Subtle floating particles with connecting lines. Use as a cover slide background for technology-focused presentations.

```js
function renderParticleNetwork(containerId, options = {}) {
  const particleCount = options.count || 60;
  const accentColor = options.color || '#F48B4A';
  const connectionDist = options.connectionDistance || 2.2;

  const ctx = createThreeScene(containerId, { fov: 50, cameraPos: [0, 0, 6] });
  if (!ctx) return null;

  const { scene } = ctx;

  // Particles
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const spread = 5;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    velocities.push({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.003,
    });
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: new THREE.Color(accentColor),
    size: 0.06,
    transparent: true,
    opacity: 0.7,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  // Connection lines (updated each frame)
  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(accentColor),
    transparent: true,
    opacity: 0.15,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  animateOnActiveSlide(ctx, () => {
    const pos = pointsGeo.attributes.position.array;

    // Move particles
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce within bounds
      for (let axis = 0; axis < 3; axis++) {
        const limit = axis === 2 ? spread * 0.5 : spread;
        if (Math.abs(pos[i * 3 + axis]) > limit) {
          const v = ['x', 'y', 'z'][axis];
          velocities[i][v] *= -1;
        }
      }
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // Rebuild connections
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < connectionDist * connectionDist) {
          linePositions.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
          linePositions.push(pos[j*3], pos[j*3+1], pos[j*3+2]);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  });

  return ctx;
}
```

**HTML container (absolute behind content):**
```html
<div id="particles-bg" style="position:absolute;inset:0;opacity:0.35;pointer-events:none;z-index:0"></div>
```

---

### 3. Rotating Solid — Geometric Hero Object

A slowly rotating geometric shape (icosahedron, torus knot, or octahedron) with MeshPhysical material. Use as cover slide accent or section visual.

```js
function renderRotatingSolid(containerId, options = {}) {
  const shape = options.shape || 'icosahedron';  // 'icosahedron' | 'torusKnot' | 'octahedron'
  const color = options.color || '#F48B4A';

  const ctx = createThreeScene(containerId, { fov: 40, cameraPos: [0, 0, 4] });
  if (!ctx) return null;

  const { scene } = ctx;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
  light1.position.set(2, 3, 4);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(new THREE.Color('#E04870'), 0.3);
  light2.position.set(-3, -1, 2);
  scene.add(light2);

  // Geometry
  let geo;
  if (shape === 'torusKnot') geo = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);
  else if (shape === 'octahedron') geo = new THREE.OctahedronGeometry(1.2);
  else geo = new THREE.IcosahedronGeometry(1.2, 0);

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.25,
    metalness: 0.4,
    clearcoat: 0.3,
    transparent: true,
    opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const wire = new THREE.Mesh(geo, wireMat);
  scene.add(wire);

  animateOnActiveSlide(ctx, () => {
    mesh.rotation.y += 0.004;
    mesh.rotation.x += 0.002;
    wire.rotation.copy(mesh.rotation);
  });

  return ctx;
}
```

**HTML container:**
```html
<div id="geo-hero" style="width:300px;height:300px;margin-left:auto"></div>
```

---

### 4. Fat-Line Flow Diagram — Line2 / LineGeometry

Standard `LineBasicMaterial` ignores `linewidth` outside WebGL2 on most platforms (rendering as 1px regardless). For visible thick lines — risk paths, ALM stress trajectories, capability flow arrows, architecture connections — use `Line2` from `three/addons`. Fat lines render as screen-space-aware quads, so the line width is consistent across viewports and exports cleanly via Playwright.

```js
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

function renderFlowLines(containerId, paths, options = {}) {
  // paths: [{ points: [[x,y,z], ...], color: '#F48B4A' }, ...]
  const ctx = createThreeScene(containerId, { fov: 40, cameraPos: [0, 0, 5] });
  if (!ctx) return null;

  const { scene, container } = ctx;
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const w = container.clientWidth;
  const h = container.clientHeight;

  paths.forEach((path) => {
    const geo = new LineGeometry();
    const flat = path.points.flat();
    geo.setPositions(flat);

    const mat = new LineMaterial({
      color: new THREE.Color(path.color),
      linewidth: options.linewidth || 4,  // px in screen space
      transparent: true,
      opacity: options.opacity || 0.85,
      worldUnits: false,
    });
    mat.resolution.set(w, h);

    const line = new Line2(geo, mat);
    line.computeLineDistances();
    scene.add(line);
  });

  // Static — render once, no animation loop needed.
  ctx.renderer.render(ctx.scene, ctx.camera);

  // Update LineMaterial resolution on resize.
  const onResize = () => {
    handleResize(ctx);
    scene.traverse((obj) => {
      if (obj.material && obj.material.isLineMaterial) {
        obj.material.resolution.set(container.clientWidth, container.clientHeight);
      }
    });
    ctx.renderer.render(ctx.scene, ctx.camera);
  };
  window.addEventListener('resize', onResize);

  return ctx;
}
```

**HTML container:**
```html
<div id="flow-lines" style="width:100%;height:280px"></div>
```

**Use case fit:** ideal for ALM/IRRBB stress paths, risk transmission diagrams, value-chain arrows. Pairs well with HTML labels positioned over key nodes — keep text crisp by avoiding 3D text.

---

## Theme & Color Integration

Read NFQ design tokens for Three.js materials. Two approaches depending on context:

### In apps consuming `@nfq/design-system` (Alquid, CapitalEngine, etc.)
```js
import { getTokenValues, onThemeChange } from '@nfq/design-system/utils/theme';

const { accent } = getTokenValues('accent');
const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(accent) });

// Auto-update materials on theme/accent switch
onThemeChange(() => {
  const { accent } = getTokenValues('accent');
  meshes.forEach(m => m.material.color.set(accent));
});
```

### In standalone HTML presentations (no npm)
```js
function getNfqColor(varName, fallback) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName).trim() || fallback;
}

const accent = getNfqColor('--sl-accent', '#F48B4A');
const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(accent) });
```

---

## PDF/PPTX Export

Three.js renders to Canvas, which html2canvas can capture. However:

1. **Before export**, render one clean frame with animation paused:
```js
renderer.render(scene, camera);
```

2. **For PPTX**, the canvas is captured as-is (raster image). Quality depends on `renderer.setPixelRatio()` — use `2` for sharp output.

3. **For PDF** (`window.print()`), Canvas elements print at screen resolution. This is acceptable but not as crisp as SVG. If print quality is critical, prefer Heerich for that slide.

---

## Resize Handling

Handle container resize (especially on window resize or theme changes):

```js
function handleResize(ctx) {
  const w = ctx.container.clientWidth;
  const h = ctx.container.clientHeight;
  ctx.camera.aspect = w / h;
  ctx.camera.updateProjectionMatrix();
  ctx.renderer.setSize(w, h);
}
// window.addEventListener('resize', () => handleResize(ctx));
```

---

## Guidelines

1. **WebGL fallback is mandatory.** Always check `supportsWebGL()` and provide a CSS/Heerich fallback. Never show a blank slide.
2. **Pause when not visible.** Use `animateOnActiveSlide()` to stop the animation loop on inactive slides. Saves CPU/GPU and battery.
3. **Dispose explicitly.** Call `disposeScene(ctx)` when tearing down a slide or rebuilding on theme change. Undisposed scenes leak GPU memory across slides.
4. **Keep scenes export-safe.** No post-processing, no GLTF, no OrbitControls. Those go in `threejs-scenes-live.md`. These scenes must capture cleanly with `capture-slides.mjs`.
5. **Pin the version.** Use the importmap with `three@0.184.0`. An unpinned `esm.sh/three` is a silent breakage waiting to happen.
6. **`alpha: true` on renderer.** Transparent background lets the slide background show through — critical for theme integration.
7. **Color management on.** Set `outputColorSpace = SRGBColorSpace` and `toneMapping = ACESFilmicToneMapping`. The "premium" look comes from this, not from cranking material values.
8. **Dark slides preferred.** WebGL looks best against dark backgrounds. On light theme slides, adjust material colors or skip 3D.
9. **Labels as HTML, not 3D text.** Place text labels as positioned HTML elements next to the canvas — keeps text crisp, accessible, and theme-aware.
10. **Max one Three.js scene per slide.** Multiple WebGL contexts degrade performance. Use Heerich for secondary visuals on the same slide.
11. **Limit to 2-3 slides per deck.** Three.js slides are accent moments, not the default. Overuse dilutes impact and increases load time.
