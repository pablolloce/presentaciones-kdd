# Presentaciones corporativas

Sistema para producir presentaciones corporativas en **HTML de un solo fichero**: se abren en
cualquier navegador sin build ni servidor, se exportan a PDF y PPTX, y llevan siempre la misma
marca. La marca activa es **nfq advisory**.

Está pensado para usarse conversando con Claude Code: pides la presentación, y el repositorio
aporta las plantillas, la marca y la verificación de estándares.

---

## Empezar

```bash
npm install                       # solo para exportar; abrir un deck no requiere nada
```

Crear una presentación:

```bash
npm run nueva -- "Plan de transformación digital 2026" --format deck
```

Formatos disponibles:

| `--format` | Qué produce |
|---|---|
| `deck` | Deck de slides pensado para exportar a PDF/PPTX y enviarlo |
| `deck-live` | Deck para presentar en pantalla, con efectos 3D |
| `pov` | Documento de posición / *thought leadership* |
| `status` | Informe de estado periódico |
| `playbook` | Plan de implantación con hitos, workstreams y RACI |
| `concept` | Explicativo de concepto con fórmulas |

Verificar antes de entregar:

```bash
npm run verificar
```

Exportación con calidad de cliente (incrusta capturas exactas de cada slide):

```bash
npm run capturar -- presentations/<carpeta>/index.html --theme light --lang es --width 1280 --height 720
```

Servir todas las presentaciones en local:

```bash
npm run servir      # http://localhost:8765
```

## Ejemplo incluido

`presentations/2026-09-ejemplo-transformacion-digital/index.html` — deck completo de 13 slides
que demuestra las maquetas disponibles y las reglas de contenido: portada, separadores de sección,
slide editorial, tabla de datos con fuente, diagrama de flujo, capas de arquitectura, matriz de
opciones, plan por fases, tabla de riesgos, caso de negocio y slide de decisión.

Ábrelo directamente en el navegador. Las cifras son ilustrativas y están marcadas como tales.

## Estructura

```
brand/                  Marca: paleta, logo, tipografías y presets alternativos
presentations/          Una carpeta por presentación, autocontenida
scripts/                Andamiaje, marca, captura y verificación
.claude/skills/         Las skills que Claude Code carga automáticamente
  presentacion-corporativa/   Orquesta el encargo de principio a fin
  html-presentation/          Plantillas, estilobooks y anatomía de slides
  frontend-design/            Dirección creativa
  design-polish/              Pase final de calidad
  design-audit/               Auditoría sin modificar nada
  humanizer/                  Limpia los tics de redacción generada
CLAUDE.md               Los estándares que Claude debe cumplir en cada encargo
```

## Cambiar la marca

Toda la identidad vive en `brand/brand.json` — hoy, la de nfq advisory. Para otra marca, edítalo
y reaplícalo:

```bash
npm run marca -- presentations/<carpeta>/index.html
```

Ver `brand/README.md` para el detalle.

## Navegación de un deck

| Acción | Cómo |
|---|---|
| Avanzar / retroceder | Flechas ← → |
| Cambiar de sección | Botones de la barra superior |
| Tema claro / oscuro / cristal | Barra inferior |
| Exportar | Botones PDF · Imprimir · IMG · PPTX |

## Requisitos

- Para **abrir** una presentación: un navegador. Nada más.
- Para **exportar con pre-captura**: Node 18+ y `npm install` (descarga Playwright).
- Las plantillas cargan Tailwind, tipografías y librerías de exportación desde CDN. En un equipo
  sin conexión la maqueta se degrada; para entrega en frío, exporta a PDF o PPTX.
