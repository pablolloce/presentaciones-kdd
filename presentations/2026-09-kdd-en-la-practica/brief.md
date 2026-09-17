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
La slide de demo lleva **las pantallas reales de KDD Studio incrustadas**, no una
reconstrucción: van en base64 y se vuelcan al iframe con `srcdoc`, el mismo mecanismo que usa
el propio mock-up. Se adaptan al hueco de la slide sin escalar, y no hacen una sola petición
de red. Están las siete: Explorador de fuentes, Home, Knowledge, Work, Governance, Sync y
Superpowers. A cada una se le inyecta un puente que convierte los clics de sus pestañas en un
aviso al deck, para que naveguen entre ellas como en la herramienta.

El deck pesa **6,2 MB** por esto. Es el precio de enseñar la herramienta de verdad.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Las pantallas de KDD Studio | `presentations/ejemplos-kdd/KDD_Mockup_Nueva_Version.html` |
| **El glosario: 217 specs con su id, capa, dominio, estado e Intent** | **`github.com/pablolloce/borrar` · la base de conocimiento real de RDR** |
| **Las cifras del grafo: 218 nodos, 515 relaciones** | **`.kdd-studio/spec-graph.json` del mismo repositorio** |
| **Las dudas: 19 pendientes y 97 resueltas, con su `oq-…`, su pregunta y su fichero de origen** | **`specs/_pending-tasks/` del mismo repositorio** |
| **La ficha de la fuente: RDR, S054 y su sitio en el árbol** | **`.kdd-studio/sources-registry.json`** |
| Los cuatro proyectos de Work | Escritos para la demo, apoyados en specs reales de RDR |
| Los cuatro markdowns de un superpoder | Encargo del usuario |
| Definición de KDD y grafo de relaciones | `presentations/2026-09-kdd-soporte/` |

## Marcadores de posición
Lo que **sí es real**, extraído de la base de conocimiento de RDR: el glosario completo y sus
217 specs, los contadores del grafo, las dudas pendientes y resueltas, y la ficha de la fuente.

Lo que es **inventado pero coherente**: los cuatro proyectos de Work. El repositorio de RDR es
una base de conocimiento y no tiene proyectos, así que se han escrito para la demo — pero no al
azar: cada uno activa specs que existen de verdad, y dos nacen de algo que el propio KB
reconoce. El del circuito de aprobación, porque `ARCH-S054-018`, `ARCH-S054-039` y
`ARCH-S054-042` dicen que hoy ningún motor gobierna la aprobación. El de la retirada del
algoritmo de validación de cuenta, porque `DOM-ACCT-S054-001` lo declara retirado. Los otros
dos son un cambio en el frontal y un reintento de difusión. Están en cuatro estados distintos:
dos en curso, uno en borrador y uno completado.

Lo que **sigue siendo mock-up** y hay que sustituir antes de presentar:

- **El catálogo de superpoderes.** Los 17 son los del mock-up.
- **Las personas.** Los nombres que aparecen en las tareas son inventados.
- **Datos de otras áreas en el explorador.** El árbol trae las demás aplicaciones de BBVA CIB y
  **el nombre y el cargo de una persona real**. Si el deck sale del equipo, hay que limpiarlo.

El deck **no contiene ninguna cifra de negocio**: no se afirma ningún ahorro ni porcentaje,
porque no hay medición propia que lo respalde.
