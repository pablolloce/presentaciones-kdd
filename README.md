# Presentaciones corporativas

Sistema para producir presentaciones corporativas en **HTML de un solo fichero**: se abren en
cualquier navegador sin build ni servidor, se exportan a PDF y PPTX, y llevan siempre la misma
marca. La marca activa es **nfq advisory**, con co-marca de cliente cuando procede.

El formato principal es un **deck sobre lienzo fijo de 1600×900**: tipografías incrustadas,
cero dependencias de red y navegación por flechas. Se ve igual en un portátil sin wifi que
en la sala del cliente.

Está pensado para usarse conversando con Claude Code: pides la presentación, y el repositorio
aporta las plantillas, la marca y la verificación de estándares.

---

## Empezar

```bash
npm install                       # solo para exportar; abrir un deck no requiere nada
```

Crear una presentación:

```bash
npm run nueva -- "Plan de transformación digital 2026" --cliente bbva
```

Formatos disponibles:

| `--format` | Qué produce |
|---|---|
| **`deck`** *(por defecto)* | **Deck sobre lienzo 1600×900, autosuficiente, con co-marca** |
| `deck-export` | Deck con exportación a PPTX editable (usa CDN) |
| `deck-live` | Deck para presentar en pantalla, con efectos 3D |
| `pov` | Documento de posición / *thought leadership* |
| `status` | Informe de estado periódico |
| `playbook` | Plan de implantación con hitos, workstreams y RACI |
| `concept` | Explicativo de concepto con fórmulas |

Verificar antes de entregar:

```bash
npm run verificar
```

Exportar a PDF: ábrelo e imprime desde el navegador (Cmd+P, horizontal, sin márgenes). El
formato principal no lleva librerías de exportación a propósito — cargarlas desde un CDN
rompería la promesa de fichero autosuficiente.

Los formatos secundarios sí las llevan, y para ellos hay pre-captura:

```bash
npm run capturar -- presentations/<carpeta>/index.html --theme light --lang es --width 1280 --height 720
```

Servir todas las presentaciones en local:

```bash
npm run servir      # http://localhost:8765
```

## Ejemplo incluido

`presentations/2026-09-ejemplo-transformacion-digital/index.html` — deck de 14 slides con
co-marca BBVA | nfq que demuestra todos los componentes del sistema: portada, sumario navegable,
separadores, slide editorial, datos con fuente, proceso por pasos, cita, plan por fases, riesgos,
caso de negocio y decisión.

Es la salida directa de `npm run nueva`. Ábrelo en el navegador: flechas ← → para pasar,
clic en el navegador de secciones para saltar. Las cifras son ilustrativas y están marcadas
como tales.

`presentations/ejemplos-kdd/` guarda los decks originales que sirvieron de referencia para
construir el sistema. Son material de consulta, no entregables: quedan fuera de `npm run verificar`.

## Estructura

```
brand/                  Marca: paleta, logotipos, tipografías incrustadas y presets
  clients/              Logotipo y color corporativo de cada cliente
  fonts/                Fraunces, Inter y JetBrains Mono en base64
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
| Ir al principio / final | `Inicio` / `Fin` |
| Cambiar de sección | Botones del navegador inferior |
| Abrir en una slide concreta | `?slide=7` en la URL |
| Exportar a PDF | Cmd+P · horizontal · sin márgenes |

## Requisitos

- Para **abrir** una presentación del formato principal: un navegador. Sin red, sin nada más.
- Para **crear** una: Node 18+.
- Para **pre-capturar** los formatos secundarios: `npm install` (descarga Playwright).
- Los formatos secundarios sí cargan Tailwind y librerías desde CDN: en un equipo sin conexión
  se degradan. Para entrega en frío con esos formatos, exporta a PDF o PPTX.
