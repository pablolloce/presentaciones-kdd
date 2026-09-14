---
name: presentacion-corporativa
description: Crear una presentación corporativa de principio a fin en este repositorio — deck de slides o documento long-scroll, en HTML de un solo fichero, con la marca aplicada y verificada contra los estándares. Úsala cuando el usuario pida una presentación, un deck, unas slides, una propuesta visual, un informe de estado, un playbook o un documento de posición. Orquesta `html-presentation` (implementación), `frontend-design` (dirección creativa), `design-polish` y `design-audit` (calidad), y los scripts de marca, captura y verificación.
user-invocable: true
---

Guion completo para pasar de un encargo hablado a un fichero entregable. Sigue los pasos en orden;
cada uno tiene una salida concreta.

## Paso 1 · Encuadrar el encargo (1 pregunta, no más)

**El formato por defecto es `deck`** — el deck sobre lienzo 1600×900, que es el estándar de la
casa. No preguntes por el formato salvo que el encargo suene claramente a documento de lectura
larga en vez de a presentación.

Lo único que hay que saber antes de arrancar es:

> «¿Para qué **cliente** es? Así aplico su co-marca.»

Si no hay cliente (interno, propuesta genérica), se genera solo con marca nfq.

Todo lo demás —audiencia, duración, tono— se infiere del contexto o se asume declarándolo.
Si el usuario ya lo ha dicho en su mensaje, no lo repreguntes.

| Encargo | `--format` |
|---|---|
| **Cualquier presentación (por defecto)** | **`deck`** |
| Hace falta PPTX editable para que el cliente lo retoque | `deck-export` |
| Escenas 3D en pantalla | `deck-live` |
| Punto de vista / thought leadership | `pov` |
| Informe de estado periódico | `status` |
| Plan de implantación | `playbook` |
| Explicativo de concepto | `concept` |

Clientes dados de alta: `brand/clients/`. Para uno nuevo bastan su SVG (que pinte con
`currentColor`) y un JSON con su color corporativo.

## Paso 2 · Construir el argumento antes que el HTML

No abras el fichero todavía. Escribe primero, en el chat o en `brief.md`:

1. **El mensaje único** que debe quedar si el público olvida todo lo demás.
2. **El recorrido**: 3–5 secciones, cada una con la afirmación que defiende.
3. **Los datos que hacen falta** y de dónde salen. Marca explícitamente los que no tienes.

Enseña esto al usuario antes de maquetar. Corregir un argumento cuesta un minuto; corregir
veinte slides ya maquetadas cuesta una tarde.

## Paso 3 · Crear el esqueleto

```bash
node scripts/new-deck.mjs "<Título>" --cliente <id>
```

Crea `presentations/<AAAA-MM>-<slug>/` con `index.html` (plantilla + marca activa ya aplicada)
y `brief.md`. Rellena `brief.md` con lo del paso 2.

## Paso 4 · Escribir el contenido

Lee **`.claude/skills/html-presentation/references/deck-stage-stylebook.md`** antes de tocar el
HTML. Ahí está la anatomía exacta de cada tipo de slide, la escala tipográfica, los tokens de
color, el catálogo de componentes y los anti-patrones.

Tres reglas del formato que no se negocian: **ningún hex suelto en el markup** (usa los tokens,
o el cambio de marca deja de funcionar), **ninguna dependencia de red** (el verificador la
rechaza) y **ningún contador ni etiqueta de sección escrito a mano** (se calculan solos).

Reglas que más se incumplen, en orden de frecuencia:

- **Cada `.ex-title` es una afirmación, no una etiqueta.** «El 38 % del tiempo se va en
  reintroducir datos», no «Análisis de tiempos».
- **Cada slide de contenido cierra con su `.takeaway`.** Es la frase que el público repetirá.
- **Varía la maqueta slide a slide.** Editorial → flujo → tabla → matriz → KPIs. Tres rejillas
  de KPIs seguidas se leen como plantilla.
- **Ninguna cifra sin fuente.** Si es estimación, dilo y di sobre qué supuestos.
- **Ningún gráfico que no responda a la pregunta del título.** Una slide editorial bien escrita
  gana a una slide ocupada con datos inventados.

Si el encargo es visualmente exigente (portada, apertura de sección, algo que tiene que
impresionar), apóyate en `frontend-design` para la dirección creativa antes de maquetar.

## Paso 5 · Pulir

Con el contenido completo, invoca `design-polish`: alineaciones, ritmo vertical, estados de
interacción, coherencia entre slides. Es el último paso antes de verificar, no el primero.

Para una revisión sin tocar nada (por ejemplo antes de enviar a un cliente exigente), usa
`design-audit`, que produce un informe priorizado.

## Paso 6 · Verificar

```bash
npm run verificar
```

Cero errores es condición de entrega. Los avisos se resuelven o se justifican al usuario.
Si el verificador señala tildes, corrígelas: el castellano sin tildes delata un deck generado.

## Paso 7 · Pre-capturar si hace falta

Obligatorio, sin preguntar, cuando el deck lleva imágenes embebidas en base64, escenas WebGL,
tema Glass o tablas grandes — y siempre que vaya a un cliente:

```bash
npm run capturar -- presentations/<carpeta>/index.html --theme light --lang es --width 1280 --height 720
```

En el formato principal la exportación a PDF es la impresión del navegador (Cmd+P, horizontal,
sin márgenes): no lleva librerías de exportación a propósito, porque cargarlas desde un CDN
rompería la promesa de fichero autosuficiente.

Repite por cada idioma activo (`--lang en` puebla `_PRECAPTURED_EN`). Vuelve a ejecutarlo
después de cualquier edición de slides: si no, la exportación entrega contenido caducado.

## Paso 8 · Entregar

Da la ruta del fichero, resume en dos líneas qué contiene y **di explícitamente qué datos son
marcadores de posición**. Un deck entregado con cifras inventadas sin avisar es el peor fallo
posible de este repositorio.

## Cambiar de marca

```bash
npm run marca -- presentations/<carpeta>/index.html --brand <id>     # cambiar de marca propia
npm run marca -- presentations/<carpeta>/index.html --cliente bbva   # aplicar co-marca de cliente
```

Los presets viven en `brand/presets/`. La marca activa está en `brand/brand.json`. Para crear
una marca nueva, copia un preset, cambia paleta, nombre, dominio y logo, y aplícalo.
