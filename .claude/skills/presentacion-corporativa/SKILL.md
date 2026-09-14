---
name: presentacion-corporativa
description: Crear una presentación corporativa de principio a fin en este repositorio — deck de slides o documento long-scroll, en HTML de un solo fichero, con la marca aplicada y verificada contra los estándares. Úsala cuando el usuario pida una presentación, un deck, unas slides, una propuesta visual, un informe de estado, un playbook o un documento de posición. Orquesta `html-presentation` (implementación), `frontend-design` (dirección creativa), `design-polish` y `design-audit` (calidad), y los scripts de marca, captura y verificación.
user-invocable: true
---

Guion completo para pasar de un encargo hablado a un fichero entregable. Sigue los pasos en orden;
cada uno tiene una salida concreta.

## Paso 1 · Encuadrar el encargo (2 preguntas, no más)

Pregunta solo lo que cambia materialmente el resultado:

**P1 · Formato.** «¿Es un **deck de slides** para exponer, o un **documento** para leer en pantalla?»

**P2 · según la respuesta:**
- Deck → «¿Para **exportar a PDF/PPTX** y enviarlo, o para **presentar en pantalla** con efectos?»
- Documento → «¿**Punto de vista**, **informe de estado**, **playbook** o **explicativo de concepto**?»

Todo lo demás (audiencia, duración, tono) se infiere del contexto o se asume y se declara.
Si el usuario ya lo ha dicho en su mensaje, no lo repreguntes.

| Respuesta | `--format` |
|---|---|
| Deck para enviar | `deck` |
| Deck para presentar en pantalla | `deck-live` |
| Punto de vista | `pov` |
| Informe de estado | `status` |
| Playbook / plan | `playbook` |
| Explicativo de concepto | `concept` |

En caso de duda con un deck, elige `deck`. Un deck que se exporta perfecto vale más que uno
espectacular que el cliente no puede llevarse.

## Paso 2 · Construir el argumento antes que el HTML

No abras el fichero todavía. Escribe primero, en el chat o en `brief.md`:

1. **El mensaje único** que debe quedar si el público olvida todo lo demás.
2. **El recorrido**: 3–5 secciones, cada una con la afirmación que defiende.
3. **Los datos que hacen falta** y de dónde salen. Marca explícitamente los que no tienes.

Enseña esto al usuario antes de maquetar. Corregir un argumento cuesta un minuto; corregir
veinte slides ya maquetadas cuesta una tarde.

## Paso 3 · Crear el esqueleto

```bash
node scripts/new-deck.mjs "<Título>" --format <formato>
```

Crea `presentations/<AAAA-MM>-<slug>/` con `index.html` (plantilla + marca activa ya aplicada)
y `brief.md`. Rellena `brief.md` con lo del paso 2.

## Paso 4 · Escribir el contenido

Lee `.claude/skills/html-presentation/SKILL.md` y el estilobook que corresponda **antes** de
tocar el HTML. Ahí está la anatomía exacta de cada tipo de slide, las primitivas de CSS
disponibles y las maquetas prohibidas.

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

Repite por cada idioma activo (`--lang en` puebla `_PRECAPTURED_EN`). Vuelve a ejecutarlo
después de cualquier edición de slides: si no, la exportación entrega contenido caducado.

## Paso 8 · Entregar

Da la ruta del fichero, resume en dos líneas qué contiene y **di explícitamente qué datos son
marcadores de posición**. Un deck entregado con cifras inventadas sin avisar es el peor fallo
posible de este repositorio.

## Cambiar de marca

```bash
npm run marca -- presentations/<carpeta>/index.html --brand <id>
```

Los presets viven en `brand/presets/`. La marca activa está en `brand/brand.json`. Para crear
una marca nueva, copia un preset, cambia paleta, nombre, dominio y logo, y aplícalo.
