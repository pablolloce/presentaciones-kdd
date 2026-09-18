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

## Hilo conductor
Todo el deck cuelga del encargo que RDR tiene encima de la mesa: **sacar el Workstation de su
stack actual y llevar las ventanas a Angular sobre NOVA**. La misma migración aparece en la
slide de Work, en los proyectos de la demo y en las conversaciones del asistente, y las specs
que se citan son las que describen de verdad cómo está hecha hoy esa capa de pantalla.

## Recorrido (4 secciones, 19 slides)
| # | Sección | Lo que defiende |
|---|---|---|
| 01 | Qué es KDD | Una spec con identificador, dueño, versión y relaciones es un artefacto que sirve; un documento suelto no |
| 02 | El día a día | Dos formas de explotar el KB: preguntarle (asistente) y trabajar con él. Work ocupa tres slides: el requerimiento escrito en llano que produce el `WRK-PLAN`, ese plan con sus `WRK-TASK` repartidas, y una mini-demo donde el asistente de alta lo monta de verdad |
| 03 | Superpoderes | El eje agéntico. Un superpoder son **cuatro markdowns relacionados** —`agent.md`, `skill.md`, `harn.md`, `eval.md`—, se aterriza con un encargo de un lunes cualquiera comparando cómo se resuelve hoy y cómo con el KB delante, tiene su mini-demo del catálogo, y es transversal: el contexto lo pone siempre el KB |
| 04 | Demo | KDD Studio navegable, centrado en RDR |

La sección que describía KDD Studio se retiró a propósito: la herramienta se ve en la demo, y
contarla antes duplicaba el mismo contenido en dos registros.

## Interactividad
Hay **tres sitios donde se pincha**, no uno: la mini-demo de Work en la sección del día a
día, la mini-demo del catálogo de superpoderes, y la demo completa del final. Las tres usan
las mismas pantallas incrustadas, así que no pesan más que una. Las dos mini-demos abren
siempre por su pantalla —Work y Superpowers— y **vuelven a ella al reentrar en la slide**,
para que un clic de la pasada anterior no deje la sesión en otro sitio. Cada pantalla se
carga la primera vez que se entra en su slide, no al abrir el fichero.

La slide de demo lleva **las pantallas reales de KDD Studio incrustadas**, no una
reconstrucción: van en base64 y se vuelcan al iframe con `srcdoc`, el mismo mecanismo que usa
el propio mock-up. Se adaptan al hueco de la slide sin escalar, y no hacen una sola petición
de red. Están las ocho: Explorador de fuentes, Home, Knowledge, Work, Governance, Sync, Graph y
Superpowers. A cada una se le inyecta un puente que convierte los clics de sus pestañas en un
aviso al deck, para que naveguen entre ellas como en la herramienta.

El deck pesa **8,1 MB** por esto. Es el precio de enseñar la herramienta de verdad.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Las pantallas de KDD Studio | `presentations/ejemplos-kdd/KDD_Mockup_Nueva_Version.html` |
| **El glosario: 217 specs con su id, capa, dominio, estado e Intent** | **`github.com/pablolloce/borrar` · la base de conocimiento real de RDR** |
| **El grafo: 217 nodos y 513 relaciones declaradas** | **Las `dependencies` de cada spec y `.kdd-studio/spec-graph.json`** |
| **Las dudas: 19 pendientes y 97 resueltas, con su `oq-…`, su pregunta y su fichero de origen** | **`specs/_pending-tasks/` del mismo repositorio** |
| **La ficha de la fuente: RDR, S054 y su sitio en el árbol** | **`.kdd-studio/sources-registry.json`** |
| Los cuatro proyectos de Work, y el plan de la slide | Escritos para la demo, apoyados en specs reales de RDR. Dos son la migración a NOVA. La slide del plan enseña las seis tareas del primero |
| El guion del asistente de alta de la mini-demo | Reescrito sobre la migración a NOVA: el documento de alcance, las dos dudas y los recursos que se asignan. La ficha que monta sale del primer proyecto |
| El superpoder `Analista de ventana RDR` | Escrito para la sesión: es el del ejemplo del lunes, y se añadió al catálogo para que se vea donde vive |
| **La pregunta y la respuesta del asistente en la slide** | **Facilitada por el usuario. Las tres specs que cita —`DOM-FINS-S054-001`, `FEAT-S054-020`, `ARCH-S054-019`— existen, y lo que se afirma de `ft_t_fins` y de los modelos hermanos está en ellas** |
| Las dos conversaciones del asistente sobre la migración | Escritas para la demo, citando specs reales de arquitectura de pantalla |
| **El equipo de Governance** | **Facilitado por el usuario** |
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
dos son la migración a NOVA: las ventanas a Angular y el salto del build de Ant al pipeline de
la plataforma. Están en cuatro estados distintos: dos en curso, uno en borrador y uno completado.

Lo que **sigue siendo mock-up** y hay que sustituir antes de presentar:

- **El catálogo de superpoderes.** Los 17 son los del mock-up. El decimoctavo, `Analista de
  ventana RDR`, está escrito para la sesión: ni existe ni tiene esas 96 ejecuciones.
- **Las conversaciones del asistente.** Las dos de la migración están escritas para la demo: el
  contenido es coherente con las specs que cita, pero no son diálogos que haya tenido nadie.
  Las otras cinco vienen del mock-up.
- **Las personas de las tareas de Work.** Los nombres asignados a cada tarea son inventados,
  tanto en la demo como en la slide del plan.
  Los de **Governance** son el equipo real, con los roles que indicó el usuario.
- **Datos personales en un repositorio público.** Governance lleva direcciones de personas
  reales y este repositorio es público, así que quedan expuestas y permanecen en el historial
  de git. Se incorporaron con el visto bueno explícito del usuario.
- **Datos de otras áreas en el explorador.** El árbol trae las demás aplicaciones de BBVA CIB y
  **el nombre y el cargo de una persona real**. Si el deck sale del equipo, hay que limpiarlo.

El deck **no contiene ninguna cifra de negocio**: no se afirma ningún ahorro ni porcentaje,
porque no hay medición propia que lo respalde.
