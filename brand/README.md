# Marca

Toda la identidad visual de las presentaciones sale de aquí. Un solo fichero manda:
**`brand.json`**.

## Qué hay

| Fichero | Para qué |
|---|---|
| `brand.json` | La marca activa. Es la que aplica `scripts/new-deck.mjs` por defecto |
| `logo.svg` | Isotipo a todo color, para la portada y el cierre de los decks |
| `logo-mono.svg` | Isotipo monocromo (`currentColor`), para documentos y plantilla live |
| `presets/` | Marcas alternativas, intercambiables con un comando |
| `assets/` | Material corporativo de apoyo (plantilla PPTX, etc.) |

## Campos de `brand.json`

```jsonc
{
  "id":        "nfq",                  // identificador; queda sellado en <html data-brand="...">
  "name":      "nfq advisory",         // nombre completo, como aparece en pies y créditos
  "nameShort": "NFQ",                  // forma corta para cabeceras
  "url":       "nfq.es",               // dominio que aparece en los pies de documento
  "tagline":   "Advisory para banca, seguros y wealth & asset management",
  "legalLine": "nfq advisory · Documento confidencial",
  "palette": {
    "ink":      "#0B1026",   // fondo de portadas y separadores
    "inkLight": "#1A2340",
    "inkMid":   "#2A3558",
    "accent1":  "#F48B4A",   // -> utilidad Tailwind `brand-amber`
    "accent2":  "#E04870",   //                      `brand-coral`
    "accent3":  "#9B59B6",   //                      `brand-violet`
    "accent4":  "#5B7FC7",   //                      `brand-steel`
    "accent5":  "#3B82F6"    //                      `brand-azure`
  },
  "fonts":    { "sans": "Inter", "mono": "JetBrains Mono" },
  "logo":     "brand/logo.svg",
  "logoMono": "brand/logo-mono.svg"
}
```

## Aplicar una marca

```bash
npm run marca -- presentations/<carpeta>/index.html              # la marca activa
npm run marca -- presentations/<carpeta>/index.html --brand nfq  # un preset
npm run marca -- presentations/<carpeta>/index.html --dry        # sin escribir, solo el diff
```

El script sustituye paleta (incluidas las formas `rgba()` translúcidas), nombre, dominio, logo y
tipografías, y deja sellado en `<html data-brand="...">` qué marca lleva el fichero. Eso lo hace
**idempotente y reversible**: puedes ir y volver entre marcas sin que el HTML se degrade.

Ese sellado es también lo que el script lee para saber de dónde parte. Si aplicas una marca desde
un `.json` externo al repositorio y luego quieres revertirla, ese descriptor tiene que seguir
disponible: indícalo con `--from ruta/al/descriptor.json`. Por eso conviene que toda marca que
llegue a usarse viva en `presets/`.

## Crear una marca nueva

1. `cp presets/base.json presets/mimarca.json` y edita los campos.
2. Sustituye `logo.svg` y `logo-mono.svg` por los tuyos: `viewBox` de proporción 4:5
   (p. ej. `0 0 96 120`); el monocromo debe pintar con `fill="currentColor"` para seguir al tema.
3. Aplícala: `npm run marca -- <fichero> --brand mimarca`.
4. Si va a ser la marca por defecto, cópiala sobre `brand.json`.

La marca activa es **nfq advisory**: `brand/logo.svg` es su isotipo a todo color y
`brand/logo-mono.svg` la variante que sigue al tema en los documentos.

> El isotipo original venía con un bloque `<style>` y clases `.cls-1`, `.cls-2`… Al incrustarse
> dentro de un `<symbol>` esas reglas se aplican a todo el documento, así que está reescrito con
> atributos de presentación. Los trazados y los gradientes son los del original.

## Presets incluidos

- **`nfq`** — la marca activa, duplicada como preset para poder volver a ella tras una prueba.
- **`base`** — la misma paleta sin nombre comercial ni isotipo corporativo, con un monograma
  genérico en `presets/generic-logo.svg`. Punto de partida para crear una marca nueva.
