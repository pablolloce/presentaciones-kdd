# KDD en la práctica

- **Fichero**: `index.html`
- **Formato**: Deck sobre lienzo 1600×900 (formato principal)
- **Cliente**: ninguno — genérico, solo marca nfq
- **Creada**: 2026-09-17
- **Audiencia**: equipos de desarrollo y sus responsables, sin conocimiento previo del framework.
- **Objetivo de la sesión**: que se entienda qué es KDD, qué herramienta lo soporta y cómo se
  usa un día cualquiera. Es una sesión práctica, no una presentación de concepto.

## Mensaje único
El conocimiento deja de ser documentación que alguien escribe y nadie lee, y pasa a ser una
**base versionada con dueño y relaciones** que se consulta desde la herramienta en la que ya se
trabaja. Y una vez que existe esa base, los agentes dejan de improvisar: **toman el KB como
contexto**.

## Recorrido (5 secciones)
| # | Sección | Lo que defiende |
|---|---|---|
| 01 | Qué es KDD | Una spec con identificador, dueño, versión y relaciones es un artefacto que sirve; un documento suelto no |
| 02 | KDD Studio | El framework sin herramienta se queda en intención. Studio es donde el KB se explora, se cuida y se gobierna |
| 03 | El día a día | Dos formas de explotar el KB: preguntarle (asistente) y trabajar con él (Work) |
| 04 | Superpoderes | El eje agéntico: agentes especialistas transversales al KB. Eliges con quién hablas y qué agente usa; el contexto siempre es el KB |
| 05 | Demo | KDD Studio navegable: entrar en una base de conocimiento, preguntar al asistente y ver Work |

## Interactividad
La sección de demo lleva un **KDD Studio navegable** dentro de la slide: selector de base de
conocimiento, los ejes Knowledge / Work / Governance, el asistente con sus citas a specs y el
tablero de Work. Todo es markup y JS local, sin red.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Narrativa de producto de KDD Studio: Home, Knowledge Base Explorer, los ejes Knowledge / Work / Governance, Sincronización, Grafo | `presentations/ejemplos-kdd/KDD_Mockup_Nueva_Version.html` (armazón del mock-up) |
| Modelo de los superpoderes: eje, ámbito (transversal / por KB / personal), versión, estado, dueño y KB de contexto | Pantalla `Superpowers Explorer` del mismo mock-up |
| Selector de asistente, modelo, esfuerzo y ventana de contexto | Misma pantalla |
| Definición de KDD, tipos de spec y grafo de relaciones | `presentations/2026-09-kdd-soporte/` |
| Encuadre del eje agéntico como «Superpoderes» transversales | Encargo del usuario |

## Marcadores de posición
- El mock-up de origen es de un cliente concreto: **los nombres propios se han generalizado**
  (nada de marcas, sistemas ni áreas de cliente). Los superpoderes del catálogo son ejemplos
  plausibles de las mismas categorías, no un inventario real.
- Los identificadores de spec, las cifras de uso y los contenidos del KB de demo (`RDR`) son
  **datos de mock-up**, ahí para que la pantalla se entienda. No son inventario real.
- El deck **no contiene ninguna cifra de negocio**: no se afirma ningún ahorro ni porcentaje,
  porque no hay medición propia que lo respalde.
