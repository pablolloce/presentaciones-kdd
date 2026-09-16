# RDR - KDD para el ANS

- **Fichero**: `RDR_-_KDD_para_el_ANS.html`
- **Formato**: Deck sobre lienzo 1600×900 (formato principal)
- **Cliente**: BBVA — co-marca BBVA | nfq
- **Creada**: 2026-09-14
- **Audiencia**: equipo de soporte / ANS. Sin conocimiento previo del framework.
- **Objetivo de la sesión**: que el equipo entienda qué es el KDD, qué hay ya funcionando
  y qué les cambia a ellos en el día a día.

## Mensaje único
El KDD no es documentar más: es que la documentación tenga **identificador, dueño, versión y
relaciones** el día que el servicio llega a soporte. Eso convierte tres preguntas que hoy cuestan
una mañana —a qué afecta, por qué hace esto, dónde está escrito— en algo que se consulta.

## Recorrido (8 secciones, 20 slides)
| # | Sección | Lo que defiende |
|---|---|---|
| 01 | El origen | El problema no es escribir poca documentación, es que el artefacto no sirve. El SDD cambia el artefacto |
| 02 | El framework | El KDD añade al SDD lo que falta para una organización: relaciones, responsables y gobierno |
| 03 | Las specs | Cinco tipos, una cabecera estructurada y un cuerpo legible. Es un fichero de texto en un repositorio |
| 04 | El grafo | Las relaciones declaradas son lo que convierte una colección de documentos en algo recorrible |
| 05 | Hoy | RDR ya tiene una gema GPT que responde con las specs delante y va señalando huecos |
| 06 | KDD Work | WRK-SPEC → WRK-PLAN (Feature) → WRK-TASK (Historia). Lo nuevo es el campo `activates` |
| 07 | Soporte | El traspaso pasa de sesión de transferencia a repositorio. Y el ANS alimenta el KB, no solo lo consulta |

## Interactividad
La slide 12 lleva un **grafo navegable**: once specs de RDR, clic en cualquier nodo para ver sus
relaciones resaltadas y su ficha en el panel lateral. Segundo clic o clic fuera para volver.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Definición de KDD, KB y spec; las tres capas; los cinco tipos | `presentations/ejemplos-kdd/KDD-BBVA-CIB-bbva.html` |
| WRK-SPEC / WRK-PLAN / WRK-TASK | `presentations/ejemplos-kdd/KDD_Mockup_Nueva_Version.html` |
| RDR como desarrollo puro de código | `presentations/ejemplos-kdd/Caballos_Ganadores_Vistazo_1.html` |
| Gema GPT sobre RDR, mapeo con Jira | Encargo del usuario |
| Ventajas para el ANS y los próximos pasos | Encargo del usuario |

## Marcadores de posición
Los identificadores de spec del grafo y del ejemplo (`DOM-RDR-014`, `ARCH-RDR-002`…) y sus
títulos son **inventados y plausibles**, no el inventario real de RDR. Sustituir por
identificadores reales antes de presentar.
