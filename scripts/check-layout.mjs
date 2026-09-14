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
// px de tolerancia: por debajo son redondeos de layout, no un problema real.
const TOLERANCIA = 2;

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
      // Se recogen TODOS los hallazgos, no solo el peor: si solo se informa del
      // mayor, arreglarlo destapa el siguiente y la revision se vuelve un goteo.
      const hallazgos = [];
      // Margen de cortesia: lo que queda a menos de MARGEN px de cortarse se
      // avisa sin fallar. Un cambio de texto, otra version de la tipografia o
      // un navegador distinto lo convierten en recorte de verdad.
      const MARGEN = -12;
      const anota = (px, sel, tipo, conMargen) => {
        // El aviso de cercania solo tiene sentido midiendo contra un contenedor
        // de altura fija. Un bloque de altura automatica siempre mide exacto
        // (scrollHeight === clientHeight), y avisar de eso es puro ruido.
        const umbral = conMargen ? MARGEN : 2;
        if (px <= umbral) return;
        hallazgos.push({
          px: Math.round(px),
          sel: String(sel).slice(0, 34),
          tipo,
          aviso: px <= 2,
        });
      };

      // 1 · Lo que se sale del lienzo.
      for (const el of s.children) {
        const b = el.getBoundingClientRect();
        anota(
          Math.max(b.bottom - caja.bottom, caja.top - b.top, b.right - caja.right, caja.left - b.left),
          el.className || el.tagName.toLowerCase(),
          "fuera del lienzo",
          true,
        );
      }

      // 2 · Lo que queda RECORTADO dentro de un contenedor con overflow oculto.
      // Es el caso mas traicionero: .tblwrap, .specfile y las tarjetas recortan
      // por diseno (para mantener el borde redondeado), asi que una tabla con
      // una fila de mas pierde esa fila sin que nada se desborde ni se solape.
      for (const el of s.querySelectorAll("*")) {
        const st = getComputedStyle(el);
        const recorta = /hidden|clip/.test(st.overflowY) || /hidden|clip/.test(st.overflowX);
        if (!recorta) continue;
        const dy = el.scrollHeight - el.clientHeight;
        const dx = el.scrollWidth - el.clientWidth;
        anota(Math.max(dy, dx), el.className || el.tagName.toLowerCase(), "recortado");
      }

      // 3 · Lo que se sale de su contenedor. Es el caso que de verdad muerde en
      // un lienzo fijo: el cuerpo centra su contenido y, si no cabe, lo empuja
      // fuera por arriba y por abajo, encima del lead y del takeaway. Nada se
      // sale del lienzo, pero el texto queda tapado.
      const cuerpo = s.querySelector(".body");
      if (cuerpo) {
        const cb = cuerpo.getBoundingClientRect();
        for (const el of cuerpo.children) {
          // Un hijo con flex-grow esta disenado para llenar el hueco exacto:
          // avisar de que "va justo" ahi seria avisar de que funciona.
          if (parseFloat(getComputedStyle(el).flexGrow) > 0) continue;
          const b = el.getBoundingClientRect();
          anota(
            Math.max(b.bottom - cb.bottom, cb.top - b.top),
            el.className || el.tagName.toLowerCase(),
            "fuera de .body",
            true,
          );
        }
      }
      // Un mismo elemento puede acumular varias medidas; nos quedamos con la
      // mayor de cada uno y ordenamos de mayor a menor.
      const porElemento = new Map();
      for (const h of hallazgos) {
        const k = h.sel + "|" + h.tipo;
        if (!porElemento.has(k) || porElemento.get(k).px < h.px) porElemento.set(k, h);
      }
      return {
        nav: s.getAttribute("data-nav") || "",
        hallazgos: [...porElemento.values()].sort((a, b) => b.px - a.px),
      };
    }, i);

    if (r.hallazgos.length) fallos.push({ n: i + 1, ...r });
  }

  await page.close();
  const rel = relative(ROOT, fichero);
  const conError = fallos.filter((f) => f.hallazgos.some((h) => !h.aviso));
  if (!fallos.length) {
    console.log(`OK    ${rel} · ${total} slides sin desbordamiento`);
  } else {
    totalFallos += conError.length;
    console.log(`${conError.length ? "FALLA" : "AVISO"} ${rel}`);
    for (const f of fallos) {
      const donde = `slide ${f.n}${f.nav ? ` (${f.nav})` : ""}`;
      for (const h of f.hallazgos) {
        const nivel = h.aviso ? "aviso " : "error ";
        const medida = h.aviso ? `a ${Math.abs(h.px)}px de cortarse` : `${h.px}px`;
        console.log(`  ${nivel} ${donde}: ${h.tipo}, ${medida} · ${h.sel}`);
      }
    }
  }
}

await browser.close();
console.log(`\n${ficheros.length} fichero(s) · ${totalFallos} slide(s) con desbordamiento`);
process.exit(totalFallos ? 1 : 0);
