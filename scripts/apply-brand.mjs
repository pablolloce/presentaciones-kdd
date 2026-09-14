#!/usr/bin/env node
/**
 * Aplica la marca activa (brand/brand.json) a una presentación HTML.
 *
 * Sustituye, sobre el fichero indicado:
 *   1. La paleta completa (hex y sus formas rgba()) del preset de origen por la del destino.
 *   2. El nombre de marca visible (NFQ / nfq / Base...) por el del destino.
 *   3. El contenido del <symbol id="brand-iso"> por el logo del destino.
 *   4. Las familias tipográficas declaradas en la config.
 *
 * El preset de origen se lee de <html data-brand="...">; si no existe se asume `base`,
 * que es la paleta con la que vienen las plantillas de referencia. Tras aplicar,
 * el script escribe data-brand con el id destino, de modo que reejecutarlo es idempotente
 * y permite cambiar de marca N veces sin degradar el fichero.
 *
 * Uso:
 *   node scripts/apply-brand.mjs <fichero.html> [--brand <id|ruta.json>] [--cliente <id>]
 *                                 [--from <id>] [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dry = args.includes("--dry");
const target = args.find((a) => !a.startsWith("--") && a.endsWith(".html"));

if (!target || !existsSync(target)) {
  console.error(
    "Uso: node scripts/apply-brand.mjs <fichero.html> [--brand <id|ruta.json>] " +
      "[--cliente <id>] [--from <id>] [--dry]",
  );
  process.exit(1);
}

const activeBrand = () => JSON.parse(readFileSync(join(ROOT, "brand/brand.json"), "utf-8"));

/** Carga una marca por id de preset, por ruta a json, o la activa por defecto. */
function loadBrand(ref) {
  const active = activeBrand();
  if (!ref) return active;
  // La marca activa no tiene por que existir tambien como preset: sin este caso,
  // reaplicar sobre un fichero ya sellado con data-brand="<activa>" fallaria al
  // resolver el origen.
  if (ref === active.id) return active;
  const candidates = [ref, join(ROOT, ref), join(ROOT, "brand/presets", `${ref}.json`)];
  const hit = candidates.find((p) => p.endsWith(".json") && existsSync(p));
  if (!hit) throw new Error(
      `Marca no encontrada: ${ref}. Presets disponibles en brand/presets/. ` +
        "Si el fichero lleva sellada una marca externa, indica el origen con --from <id>.",
    );
  return JSON.parse(readFileSync(hit, "utf-8"));
}

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Sustituye un color en todas sus formas textuales: #RRGGBB (cualquier caja),
 * la forma sin almohadilla usada por algunas libs, y rgba(r,g,b, a) / rgb(r,g,b)
 * con o sin espacios. Sin esto, los fondos translúcidos (rgba del 6 %) quedarían
 * anclados a la paleta antigua y la marca saldría a medias.
 */
function replaceColor(html, fromHex, toHex) {
  const [fr, fg, fb] = hexToRgb(fromHex);
  const [tr, tg, tb] = hexToRgb(toHex);
  let out = html.replace(new RegExp(escapeRe(fromHex), "gi"), toHex);
  out = out.replace(
    new RegExp(`rgba?\\(\\s*${fr}\\s*,\\s*${fg}\\s*,\\s*${fb}\\s*([,)])`, "gi"),
    (_m, tail) => `rgba(${tr},${tg},${tb}${tail}`,
  );
  return out;
}

/** Lee el viewBox del <svg> de origen; sin él el símbolo recortaría el logo. */
function svgViewBox(svgText) {
  return svgText.match(/<svg[^>]*\bviewBox="([^"]+)"/i)?.[1] || "0 0 96 120";
}

