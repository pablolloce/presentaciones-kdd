#!/usr/bin/env node
/**
 * Verifica que una presentación cumple los estándares del repositorio.
 * Sin dependencias: análisis textual, ejecuta en < 100 ms y sirve en pre-commit.
 *
 * Uso:
 *   node scripts/check-deck.mjs <fichero.html> [...más ficheros]
 *   node scripts/check-deck.mjs            # verifica todo presentations/
 *
 * Código de salida 1 si hay errores; los avisos no rompen la build.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Recoge las presentaciones a verificar.
 *
 * Las carpetas "ejemplos-*" quedan fuera del barrido por defecto: son material
 * de referencia de terceros o anterior al sistema, no entregables de este
 * repositorio, y hacerlas fallar cada vez solo ensena a ignorar el informe.
 * Se pueden verificar pasandolas explicitamente por argumento.
 */
function collect(paths) {
  if (paths.length) return paths.filter((p) => p.endsWith(".html") && existsSync(p));
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

/**
 * Construye el patron de un atributo class que contiene EXACTAMENTE la clase dada.
 *
 * No vale /\bslide\b/: en expresiones regulares el guion es frontera de palabra,
 * asi que ese patron casa tambien con "slide-label" o "slide-num" e infla el
 * recuento de slides. La clase tiene que ir delimitada por espacio o por el
 * principio/final del atributo.
 */
function classAttr(name) {
  return `class="(?:[^"]*\\s)?${name}(?:\\s[^"]*)?"`;
}

/**
 * Extrae cada elemento con clase "slide" junto con su contenido, equilibrando
 * la etiqueta de apertura con su cierre.
 *
 * No se asume <div>: hay decks que maquetan cada slide como <section class="slide">
 * o <article class="slide">. Anclar el analisis a una sola etiqueta hacia que el
 * verificador informara de "0 slides" y se saltara en silencio todas las reglas
 * por slide, que es justo lo contrario de lo que debe hacer.
 */
function extractSlides(html) {
  const slides = [];
  const re = new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*${classAttr("slide")}[^>]*>`, "gi");
  let m;
  while ((m = re.exec(html))) {
    const tag = m[1].toLowerCase();
    // Una etiqueta vacia (<div ... />) no abre nivel: se cierra en si misma.
    if (m[0].endsWith("/>")) {
      slides.push({ open: m[0], body: m[0] });
      continue;
    }
    let depth = 1;
    let i = m.index + m[0].length;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = i;
    let t;
    while (depth > 0 && (t = tagRe.exec(html))) {
      if (t[0].endsWith("/>")) continue;
      depth += t[1] === "/" ? -1 : 1;
      i = tagRe.lastIndex;
    }
    slides.push({ open: m[0], body: html.slice(m.index, i) });
  }
  return slides;
}

const RULES = [
  {
    id: "marca-aplicada",
    level: "error",
    msg: 'falta data-brand en <html>: ejecuta `npm run marca -- <fichero>`',
    test: (h) => /<html[^>]*\sdata-brand="[^"]+"/i.test(h),
  },
  {
    id: "logo",
    level: "error",
    msg: "no lleva la marca: falta el lockup (.nfq-mark) o el isotipo (#brand-iso)",
    // Dos formatos, dos mecanismos: el deck sobre lienzo incrusta el logotipo
    // completo en .nfq-mark; las plantillas antiguas referencian un <symbol>.
    test: (h) => /href="#brand-iso"/.test(h) || /class="nfq-mark"/.test(h),
  },
  {
    id: "titulo",
    level: "error",
    msg: "<title> vacío o genérico",
    test: (h) => {
      const t = h.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
      return t.length > 3 && !/plantilla|template|untitled|documento sin/i.test(t);
    },
  },
  {
    id: "sin-lorem",
    level: "error",
    msg: "contiene texto de relleno (lorem ipsum)",
    test: (h) => !/lorem ipsum/i.test(h),
  },
  {
    // Solo se mira el markup: una hoja de estilos puede declarar .ct-old con
    // line-through para un antes/despues legitimo, que no es el anti-patron.
    // El anti-patron es tachar la columna del rival en una tabla comparativa.
    id: "sin-tachado-en-markup",
    level: "warn",
    msg: "hay line-through aplicado en el markup: comprueba que no anula visualmente a un competidor",
    test: (h) => {
      const body = (h.match(/<body[\s\S]*<\/body>/i)?.[0] || h).replace(
        /<style[\s\S]*?<\/style>/gi,
        "",
      );
      return !/line-through/i.test(body);
    },
  },
  {
    id: "sin-rutas-locales",
    level: "error",
    msg: "referencia rutas absolutas de una máquina concreta (/Users/, /Volumes/, C:\\)",
    test: (h) => !/(?:file:\/\/)?\/(?:Users|Volumes)\/|[A-Z]:\\\\/.test(h),
  },
  {
    // La promesa de este repositorio es que cada presentacion es un fichero
    // autocontenido. Una fuente o una imagen referenciada por ruta relativa que
    // no viaja con el fichero falla en silencio: el navegador cae al tipo de
    // respaldo y nadie se entera hasta que el cliente lo abre.
    id: "autocontenido",
    level: "error",
    msg: null, // se construye con la lista de recursos que faltan
    find: (h, file) => {
      const base = dirname(file);
      const refs = new Set();
      // Fuera los <script>: dentro hay cadenas que imitan referencias sin serlo
      // (un href="$2" de un .replace(), un toDataURL('image/png')...). Lo que se
      // audita son los recursos que el navegador va a pedir al pintar.
      const markup = h.replace(/<script[\s\S]*?<\/script>/gi, "");
      const patterns = [
        /(?:src|href)="([^"#?]+)"/gi,
        // (?<![\w-]) evita que toDataURL(...) o cualquier fnUrl(...) cuele.
        /(?<![\w-])url\((["']?)([^)"']+)\1\)/gi,
      ];
      for (const re of patterns) {
        for (const m of markup.matchAll(re)) {
          const ref = (m[2] ?? m[1]).trim();
          if (!ref || /^(?:https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(ref)) continue;
          if (ref.startsWith("/")) continue; // lo cubre la regla de rutas absolutas
          refs.add(ref);
        }
      }
      return [...refs].filter((r) => !existsSync(join(base, decodeURIComponent(r))));
    },
  },
  {
    // El formato principal se define por ser autosuficiente: tipografias
    // incrustadas y ninguna peticion de red al abrirlo. Un CDN caido o una red
    // corporativa restrictiva no pueden degradar un deck delante del cliente.
    id: "sin-cdn",
    level: "error",
    msg: null,
    onlyStage: true,
    find: (h) => {
      const markup = h.replace(/<script[\s\S]*?<\/script>/gi, "");
      const hosts = new Set();
      for (const m of markup.matchAll(/(?:src|href)="(https?:\/\/[^"/]+)/gi)) hosts.add(m[1]);
      for (const m of markup.matchAll(/url\((["']?)(https?:\/\/[^"'/]+)/gi)) hosts.add(m[2]);
      // El espacio de nombres SVG es una URI, no una descarga.
      return [...hosts].filter((u) => !/^https?:\/\/www\.w3\.org$/.test(u));
    },
  },
  {
    id: "exportacion",
    level: "warn",
    msg: "faltan librerías de exportación (pptxgenjs / html2canvas / jspdf)",
    test: (h) =>
      ["pptxgen", "html2canvas", "jspdf"].every((l) => h.toLowerCase().includes(l)),
    onlyDeck: true,
    // El formato principal no las lleva a proposito: cargarlas desde un CDN
    // rompería la promesa de fichero autosuficiente. Ahi el PDF sale por
    // impresion del navegador.
    skipStage: true,
  },
  {
    id: "precaptura",
    level: "warn",
    msg: "hay imágenes base64 embebidas pero no hay _PRECAPTURED: `npm run capturar -- <fichero>`",
    test: (h) =>
      !/src="data:image\/(png|jpe?g)/i.test(h) || /var _PRECAPTURED\s*=\s*\[/.test(h),
    onlyDeck: true,
  },
  {
    id: "acentos",
    level: "warn",
    msg: "posibles palabras en español sin tilde (analisis, metricas, gestion, informacion...)",
    test: (h) => {
      const texto = h
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "");
      // Lista corta y conservadora: solo palabras cuya forma sin tilde no existe
      // en castellano. "periodo" y "version" quedan fuera a proposito: la primera
      // es valida sin tilde y la segunda es tambien una palabra inglesa. "publica"
      // tampoco entra: sin tilde es el verbo publicar, perfectamente correcto.
      return !/\b(analisis|metricas?|gestion|informacion|implantacion|estrategico|tecnologia|numero|ademas|tambien|segun|deberia|calculo|solucion|prediccion|seccion)\b/i.test(
        texto,
      );
    },
  },
];

/**
 * Agrupa los problemas repetidos por slide en una sola linea.
 * Un deck de 25 slides construido con otra anatomia genera 25 lineas identicas
 * salvo el numero, que ahogan el resto del informe.
 */
function collapse(list) {
  const groups = new Map();
  for (const p of list) {
    const m = p.text.match(/^slide (\d+): (.*)$/);
    const key = m ? m[2] : p.text;
    if (!groups.has(key)) groups.set(key, []);
    if (m) groups.get(key).push(m[1]);
  }
  return [...groups].map(([key, nums]) => {
    if (!nums.length) return key;
    if (nums.length === 1) return `slide ${nums[0]}: ${key}`;
    const muestra = nums.length > 6 ? `${nums.slice(0, 6).join(", ")}…` : nums.join(", ");
    return `${key} — en ${nums.length} slides (${muestra})`;
  });
}

let totalErr = 0;
let totalWarn = 0;
const files = collect(process.argv.slice(2).filter((a) => !a.startsWith("--")));

if (!files.length) {
  console.log("No hay presentaciones que verificar en presentations/.");
  process.exit(0);
}

for (const file of files) {
  const html = readFileSync(file, "utf-8");
  const isDeck = new RegExp(classAttr("slide")).test(html);
  // Las dos familias de deck no comparten anatomia: la de exportacion usa
  // .slide-themed + .ex-title + .takeaway; la live usa .chrome + .divider y
  // construye el discurso con reveals. Aplicar las reglas de una a la otra
  // produce decenas de falsos positivos.
  const modo = (html.match(/<meta[^>]+name="deck-mode"[^>]+content="([^"]+)"/i) || [])[1];
  // Formato principal: lienzo fijo, .cover / .divider / contenido.
  const isStage = modo === "stage";
  const isLiveDeck =
    !isStage &&
    (modo === "live" || (isDeck && !new RegExp(classAttr("slide-themed")).test(html)));
  const problems = [];

  for (const rule of RULES) {
    if (rule.onlyDeck && !isDeck) continue;
    if (rule.onlyStage && !isStage) continue;
    if (rule.skipStage && isStage) continue;
    if (rule.find) {
      const faltan = rule.find(html, file);
      if (faltan.length) {
        const muestra = faltan.slice(0, 4).join(", ") + (faltan.length > 4 ? `, +${faltan.length - 4}` : "");
        problems.push({
          level: rule.level,
          text:
            rule.id === "sin-cdn"
              ? `depende de ${faltan.length} dominio(s) externo(s): ${muestra}`
              : `referencia ${faltan.length} recurso(s) que no viajan con el fichero: ${muestra}`,
        });
      }
      continue;
    }
    if (!rule.test(html)) problems.push({ level: rule.level, text: rule.msg });
  }

  if (isDeck) {
    const slides = extractSlides(html);
    slides.forEach((s, i) => {
      const n = i + 1;

      if (isStage) {
        const clases = s.open.match(/class="([^"]*)"/)?.[1] || "";
        const esPortada = /(^|\s)cover(\s|$)/.test(clases);
        const esSeparador = /(^|\s)divider(\s|$)/.test(clases);
        // El sumario enumera, no argumenta: no le corresponde una conclusion.
        const esSumario = /(^|\s)index(\s|$)/.test(clases);
        if (esSeparador && !/\bdata-nav="[^"]+"/.test(s.open)) {
          // El navegador de secciones se construye con estas etiquetas.
          problems.push({ level: "error", text: `slide ${n}: separador sin data-nav` });
        }
        if (!esPortada && !esSeparador && !esSumario) {
          if (!new RegExp(classAttr("takeaway")).test(s.body)) {
            problems.push({ level: "error", text: `slide ${n}: falta .takeaway` });
          }
          if (!new RegExp(classAttr("headline")).test(s.body)) {
            problems.push({ level: "error", text: `slide ${n}: falta .headline` });
          }
          if (!new RegExp(classAttr("eyebrow")).test(s.body)) {
            problems.push({ level: "warn", text: `slide ${n}: falta .eyebrow` });
          }
        }
        return;
      }

      const isDark = new RegExp(`${classAttr("slide-dark")}|${classAttr("slide-div")}`).test(s.open) ||
        /\bslide-(dark|div)\b/.test(s.open.match(/class="([^"]*)"/)?.[1] || "");
      if (!/\bdata-section=/.test(s.open)) {
        problems.push({ level: "error", text: `slide ${n}: falta data-section` });
      }
      // La regla de oro del formato: toda slide de contenido cierra con su conclusión.
      // Portada y separadores están exentos porque no argumentan nada.
      if (isLiveDeck) return; // la plantilla live no usa .ex-title ni .takeaway
      if (!isDark && !new RegExp(classAttr("takeaway")).test(s.body)) {
        problems.push({ level: "error", text: `slide ${n}: falta .takeaway` });
      }
      if (!isDark && !new RegExp(classAttr("ex-title")).test(s.body)) {
        problems.push({ level: "warn", text: `slide ${n}: falta .ex-title` });
      }
    });
    if (slides.length < 3) {
      problems.push({ level: "warn", text: `solo ${slides.length} slides` });
    }
  }

  const errs = problems.filter((p) => p.level === "error");
  const warns = problems.filter((p) => p.level === "warn");
  totalErr += errs.length;
  totalWarn += warns.length;

  const rel = relative(ROOT, file);
  if (!problems.length) {
    console.log(`OK    ${rel}`);
  } else {
    console.log(`${errs.length ? "FALLA" : "AVISO"} ${rel}`);
    for (const [level, list] of [["error", errs], ["aviso", warns]]) {
      for (const line of collapse(list)) console.log(`  ${level}  ${line}`);
    }
  }
}

console.log(`\n${files.length} fichero(s) · ${totalErr} error(es) · ${totalWarn} aviso(s)`);
process.exit(totalErr ? 1 : 0);
