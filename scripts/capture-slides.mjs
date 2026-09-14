#!/usr/bin/env node
/**
 * Capture all slides from an NFQ HTML presentation using Playwright.
 * Embeds pixel-perfect JPEG screenshots as `var _PRECAPTURED = [...]` in the HTML.
 * Once embedded, the PDF/IMG/PPTX buttons use these images instead of html2canvas.
 *
 * Template mode is auto-detected via <meta name="deck-mode">.
 * Live templates get a longer settle delay (3s vs 1.5s) and a longer per-slide
 * pause (1.6s vs 0.8s) to let bloom, env maps, and GLTF assets resolve. Export
 * is best-effort in live mode — for pixel-perfect output use the export template.
 *
 * Usage:
 *   node capture-slides.mjs <presentation.html> [--theme light|dark|glass]
 *                            [--lang es|en] [--width 1280] [--height 720]
 *
 * The script modifies the HTML file in-place, adding/updating the _PRECAPTURED variable.
 */
import { chromium } from "playwright";
import { resolve, basename } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

const args = process.argv.slice(2);
// Safe flag reader — returns undefined when the flag is absent (indexOf === -1
// would otherwise yield args[0], which is the html path, breaking parseInt).
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const htmlPath = resolve(args.find((a) => !a.startsWith("--")) || ".");
const theme = (flag("--theme") || "light").toLowerCase();
// Cada idioma necesita su propia tanda de capturas: la plantilla elige entre
// _PRECAPTURED y _PRECAPTURED_EN segun el idioma activo (getPrecaptured()).
const lang = (flag("--lang") || "es").toLowerCase();
const capturedVar = lang === "en" ? "_PRECAPTURED_EN" : "_PRECAPTURED";
const width = parseInt(flag("--width") || "1280", 10);
const height = parseInt(flag("--height") || "720", 10);

if (!existsSync(htmlPath) || !htmlPath.endsWith(".html")) {
  console.error(
    "Uso: node scripts/capture-slides.mjs <presentation.html> " +
      "[--theme light|dark|glass] [--lang es|en] [--width 1280] [--height 720]",
  );
  process.exit(1);
}

async function main() {
  console.log(`Input:  ${htmlPath}`);
  console.log(`Theme:  ${theme} | Lang: ${lang} | Viewport: ${width}x${height} @2x`);

  // Permite apuntar a un Chromium ya presente en la maquina (contenedores, CI)
// en lugar del que descarga Playwright, que puede no coincidir de version.
const executablePath = process.env.CHROMIUM_EXECUTABLE || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });

  // Detect template mode: live templates need extra settle time for post-processing,
  // GLTF assets, and shader compilation. Export templates settle in 1.5s.
  const presentationMode = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="deck-mode"]');
    return meta ? meta.getAttribute("content") : "export";
  });
  const isLive = presentationMode === "live";
  const settleMs = isLive ? 3000 : 1500;
  if (isLive) {
    console.log(
      "Mode:   live (best-effort export; bloom/GLTF/OrbitControls may not capture cleanly)",
    );
  } else {
    console.log("Mode:   export-safe");
  }
  await page.waitForTimeout(settleMs);

  const totalSlides = await page.evaluate(() =>
    document.querySelectorAll(".slide").length
  );
  console.log(`Slides: ${totalSlides}`);

  // Setup: disable animations, apply theme + language, hide UI
  await page.evaluate(({ themeName, langName }) => {
    document.body.classList.add("exporting");
    var btn = document.querySelector('[data-theme="' + themeName + '"]');
    if (btn) btn.click();
    // El toggle de idioma reescribe titulos, subtitulos y takeaways. Hay que
    // dispararlo antes de capturar o las imagenes en ingles saldrian en espanol.
    var langBtn = document.querySelector('[data-lang="' + langName + '"]');
    if (langBtn) langBtn.click();
    else if (typeof window.applyLang === "function") window.applyLang(langName);
    ["nav-bar", "#kb-hint", "#progress-track", "#slide-logo", "#section-tag", ".sec-nav"]
      .forEach(function (sel) {
        var el = document.querySelector(sel.startsWith("#") || sel.startsWith(".") ? sel : "." + sel);
        if (el) el.style.display = "none";
      });
  }, { themeName: theme, langName: lang });

  await page.waitForTimeout(500);

  // Capture each slide
  const captures = [];
  for (let i = 0; i < totalSlides; i++) {
    process.stdout.write(`  ${i + 1}/${totalSlides}...`);

    await page.evaluate((idx) => {
      var slides = document.querySelectorAll(".slide");
      slides.forEach(function (s, j) {
        s.classList.remove("active", "prev");
        s.style.transition = "none";
        s.style.animation = "none";
        if (j === idx) {
          s.classList.add("active");
          s.style.opacity = "1";
          s.style.transform = "none";
          s.style.pointerEvents = "auto";
          // Force every animated descendant to its visible final state — kill
          // clip-path reveals, staggered fade-ins, slide-in chips, etc.
          // Otherwise the screenshot fires mid-animation and titles get
          // clipped. Finish any running Web Animations first so they leave
          // the element at its keyframe end state, then override defensively.
          var descendants = s.querySelectorAll("*");
          descendants.forEach(function (el) {
            if (el.getAnimations) {
              el.getAnimations().forEach(function (a) {
                try { a.finish(); } catch (e) {}
              });
            }
            el.style.animation = "none";
            el.style.transition = "none";
            el.style.opacity = "1";
            el.style.transform = "none";
            el.style.clipPath = "none";
            el.style.webkitClipPath = "none";
          });
        } else {
          s.style.opacity = "0";
          s.style.pointerEvents = "none";
        }
      });
    }, i);

    // Wait for any remaining Web Animations API animations to finish on the
    // active slide before screenshotting. This catches @keyframes-driven
    // entrances and JS-animated elements that survive the inline overrides.
    await page.evaluate(() => {
      var active = document.querySelector(".slide.active");
      if (!active || !active.getAnimations) return Promise.resolve();
      var anims = active.getAnimations({ subtree: true });
      anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
      return Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); }));
    });
    // Settle: fonts, lazy paints, layout reflow after animation kill.
    await page.waitForTimeout(isLive ? 1600 : 1000);
    const buf = await page.screenshot({ type: "jpeg", quality: 90 });
    captures.push(buf.toString("base64"));
    process.stdout.write(" OK\n");
  }

  await browser.close();

  // Embed captures into HTML
  let html = readFileSync(htmlPath, "utf-8");
  const jsArray = "[\n" + captures.map((b) => `"data:image/jpeg;base64,${b}"`).join(",\n") + "\n]";
  const assignment = `var ${capturedVar} = ${jsArray};`;
  // Ojo: _PRECAPTURED es prefijo de _PRECAPTURED_EN, asi que la deteccion y el
  // reemplazo tienen que anclarse al final del nombre para no pisar la variante
  // equivocada al capturar el segundo idioma.
  const declRe = new RegExp(`var ${capturedVar}\\s*=\\s*(?:\\[[\\s\\S]*?\\]|null);`);

  if (declRe.test(html)) {
    html = html.replace(declRe, assignment);
  } else {
    html = html.replace("(function(){", "(function(){\n  " + assignment);
  }

  writeFileSync(htmlPath, html);
  const sizeMB = (Buffer.byteLength(html) / (1024 * 1024)).toFixed(1);
  console.log(
    `\nIncrustadas ${totalSlides} slides en ${basename(htmlPath)} ` +
      `como ${capturedVar} (${sizeMB}MB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
