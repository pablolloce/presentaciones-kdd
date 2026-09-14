# Marca

Toda la identidad visual de las presentaciones sale de aquí. Un solo fichero manda:
**`brand.json`**.

## Qué hay

| Fichero | Para qué |
|---|---|
| `brand.json` | La marca activa. Es la que aplica `scripts/new-deck.mjs` por defecto |
| `logo.svg` | Isotipo a todo color, para la portada y el cierre de los decks |
| `logo-mono.svg` | Isotipo monocromo (`currentColor`), para documentos y plantilla live |
| `logo-wordmark.svg` | Logotipo completo (isotipo + palabra) para el lockup de los decks |
| `fonts/embedded-fonts.css` | Fraunces, Inter y JetBrains Mono en woff2 base64 |
| `clients/` | Logotipo y color corporativo de cada cliente |
| `presets/` | Marcas alternativas, intercambiables con un comando |
| `assets/` | Material corporativo de apoyo (plantilla PPTX, etc.) |

## Clientes y co-marca

El formato principal lleva un lockup **cliente | nfq** en la barra de marca y en la portada:

```bash
npm run marca -- presentations/<carpeta>/index.html --cliente bbva
npm run nueva -- "Título" --cliente bbva     # ya lo aplica al crear
```

Cada cliente son dos ficheros en `clients/`:

```jsonc
// clients/bbva.json
{
  "id": "bbva",
  "name": "BBVA",
  "logo": "brand/clients/bbva.svg",
  "color": "#001391",          // se inyecta en el token --client
  "colorOnDark": "#FFFFFF"     // el mismo logotipo sobre separador oscuro
}
```

El SVG debe pintar con `fill="currentColor"`: así el color lo manda el JSON y basta cambiarlo
ahí para corregir toda la biblioteca. `apply-brand` prefija los ids de cada copia inyectada,
porque las dos apariciones del logotipo compartiendo `clipPath` se recortan entre sí.

**Dar de alta un cliente nuevo**: copia `bbva.json`, cambia nombre y color, y deja su SVG
en `clients/`. Nada más.

## Campos de `brand.json`

```jsonc
{
  "id":        "nfq",                  // identificador; queda sellado en <html data-brand="...">
  "name":      "nfq advisory",         // nombre completo, como aparece en pies y créditos
  "nameShort": "NFQ",                  // forma corta para cabeceras
  "url":       "nfq.es",               // dominio que aparece en los pies de documento
  "tagline":   "Advisory para banca, seguros y wealth & asset management",
  "legalLine": "nfq advisory · Documento confidencial",
  "surfaces": {              // superficies del lienzo
    "paper": "#FFFFFF",
    "bg":    "#F4F3EE",      // el crudo cálido, firma del sistema
    "bg2":   "#ECEBE4"
  },
  "palette": {
    "ink":      "#14141C",   // texto principal
    "inkLight": "#1A2340",
    "inkMid":   "#2A3558",
    "accent1":  "#EC683E",   // naranja  -> token --orange
    "accent2":  "#D13B5F",   // coral    -> --coral
    "accent3":  "#9B59B6",   // violeta  -> --purple
    "accent4":  "#217BEE",   // azul     -> --blue (acento primario)
    "accent5":  "#1C9D6C"    // verde    -> --green
  },
  "fonts":    { "sans": "Inter", "serif": "Fraunces", "mono": "JetBrains Mono" },
  "logo":         "brand/logo.svg",
  "logoMono":     "brand/logo-mono.svg",
  "logoWordmark": "brand/logo-wordmark.svg"
}
```

Los cinco acentos son los colores reales del isotipo nfq, no una aproximación. El formato
principal los expone como tokens CSS (`--blue`, `--coral`, `--orange`, `--purple`, `--green`):
**nunca escribas un hex en el markup**, o el cambio de marca dejará de funcionar.

## Tipografías

`fonts/embedded-fonts.css` lleva las tres familias en woff2 base64 y `apply-brand` lo inyecta
en el bloque `brand:fonts` de cada deck. Pesa ~400 KB y es lo que hace que el fichero sea
autosuficiente: sin él el deck depende de un CDN y se degrada en cuanto la red del cliente
bloquea Google Fonts.
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
