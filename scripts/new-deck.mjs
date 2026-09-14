#!/usr/bin/env node
/**
 * Crea el esqueleto de una presentación nueva a partir de una plantilla de referencia
 * y le aplica la marca activa.
 *
 * Uso:
 *   node scripts/new-deck.mjs "<Título>" [--format deck|deck-live|pov|status|playbook|concept]
 *                                        [--slug mi-deck] [--brand <id>]
 *
 * Salida: presentations/<AAAA-MM>-<slug>/index.html + brief.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REFS = join(ROOT, ".claude/skills/html-presentation/references");

const FORMATS = {
  deck: { file: "presentation-template.html", label: "Deck · exportable a PDF/PPTX" },
  "deck-live": { file: "presentation-template-live.html", label: "Deck · presentación en pantalla" },
  pov: { file: "doc-pov.html", label: "Documento · punto de vista" },
  status: { file: "doc-status.html", label: "Documento · informe de estado" },
  playbook: { file: "doc-playbook.html", label: "Documento · plan de implantación" },
  concept: { file: "doc-concept.html", label: "Documento · explicativo de concepto" },
};

const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const title = args.find((a) => !a.startsWith("--") && args.indexOf(a) === 0);

if (!title) {
  console.error(`Uso: node scripts/new-deck.mjs "<Título>" [--format ${Object.keys(FORMATS).join("|")}] [--slug x] [--brand id]`);
  process.exit(1);
}

const format = flag("--format") || "deck";
if (!FORMATS[format]) {
  console.error(`Formato desconocido "${format}". Opciones: ${Object.keys(FORMATS).join(", ")}`);
  process.exit(1);
}

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const stamp = new Date().toISOString().slice(0, 7);
const slug = flag("--slug") || slugify(title);
const dir = join(ROOT, "presentations", `${stamp}-${slug}`);

if (existsSync(dir)) {
  console.error(`Ya existe ${dir}. Usa --slug para diferenciarla.`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
const src = join(REFS, FORMATS[format].file);
const dest = join(dir, "index.html");
copyFileSync(src, dest);

// Título visible y <title> del documento
let html = readFileSync(dest, "utf-8");
html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
writeFileSync(dest, html);

const brandArgs = ["scripts/apply-brand.mjs", dest];
if (flag("--brand")) brandArgs.push("--brand", flag("--brand"));
execFileSync("node", brandArgs, { cwd: ROOT, stdio: "inherit" });

writeFileSync(
  join(dir, "brief.md"),
  `# ${title}

- **Formato**: ${FORMATS[format].label}
- **Creada**: ${new Date().toISOString().slice(0, 10)}
- **Audiencia**:
- **Objetivo de la reunión**:
- **Mensaje único que debe quedar**:

## Argumento
1.
2.
3.

## Fuentes
| Dato | Fuente | Fecha |
|---|---|---|
|  |  |  |
`,
);

console.log(`\nCreada  ${dir.replace(ROOT + "/", "")}/index.html`);
console.log(`Brief   ${dir.replace(ROOT + "/", "")}/brief.md`);
console.log(`Abrir   open ${dir.replace(ROOT + "/", "")}/index.html`);
