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
  "id":        "kdd",                  // identificador; queda sellado en <html data-brand="...">
  "name":      "KDD",                  // nombre completo, como aparece en pies y créditos
  "nameShort": "KDD",                  // forma corta para cabeceras
  "url":       "kdd.example",          // dominio que aparece en los pies de documento
  "tagline":   "Presentaciones corporativas",
  "legalLine": "KDD · Documento confidencial",
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

## Crear una marca nueva

1. `cp presets/base.json presets/mimarca.json` y edita los campos.
2. Sustituye `logo.svg` y `logo-mono.svg` por los tuyos: `viewBox` de proporción 4:5
   (p. ej. `0 0 96 120`); el monocromo debe pintar con `fill="currentColor"` para seguir al tema.
3. Aplícala: `npm run marca -- <fichero> --brand mimarca`.
4. Si va a ser la marca por defecto, cópiala sobre `brand.json`.

## Presets incluidos

- **`base`** — la paleta con la que vienen las plantillas de referencia, sin nombre comercial.
- **`nfq`** — identidad de nfq advisory, que es la que traía el repositorio originalmente.
  Su isotipo está en `presets/nfq-logo.svg`.
