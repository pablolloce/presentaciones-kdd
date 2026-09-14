# Repositorio de presentaciones corporativas

Este repositorio existe para una sola cosa: **producir presentaciones corporativas en HTML**
que se abren en el navegador sin build ni servidor, se exportan a PDF/PPTX y llevan siempre
la misma marca. La marca activa es **nfq advisory** (`brand/brand.json`); no la cambies salvo
que el usuario lo pida.

**El formato principal es el deck sobre lienzo** (`references/deck-stage.html`): 1600×900
escalado al viewport, tipografías Fraunces + Inter + JetBrains Mono incrustadas, cero
dependencias de red y co-marca cliente | nfq. Los demás formatos son secundarios y solo se usan
cuando el encargo lo pide de forma explícita.

Cuando el usuario pida una presentación, sigue este documento. No improvises un formato propio.

---

## 1 · Flujo obligatorio

1. **Invoca la skill `presentacion-corporativa`.** Orquesta el resto y contiene el guion completo.
2. **Pregunta lo mínimo imprescindible.** El formato por defecto ya está decidido; lo único que
   suele hacer falta saber es para qué cliente es, para aplicar su co-marca. No interrogues al
   usuario con diez preguntas antes de enseñar nada.
3. **Parte siempre de una plantilla**, nunca de un HTML en blanco:
   `node scripts/new-deck.mjs "<Título>" --cliente <id>`
4. **Edita el contenido** siguiendo
   `.claude/skills/html-presentation/references/deck-stage-stylebook.md`.
5. **Verifica antes de entregar**: `npm run verificar`. Cero errores es condición de entrega.
6. **Exporta a PDF con la impresión del navegador** (Cmd+P, horizontal, sin márgenes). El formato
   principal no lleva librerías de exportación a propósito: cargarlas desde un CDN rompería la
   promesa de fichero autosuficiente. Solo los formatos secundarios usan `npm run capturar`.
7. **Entrega la ruta del fichero** y di qué queda pendiente de datos reales.

## 2 · Dónde vive cada cosa

| Ruta | Qué es |
|---|---|
| `presentations/<AAAA-MM>-<slug>/index.html` | Cada presentación, autocontenida |
| `presentations/<AAAA-MM>-<slug>/brief.md` | Encargo, audiencia y fuentes de esa presentación |
| `.claude/skills/html-presentation/references/deck-stage.html` | **La plantilla principal.** Solo lectura |
| `.claude/skills/html-presentation/references/deck-stage-stylebook.md` | **Su estilobook.** Lectura obligatoria |
| `.claude/skills/html-presentation/references/` | Plantillas secundarias y estilobooks. **Solo lectura** |
| `brand/clients/` | Logotipo y color corporativo de cada cliente |
| `brand/brand.json` | La marca activa: nombre, paleta, tipografías, logo |
| `brand/presets/` | Marcas alternativas intercambiables |
| `scripts/` | Andamiaje, marca, captura y verificación |

Nunca edites una plantilla de `references/` para resolver un encargo concreto. Si el encargo
necesita algo que la plantilla no da, cópiala primero y modifica la copia. Las plantillas solo
cambian cuando el usuario pide explícitamente cambiar el sistema.

## 3 · Estándares no negociables

Los verifica `npm run verificar` y fallan la entrega:

- **Marca aplicada.** `<html data-brand="...">` presente. Se consigue con `npm run marca -- <fichero>`.
- **Marca visible**: el lockup `.nfq-mark` (formato principal) o el isotipo `#brand-iso`.
- **Cero dependencias de red** en el formato principal. Ni un CDN, ni una tipografía remota.
- **Fichero autosuficiente**: ningún recurso referenciado por ruta relativa puede faltar.
- **`data-nav` en cada separador**: de ahí sale el navegador de secciones.
- **`.takeaway` y `.headline` en cada slide de contenido.** Portada, sumario y separadores
  están exentos porque no argumentan nada.
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
- **Una idea por slide**, enunciada en el `.headline` como afirmación, no como etiqueta.
  «El 38 % del tiempo se va en reintroducir datos», no «Análisis de tiempos».
- **Escribe en el idioma del encargo** y mantén las tildes.

### Reglas propias del formato principal

- **Ningún hex suelto en el markup.** Usa los tokens CSS; si no, el cambio de marca deja de
  funcionar y `apply-brand` no puede sustituir el color.
- **Ningún contador ni etiqueta de sección escrito a mano.** Se calculan solos a partir de las
  slides y de los `data-nav`. Escribirlos a mano garantiza que se desincronicen.
- **Maqueta en píxeles absolutos** sobre el lienzo de 1600×900. Nada de `vw` / `vh` dentro de
  una slide: rompen la garantía de que lo diseñado es lo proyectado.

## 5 · Cambiar de marca

La marca vive en `brand/brand.json` y se propaga con un comando:

```bash
npm run marca -- presentations/<carpeta>/index.html            # aplica la marca activa
npm run marca -- presentations/<carpeta>/index.html --brand nfq # aplica un preset
npm run marca -- presentations/<carpeta>/index.html --dry       # muestra qué cambiaría
npm run marca -- presentations/<carpeta>/index.html --cliente bbva  # co-marca de cliente
```

Sustituye paleta, nombre, dominio y logo. Es idempotente y reversible: el fichero recuerda en
`data-brand` qué marca lleva puesta, así que puedes ir y volver entre marcas sin degradarlo.
Para que la vuelta funcione, la marca de origen tiene que seguir existiendo en `brand/presets/`
o indicarse con `--from`.

## 6 · Limitaciones conocidas

- El formato principal **no exporta a PPTX editable**: entrega PDF por impresión del navegador.
  Si el cliente necesita retocar las slides en PowerPoint, usa `--format deck-export`.
- **Las plantillas secundarias cargan Tailwind y librerías desde CDN.** Un equipo sin conexión,
  o una red corporativa que bloquee esos dominios, verá el deck degradado. Para entrega en frío
  con esos formatos: exporta a PDF o PPTX con pre-captura.
- **La exportación en el navegador necesita pre-captura** cuando hay imágenes embebidas, WebGL o
  tema Glass. Sin ella, html2canvas sustituye las imágenes por marcadores de posición.
- Cada idioma necesita su propia tanda de capturas (`--lang es`, `--lang en`).
