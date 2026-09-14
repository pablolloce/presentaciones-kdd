#!/usr/bin/env node
/**
 * Detecta contenido que se sale del lienzo de una presentación.
 *
 * En un formato de lienzo fijo (1600x900) el desbordamiento no se ve: el
 * contenedor lo recorta, así que una slide demasiado llena se entrega con el
 * texto cortado y nadie se entera hasta que está proyectada. Esta comprobación
 * mide cada slide en un navegador real y avisa.
 *
 * Uso:
 *   node scripts/check-layout.mjs <fichero.html> [...más ficheros]
 *   node scripts/check-layout.mjs               # todo presentations/
 *
 * Código de salida 1 si alguna slide desborda.
 */
import { chromium } from "playwright";
import { existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TOLERANCIA = 2; // px: redondeos de layout que no son un problema real

function collect(paths) {
  if (paths.length) return paths.map((p) => resolve(p)).filter((p) => p.endsWith(".html") && existsSync(p));
  const base = join(ROOT, "presentations");
  if (!existsSync(base)) return [];
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      if (e.startsWith("ejemplos-")) continue;
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith(".html")) out.push(p);
    }
  };
  walk(base);
  return out;
}

const ficheros = collect(process.argv.slice(2).filter((a) => !a.startsWith("--")));
if (!ficheros.length) {
  console.log("No hay presentaciones que medir en presentations/.");
  process.exit(0);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
});
let totalFallos = 0;

for (const fichero of ficheros) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`file://${fichero}`, { waitUntil: "domcontentloaded" });
  // Las tipografías van incrustadas, pero aun así hay que esperar a que el
  // motor las aplique: medir antes da alturas del tipo de respaldo.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const total = await page.evaluate(() => document.querySelectorAll(".slide").length);
  const fallos = [];

  for (let i = 0; i < total; i++) {
    // Cada slide se mide activa: las inactivas están ocultas y no tienen layout.
    const r = await page.evaluate((idx) => {
      const slides = [...document.querySelectorAll(".slide")];
      slides.forEach((s, n) => s.classList.toggle("active", n === idx));
      const s = slides[idx];
      const stage = document.getElementById("stage") || document.body;
      const caja = stage.getBoundingClientRect();
      let peor = null;
      const anota = (px, sel, tipo) => {
        if (!peor || px > peor.px) peor = { px: Math.round(px), sel, tipo };
      };

      // 1 · Lo que se sale del lienzo.
      for (const el of s.children) {
        const b = el.getBoundingClientRect();
        anota(
          Math.max(b.bottom - caja.bottom, caja.top - b.top, b.right - caja.right, caja.left - b.left),
          el.className || el.tagName.toLowerCase(),
          "fuera del lienzo",
        );
      }

      // 2 · Lo que se sale de su contenedor. Es el caso que de verdad muerde en
      // un lienzo fijo: el cuerpo centra su contenido y, si no cabe, lo empuja
      // fuera por arriba y por abajo, encima del lead y del takeaway. Nada se
      // sale del lienzo, pero el texto queda tapado.
      const cuerpo = s.querySelector(".body");
      if (cuerpo) {
        const cb = cuerpo.getBoundingClientRect();
        for (const el of cuerpo.children) {
          const b = el.getBoundingClientRect();
          anota(Math.max(b.bottom - cb.bottom, cb.top - b.top), el.className || el.tagName.toLowerCase(), "fuera de .body");
        }
      }
      return { nav: s.getAttribute("data-nav") || "", peor };
    }, i);

    if (r.peor && r.peor.px > TOLERANCIA) {
      fallos.push({ n: i + 1, ...r });
    }
  }

  await page.close();
  const rel = relative(ROOT, fichero);
  if (!fallos.length) {
    console.log(`OK    ${rel} · ${total} slides sin desbordamiento`);
  } else {
    totalFallos += fallos.length;
    console.log(`FALLA ${rel}`);
    for (const f of fallos) {
      console.log(`  slide ${f.n}${f.nav ? ` (${f.nav})` : ""}: ${f.peor.tipo}, ${f.peor.px}px · ${f.peor.sel}`);
    }
  }
}

await browser.close();
console.log(`\n${ficheros.length} fichero(s) · ${totalFallos} slide(s) con desbordamiento`);
process.exit(totalFallos ? 1 : 0);
