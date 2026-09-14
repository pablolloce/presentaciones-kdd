# Repositorio de presentaciones corporativas

Este repositorio existe para una sola cosa: **producir presentaciones corporativas en HTML**
que se abren en el navegador sin build ni servidor, se exportan a PDF/PPTX y llevan siempre
la misma marca. La marca activa es **nfq advisory** (`brand/brand.json`); no la cambies salvo
que el usuario lo pida.

Cuando el usuario pida una presentación, sigue este documento. No improvises un formato propio.

---

## 1 · Flujo obligatorio

1. **Invoca la skill `presentacion-corporativa`.** Orquesta el resto y contiene el guion completo.
2. **Pregunta lo mínimo imprescindible** (formato y audiencia) y arranca. No interrogues al usuario
   con diez preguntas antes de enseñar nada.
3. **Parte siempre de una plantilla**, nunca de un HTML en blanco:
   `node scripts/new-deck.mjs "<Título>" --format <deck|deck-live|pov|status|playbook|concept>`
4. **Edita el contenido** siguiendo `.claude/skills/html-presentation/SKILL.md`.
5. **Verifica antes de entregar**: `npm run verificar`. Cero errores es condición de entrega.
6. **Pre-captura si el deck lleva imágenes, WebGL o tema Glass**:
   `npm run capturar -- presentations/<carpeta>/index.html --theme light --lang es --width 1280 --height 720`
7. **Entrega la ruta del fichero** y di qué queda pendiente de datos reales.

## 2 · Dónde vive cada cosa

| Ruta | Qué es |
|---|---|
| `presentations/<AAAA-MM>-<slug>/index.html` | Cada presentación, autocontenida |
| `presentations/<AAAA-MM>-<slug>/brief.md` | Encargo, audiencia y fuentes de esa presentación |
| `.claude/skills/html-presentation/references/` | Las 6 plantillas y los estilobooks. **Solo lectura** |
| `brand/brand.json` | La marca activa: nombre, paleta, tipografías, logo |
| `brand/presets/` | Marcas alternativas intercambiables |
| `scripts/` | Andamiaje, marca, captura y verificación |

Nunca edites una plantilla de `references/` para resolver un encargo concreto. Si el encargo
necesita algo que la plantilla no da, cópiala primero y modifica la copia. Las plantillas solo
cambian cuando el usuario pide explícitamente cambiar el sistema.

## 3 · Estándares no negociables

Los verifica `npm run verificar` y fallan la entrega:

- **Marca aplicada.** `<html data-brand="...">` presente. Se consigue con `npm run marca -- <fichero>`.
- **Isotipo** en todas las slides vía `<use href="#brand-iso"/>`.
- **`data-section`** en cada slide: alimenta el navegador de secciones automático.
- **`.takeaway` en cada slide de contenido.** Una frase que cierra el argumento. Portada y
  separadores están exentos porque no argumentan nada.
- **Cero texto de relleno.** Nada de lorem ipsum ni de «texto de ejemplo» en una entrega.
- **Cero rutas absolutas** de una máquina concreta (`/Users/...`, `/Volumes/...`, `C:\`).
- **Sin `line-through`**: ninguna tabla comparativa anula visualmente a un competidor.
- **Tildes correctas** en castellano. El verificador avisa de las omisiones más frecuentes.

## 4 · Reglas de contenido

Estas no las puede comprobar un script, y son las que separan un deck bueno de uno que parece
generado:

- **Ningún dato sin fuente.** Si una cifra no tiene origen citable, no entra. Si es una estimación,
  se dice que lo es y sobre qué supuestos.
- **Ningún gráfico decorativo.** Un gráfico se justifica solo si responde a la pregunta que plantea
  el título de la slide. Una slide editorial —una tesis, un párrafo y su conclusión— es una slide
  perfectamente válida y a menudo la mejor.
- **Varía las maquetas.** Tres slides seguidas con la misma rejilla de KPIs se leen como una
  plantilla, no como un argumento. Alterna: editorial → flujo → tabla → matriz → KPIs.
- **Una idea por slide**, enunciada en el `.ex-title` como afirmación, no como etiqueta.
  «El 38 % del tiempo se va en reintroducir datos», no «Análisis de tiempos».
- **Escribe en el idioma del encargo** y mantén las tildes.

## 5 · Cambiar de marca

La marca vive en `brand/brand.json` y se propaga con un comando:

```bash
npm run marca -- presentations/<carpeta>/index.html            # aplica la marca activa
npm run marca -- presentations/<carpeta>/index.html --brand nfq # aplica un preset
npm run marca -- presentations/<carpeta>/index.html --dry       # muestra qué cambiaría
```

Sustituye paleta, nombre, dominio y logo. Es idempotente y reversible: el fichero recuerda en
`data-brand` qué marca lleva puesta, así que puedes ir y volver entre marcas sin degradarlo.
Para que la vuelta funcione, la marca de origen tiene que seguir existiendo en `brand/presets/`
o indicarse con `--from`.

## 6 · Limitaciones conocidas

- Las plantillas cargan **Tailwind, tipografías y librerías de exportación desde CDN**. Un equipo
  sin conexión, o una red corporativa que bloquee esos dominios, verá el deck con la maqueta
  degradada. Para entrega en frío: exporta a PDF o PPTX con pre-captura.
- **La exportación en el navegador necesita pre-captura** cuando hay imágenes embebidas, WebGL o
  tema Glass. Sin ella, html2canvas sustituye las imágenes por marcadores de posición.
- Cada idioma necesita su propia tanda de capturas (`--lang es`, `--lang en`).