/** Extrae el interior de un <svg> para incrustarlo en un <symbol>, con ids prefijados. */
function svgInner(svgText, prefix) {
  const body = svgText.replace(/^[\s\S]*?<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
  // Los <defs> con gradientes usan ids globales: prefijarlos evita colisiones
  // cuando dos logos conviven en la misma página (galería, comparativas).
  const ids = [...body.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  let out = body;
  for (const id of ids) {
    out = out.replaceAll(`id="${id}"`, `id="${prefix}${id}"`);
    out = out.replaceAll(`url(#${id})`, `url(#${prefix}${id})`);
    out = out.replaceAll(`href="#${id}"`, `href="#${prefix}${id}"`);
  }
  return out.trim();
}

const to = loadBrand(flag("--brand"));
let html = readFileSync(target, "utf-8");

const declared = html.match(/<html[^>]*\sdata-brand="([^"]+)"/i);
const fromId = flag("--from") || declared?.[1] || "base";
const from = loadBrand(fromId);

// Reaplicar la misma marca no es un no-op: regenera los bloques de logotipo y
// de tokens, que es justo lo que hace falta al crear un deck desde la plantilla
// o al cambiar solo el cliente. Solo se sale pronto si no hay nada que hacer.
if (from.id === to.id && declared && !flag("--cliente") && !args.includes("--forzar")) {
  const bloques = /<!-- brand:(client|nfq):start -->\s*<svg/.test(html);
  if (bloques) {
    console.log(`Sin cambios: ${target} ya lleva la marca "${to.id}".`);
    process.exit(0);
  }
}

const changes = [];

// 1 · Paleta
for (const [token, fromHex] of Object.entries(from.palette)) {
  const toHex = to.palette[token];
  if (!toHex || toHex.toLowerCase() === fromHex.toLowerCase()) continue;
  const before = html;
  html = replaceColor(html, fromHex, toHex);
  if (before !== html) changes.push(`paleta ${token}: ${fromHex} → ${toHex}`);
}

// 2 · Nombre de marca visible
// Orden importante: primero los identificadores mas largos y especificos
// (url, nombre completo) y despues el corto, para que "nfq.es" no quede
// convertido a medias en "KDD.es" al sustituir antes "nfq".
//
// Cuando name y nameShort coinciden en el origen (p. ej. ambos "KDD") no hay
// forma de saber que ocurrencia queria la forma larga, asi que gana la corta:
// dedupe conservando la ultima pareja por cada texto de origen.
const nameKeys = ["url", "name", "nameShort"];
const seenSource = new Map();
for (const key of nameKeys) if (from[key]) seenSource.set(from[key], key);

for (const key of nameKeys) {
  const fromName = from[key];
  const toName = to[key];
  if (!fromName || !toName || fromName === toName) continue;
  if (seenSource.get(fromName) !== key) continue;
  const boundary = key === "url" ? "" : "(?![\\\\w-])";
  const re = new RegExp(`(?<![\\w-])${escapeRe(fromName)}${boundary}`, "g");
  const before = html;
  html = html.replace(re, toName);
  if (before !== html) changes.push(`${key}: ${fromName} → ${toName}`);
}

/** Aplica el mapeo de paleta origen→destino a un fragmento de markup. */
function remapPalette(fragment) {
  let out = fragment;
  for (const [token, fromHex] of Object.entries(from.palette)) {
    const toHex = to.palette[token];
    if (toHex && toHex.toLowerCase() !== fromHex.toLowerCase()) out = replaceColor(out, fromHex, toHex);
  }
  return out;
}

// 3 · Logo dentro del <symbol id="brand-iso">
//
// Dos variantes, porque los destinos no son equivalentes:
//  · Los bloques entre marcadores brand:logo (deck de exportación) llevan el
//    isotipo a todo color con sus propios gradientes.
//  · Los <symbol> sueltos de los documentos long-scroll y de la plantilla live
//    pintan con currentColor para seguir al tema claro/oscuro. Meter ahí el
//    logo con gradientes lo dejaría fijo en un color y rompería el toggle.
const symbolRe = /(<symbol\b[^>]*\bid="brand-iso"[^>]*>)([\s\S]*?)(<\/symbol>)/i;
const markerRe = /(<!-- brand:logo:start[\s\S]*?-->)([\s\S]*?)(<!-- brand:logo:end -->)/i;
const hasMarker = markerRe.test(html);
const logoRel = hasMarker ? to.logo || "brand/logo.svg" : to.logoMono || to.logo || "brand/logo.svg";
const logoPath = join(ROOT, logoRel);

if (!existsSync(logoPath)) {
  console.warn(`Aviso: no existe ${logoRel}; logo no aplicado.`);
} else if (hasMarker) {
  const src = readFileSync(logoPath, "utf-8");
  // El logo generico del repositorio lleva los acentos de la paleta base escritos
  // en sus gradientes. Remapearlos aqui hace que una marca nueva creada copiando
  // un preset estrene tambien el isotipo en sus colores, sin editar el SVG.
  const inner = remapPalette(svgInner(src, `${to.id}-`));
  const vb = svgViewBox(src);
  const before = html;
  html = html.replace(
    markerRe,
    (_m, open, _body, close) =>
      `${open}\n<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">\n  <defs>\n    <symbol id="brand-iso" viewBox="${vb}">\n${inner}\n    </symbol>\n  </defs>\n</svg>\n${close}`,
  );
  if (before !== html) changes.push(`logo (color): ${logoRel}`);
} else if (symbolRe.test(html)) {
  const src = readFileSync(logoPath, "utf-8");
  const inner = remapPalette(svgInner(src, `${to.id}-`));
  const vb = svgViewBox(src);
  const before = html;
  html = html.replace(symbolRe, (_m, open, _body, close) => {
    // El viewBox del símbolo destino debe ser el del logo nuevo; si se conserva
    // el antiguo (p. ej. 0 0 100 125 frente a 0 0 96 120) el trazo sale recortado.
    const reVb = open.includes("viewBox=")
      ? open.replace(/viewBox="[^"]*"/i, `viewBox="${vb}"`)
      : open.replace(/>$/, ` viewBox="${vb}">`);
    return `${reVb}\n${inner}\n${close}`;
  });
  if (before !== html) changes.push(`logo (mono): ${logoRel}`);
} else if (!/<!-- brand:nfq:start -->/.test(html)) {
  // Las plantillas sobre lienzo llevan el logotipo completo en su propio
  // bloque brand:nfq, no un <symbol>. Ahi el aviso seria ruido.
  console.warn('Aviso: no hay <symbol id="brand-iso"> ni bloque brand:nfq; logotipo no aplicado.');
}

// 4 · Tipografías
for (const slot of ["sans", "mono"]) {
  const f = from.fonts?.[slot];
  const t = to.fonts?.[slot];
  if (!f || !t || f === t) continue;
  const before = html;
  html = html.replaceAll(f, t);
  if (before !== html) changes.push(`tipografía ${slot}: ${f} → ${t}`);
}

// 4b · Lockup de marcas del deck sobre lienzo (cliente | nfq) y color corporativo
//
// Los dos logotipos viven en bloques marcados y se regeneran enteros. El del
// cliente pinta con currentColor, asi que el color corporativo se inyecta como
// token CSS --client y basta cambiarlo en brand/clients/<id>.json.
function injectMark(html, marker, svgPath, cls, prefix) {
  // Bandera global: los logotipos aparecen mas de una vez (barra de marca y
  // portada). Sin la "g" solo se rellenaba el primero y la portada quedaba muda.
  const re = new RegExp(`(<!-- brand:${marker}:start -->)([\\s\\S]*?)(<!-- brand:${marker}:end -->)`, "gi");
  if (!existsSync(svgPath)) return { html, done: false };
  re.lastIndex = 0;
  if (!re.test(html)) return { html, done: false };
  re.lastIndex = 0;
  const src = readFileSync(svgPath, "utf-8");
  const vb = svgViewBox(src);
  // Cada copia del logotipo necesita ids propios. Con el mismo prefijo en las
  // dos (barra de marca y portada), el clipPath y los gradientes quedan
  // duplicados y el navegador resuelve url(#id) contra el primero del
  // documento — que esta oculto en la portada — y el isotipo sale recortado.
  let n = 0;
  const out = html.replace(re, (_m, a, _b, c) => {
    const inner = svgInner(src, `${prefix}${++n}-`);
    return `${a}<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>${c}`;
  });
  return { html: out, done: true };
}

const clienteRef = flag("--cliente");
if (clienteRef) {
  const rutas = [clienteRef, join(ROOT, clienteRef), join(ROOT, "brand/clients", `${clienteRef}.json`)];
  const hit = rutas.find((r) => r.endsWith(".json") && existsSync(r));
  if (!hit) throw new Error(`Cliente no encontrado: ${clienteRef}. Ver brand/clients/.`);
  const cliente = JSON.parse(readFileSync(hit, "utf-8"));
  const r = injectMark(html, "client", join(ROOT, cliente.logo), "client-mark", `${cliente.id}-`);
  if (r.done) {
    html = r.html;
    changes.push(`logotipo de cliente: ${cliente.name}`);
  }
  // El color corporativo entra como token, no como hex repartido por el CSS.
  html = html.replace(/(--client:\s*)#[0-9a-fA-F]{3,8}/, `$1${cliente.color}`);
  html = html.replace(/(--client-dark:\s*)#[0-9a-fA-F]{3,8}/, `$1${cliente.colorOnDark || "#FFFFFF"}`);
  html = html.replace(/(<html[^>]*?)\s*data-cliente="[^"]*"/i, "$1");
  html = html.replace(/<html\b/i, `<html data-cliente="${cliente.id}"`);
  changes.push(`color de cliente: ${cliente.color}`);
}

// El logotipo de nfq (isotipo + palabra) va siempre que la plantilla lo pida.
if (to.logoWordmark) {
  const r = injectMark(html, "nfq", join(ROOT, to.logoWordmark), "nfq-mark", `${to.id}w-`);
  if (r.done) {
    html = r.html;
    changes.push(`logotipo nfq: ${to.logoWordmark}`);
  }
}

// 5 · Sello de marca aplicada
html = /<html[^>]*\sdata-brand="[^"]*"/i.test(html)
  ? html.replace(/(<html[^>]*\sdata-brand=")[^"]*(")/i, `$1${to.id}$2`)
  : html.replace(/<html\b/i, `<html data-brand="${to.id}"`);

if (dry) {
  console.log(`[dry-run] ${target}: ${from.id} → ${to.id}`);
  changes.forEach((c) => console.log(`  · ${c}`));
  if (!changes.length) console.log("  (sin cambios de contenido)");
  process.exit(0);
}

writeFileSync(target, html);
console.log(`Marca aplicada a ${target}: ${from.id} → ${to.id}`);
changes.forEach((c) => console.log(`  · ${c}`));
