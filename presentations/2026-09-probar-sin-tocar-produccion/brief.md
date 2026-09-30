# Probar sin tocar producción

- **Fichero**: `index.html`
- **Formato**: Deck sobre lienzo 1600×900 (formato principal)
- **Cliente**: BBVA — co-marca BBVA | nfq
- **Creada**: 2026-09-30
- **Origen**: conversión de `presentacion_filtro_testing.html`, un deck propio de 28 slides
  con título «Filtro de testing RDR»
- **Audiencia**: el equipo de RDR y calidad, más quien tenga que dar el visto bueno a que
  esto se extienda al resto de procesos.
- **Objetivo de la sesión**: que se entienda que ya se puede probar una extracción de
  producción con datos controlados, y qué queda por cerrar para hacerlo con todas.

## Mensaje único
Las extracciones de RDR se pueden probar **con datos sintéticos y sin tocar una línea de
producción**: un paso posterior deja en una copia del fichero solo los registros de tu lista,
y a partir de ahí la prueba tiene algo concreto que comparar.

## Recorrido (4 secciones, 32 slides)
| # | Sección | Lo que defiende |
|---|---|---|
| 01 | El filtro | Sobre el fichero que sale hoy no se puede afirmar nada. Un paso nuevo, posterior a la extracción, aísla los registros de prueba sin tocar producción |
| 02 | AtSQA | Un caso de prueba son dos ficheros —los pasos y los valores— y el caso base ya está montado: solo faltan los cuatro pasos que comprueban |
| 03 | Base de datos | Si la prueba se prepara sus propios datos, la lista del filtro y los identificadores del PL/SQL son los mismos y las dos mitades encajan |
| 04 | Dónde estamos | El filtro está ensayado sobre el servidor de verdad. Lo que queda son detalles de AtSQA, y salen de terminar las specs |

## Qué cambió respecto al original
- **El título.** «Filtro de testing RDR» describía la pieza; **«Probar sin tocar producción»**
  dice para qué sirve. El subtítulo mantiene el alcance de las tres partes.
- **Los titulares de slide son afirmaciones, no etiquetas.** «El problema» pasó a «La
  extracción saca todo lo que hay en base de datos, no solo tus casos».
- **Cada slide de contenido cierra con su takeaway**, que el original no tenía.
- **Estructura de secciones con separadores**, de donde sale el navegador inferior.
- El flujo completo del original era un diagrama de tres carriles con cajas sueltas; aquí son
  tres bandas encadenadas, una por carril, que caben en el lienzo sin encoger la tipografía.
- Se retiraron dos slides de transición que solo anunciaban la parte siguiente: los
  separadores hacen ese trabajo.

## Procedencia del contenido
| Bloque | De dónde sale |
|---|---|
| Todo el contenido técnico | El deck original, facilitado por el usuario |
| La salida de consola de la demo | Ejecución real del paquete `demo_filtro.tar.gz` sobre ldrdr601 |
| Las buenas prácticas y los tropiezos | Documentación de EQAT y la primera ejecución real |
| El ejemplo de base de datos | Documentación de SQA, sobre una tabla de demo |

## Marcadores de posición
Lo que **no es real** y hay que tener presente al presentar:

- **Los datos de la demo son sintéticos**: nombres, correos e identificadores de los 12
  contactos están inventados, y así se dice en la propia slide.
- **La sección 03 es una propuesta sin probar.** Encadenar el PL/SQL de datos sintéticos con
  el filtro no se ha ejecutado todavía; queda por confirmar con SQA que `runSQLFile` acepta
  bloques PL/SQL.
- **Tres puntos abiertos con SQA**, marcados en el deck: si `runCommand` espera a que termine
  el comando, con qué usuario descarga `downloadFile`, y si `browser type="none"` evita
  necesitar Chrome.
- Los valores de conexión del ejemplo de SQA van **tapados a propósito**: son una conexión
  completa y su cifrado es reversible.

El deck **no contiene ninguna cifra de negocio**: no se afirma ningún ahorro ni porcentaje.
