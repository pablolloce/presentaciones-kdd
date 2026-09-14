# Estilobook · deck sobre lienzo (formato principal)

Especificación del formato con el que se producen las presentaciones de este
repositorio. Léelo antes de escribir o editar un deck. La plantilla es
`deck-stage.html`; se copia con `node scripts/new-deck.mjs`, nunca se edita en su sitio.

---

## 1 · Principios

**Lienzo fijo de 1600×900, escalado al viewport.** Se maqueta en píxeles absolutos.
Lo que se ve al diseñar es exactamente lo que se proyecta, en cualquier pantalla.
No uses unidades relativas al viewport (`vw`, `vh`) dentro de una slide: rompen esa garantía.

**Fichero autosuficiente.** Las tres tipografías van incrustadas en base64 y no hay una
sola petición de red al abrir el deck. Es la diferencia entre presentar y rezar para que
la wifi del cliente deje pasar un CDN. `npm run verificar` falla si aparece un dominio externo.

**Una idea por slide, cerrada con su conclusión.** Toda slide de contenido termina en
`.takeaway`. Portada, sumario y separadores están exentos porque no argumentan.

---

## 2 · Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Display | **Fraunces** (serif) | `ctitle`, `headline`, `dv-mega`, `c-t`, `kp-v`, `toc-t`, `quote` |
| Texto | **Inter** | `lead`, `c-d`, tablas, `sub` |
| Etiqueta | **JetBrains Mono** | `eyebrow`, `c-n`, `kp-k`, `tag`, contador, `footnote .fk` |

La serif es lo que da carácter al sistema: úsala en los titulares y en las cifras grandes,
nunca en párrafos largos. El mono es para etiquetas y datos, nunca para prosa.

Escalas fijas (no las cambies por slide): `ctitle` 104 · `dv-mega` 118 · `headline` 52 ·
`quote` 38 · `tagline` 38 · `lead` 23 · `c-t` 23 · `takeaway` 18 · `chip` 17 · `c-d`/tabla 16 ·
`eyebrow` 16 · `footnote` 13 · `c-n`/`kp-k` 12-13.

---

## 3 · Color

Los tokens salen de `brand/brand.json` vía `scripts/apply-brand.mjs`. **Nunca escribas un
hex en el markup**: usa `var(--…)` o las clases de variante.

| Token | Valor nfq | Para qué |
|---|---|---|
| `--bg` / `--bg2` | `#F4F3EE` / `#ECEBE4` | Lienzo y fondo. El crudo cálido es la firma del sistema |
| `--ink` / `--ink2` | `#14141C` / `#44444F` | Texto principal y secundario |
| `--mute` / `--mute2` | `#6F6F7A` / `#9A9AA6` | Texto de apoyo y etiquetas |
| `--blue` | `#217BEE` | Acento primario: eyebrow, énfasis, progreso |
| `--blue-d` | `#1763CF` | El mismo acento en texto pequeño, donde el claro no contrasta |
| `--blue-l` | `#6FA8FF` | El acento sobre fondo oscuro |
| `--coral` `--orange` `--purple` `--green` | | Series y categorías. Máximo tres por slide |
| `--dark` | `#0B1020` | Fondo de los separadores |
| `--client` | del cliente | Color corporativo del logotipo del cliente |

Los acentos son los colores reales del isotipo nfq. No introduzcas colores fuera de esta
lista: `apply-brand` no sabrá sustituirlos al cambiar de marca.

---

## 4 · Anatomía de slide

```html
<section class="slide" data-nav="Sección">
  <div class="eyebrow">Sección</div>
  <h2 class="headline">Una afirmación, no una etiqueta</h2>
  <p class="lead">El contexto en dos o tres líneas.</p>
  <div class="body"> … componentes … </div>
  <p class="takeaway">La frase que el público repetirá.</p>
</section>
```

`.body` ocupa el espacio libre y centra su contenido; `.takeaway` se ancla abajo con
`margin-top:auto`. Esa es toda la mecánica vertical: no pongas márgenes fijos para empujar.

### Tipos de slide

| Clase | Qué es | Exento de takeaway |
|---|---|---|
| `slide cover` | Portada, con el lockup de marcas | Sí |
| `slide index` | Sumario con `toc` | Sí |
| `slide divider` | Separador de sección, fondo oscuro, invierte el chrome | Sí |
| `slide` | Contenido | **No** |

Cada `divider` necesita `data-nav="Etiqueta"`: de ahí sale el navegador de secciones.
Las slides de contenido heredan la sección repitiendo el mismo `data-nav`.

---

## 5 · Componentes

| Clase | Cuándo |
|---|---|
| `cards` (`.c2` `.c4`) + `card` (`.a1` `.a2` `.a3`) | Tres o cuatro ideas paralelas |
| `kpiband` + `kpicard` (`.k2` `.k3`) | Cifras con su lectura |
| `tblwrap` + `table.data` + `tag` | Datos comparables |
| `steps` + `step` + `step-arrow` | Una secuencia con orden |
| `chips` + `chip` (`.c2`…`.c5`) | Atributos sueltos, sin jerarquía |
| `split` (`.s37` `.s73`) | Dos columnas asimétricas |
| `quote` | Una tesis que merece ocupar la slide sola |
| `toc` + `toc-item[data-goto]` | Sumario navegable |
| `footnote` + `fk` | Fuente o supuestos, siempre bajo el dato |

**Varía la maqueta slide a slide.** Tres rejillas de `cards` seguidas se leen como una
plantilla, no como un argumento. Alterna editorial → datos → proceso → cita → decisión.

---

## 6 · Chrome (automático, no lo toques)

Progreso, contador, lockup de marcas y navegador de secciones son fijos y se calculan solos:

- **El contador sale del número real de slides.** Escribirlo a mano es la vía directa a un
  deck que dice «05 / 06» cuando tiene siete.
- **Las secciones se derivan de los `divider` y su `data-nav`.** Una lista de etiquetas
  aparte se desincroniza en cuanto alguien reordena una sección.
- En portada se ocultan el navegador y la barra de marca, que la slide ya lleva propios.
- En separador, `#stage.darkchrome` invierte todo el chrome en bloque.

Navegación: flechas ← →, `Inicio`, `Fin`. `?slide=N` abre directamente en esa slide,
que es como la captura recorre el deck.

---

## 7 · Marca y cliente

```bash
npm run marca -- <fichero> --cliente bbva
```

Inyecta el lockup **cliente | nfq** en la barra y en la portada, y fija `--client` con el
color corporativo de `brand/clients/<id>.json`. Para dar de alta un cliente nuevo bastan
un SVG que pinte con `currentColor` y un JSON con su color.

---

## 8 · Anti-patrones

1. **Hex sueltos en el markup.** Rompen el cambio de marca. Usa tokens.
2. **Un CDN.** Convierte el deck en dependiente de la red del cliente. El verificador lo rechaza.
3. **Contadores o etiquetas de sección escritos a mano.** Se desincronizan siempre.
4. **Cifras sin fuente.** Si es estimación, dilo y di sobre qué supuestos, en un `footnote`.
5. **Un gráfico que no responde a la pregunta del titular.** Una slide editorial bien escrita
   gana a una ocupada con datos de adorno.
6. **`headline` como etiqueta.** «El 38 % del tiempo se va en reintroducir datos», no
   «Análisis de tiempos».
7. **Tres slides seguidas con la misma maqueta.**
