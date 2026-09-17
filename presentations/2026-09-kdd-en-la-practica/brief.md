# KDD en la práctica

- **Fichero**: `index.html`
- **Formato**: Deck sobre lienzo 1600×900 (formato principal)
- **Cliente**: BBVA — co-marca BBVA | nfq
- **Creada**: 2026-09-17
- **Audiencia**: equipos de desarrollo y sus responsables, sin conocimiento previo del framework.
- **Objetivo de la sesión**: que se entienda qué es KDD, cómo se explota el conocimiento un día
  cualquiera y qué pintan los agentes. Es una sesión práctica: la herramienta se enseña usándola,
  no describiéndola.

## Mensaje único
El conocimiento deja de ser documentación que alguien escribe y nadie lee, y pasa a ser una
**base versionada con dueño y relaciones** que se consulta desde la herramienta en la que ya se
trabaja. Y una vez que existe esa base, los agentes dejan de improvisar: **toman el KB como
contexto**.

## Recorrido (4 secciones, 17 slides)
| # | Sección | Lo que defiende |
|---|---|---|
| 01 | Qué es KDD | Una spec con identificador, dueño, versión y relaciones es un artefacto que sirve; un documento suelto no |
| 02 | El día a día | Dos formas de explotar el KB: preguntarle (asistente) y trabajar con él (Work y su contexto de conocimiento) |
| 03 | Superpoderes | El eje agéntico. Un superpoder son **cuatro markdowns relacionados** —`agent.md`, `skill.md`, `harn.md`, `eval.md`— y es transversal: el contexto lo pone siempre el KB |
| 04 | Demo | KDD Studio navegable, centrado en RDR |

La sección que describía KDD Studio se retiró a propósito: la herramienta se ve en la demo, y
contarla antes duplicaba el mismo contenido en dos registros.

## Interactividad
La slide de demo lleva **KDD Studio reconstruido dentro del lienzo**, con el mismo cromo y el
mismo vocabulario que el mock-up de producto:

- Barra superior con las dos áreas, **Knowledge Base** y **Superpowers**, el selector de motor y
  el disparador del asistente.
- Las seis pestañas de la fuente: **Home, Knowledge, Work, Governance, Sync y Graph**.
- Knowledge con sus cinco herramientas, el glosario filtrable por capa y la ficha de cada spec
  con su cabecera e *Intent · Definition · Acceptance Criteria*.
- Work con las pestañas *Proyecto · Plan · Recursos · Criterios* y el plan en diagrama de barras.
- El asistente en panel lateral, con preguntas que responden citando spec y versión.
- El explorador de superpoderes, con los cuatro markdowns de cada uno.

Todo es markup y JS local: ni una petición de red.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Cromo, pantallas, pestañas y vocabulario de KDD Studio | `presentations/ejemplos-kdd/KDD_Mockup_Nueva_Version.html` |
| Capas de spec, campos de cabecera (`layer`, `status`, `confidence`, `owner`, `dependencies`) y apartados del cuerpo | Pantalla `Knowledge` del mismo mock-up |
| Herramientas de Knowledge, estados de Sync y artefactos de Work | Mismo mock-up |
| Los cuatro markdowns de un superpoder y qué define cada uno | Encargo del usuario |
| Definición de KDD y grafo de relaciones | `presentations/2026-09-kdd-soporte/` |

## Marcadores de posición
- El mock-up de origen trae datos de otro servicio: **todo se ha reescrito sobre RDR** y los
  nombres propios ajenos se han retirado.
- Los identificadores de spec, las cifras del KB, el proyecto de Work y los superpoderes del
  explorador son **datos de mock-up**, ahí para que la pantalla se entienda. El glosario dice
  expresamente que enseña una muestra.
- El deck **no contiene ninguna cifra de negocio**: no se afirma ningún ahorro ni porcentaje,
  porque no hay medición propia que lo respalde.
