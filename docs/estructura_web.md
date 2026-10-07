# 📐 Estructura Web y Sistema de Métricas de Espaciado (Red BI4DT)

Esta documentación define de forma integral la estructura arquitectónica del frontend de **Red BI4DT**, detallando la disposición gráfica de la interfaz en pantallas de **Escritorio (Desktop)** y dispositivos **Móviles (Celular)**, así como todas las métricas de espaciado, márgenes, paddings, grillas y puntos de interrupción (*breakpoints*).

---

## 📌 1. Resumen de Filosofía de Layout

El proyecto utiliza **Vanilla CSS (CSS Grid, Flexbox y Variables CSS)** para lograr una experiencia adaptable de alta fidelidad sin dependencia de frameworks externos.

- **Diseño Adaptable (Responsive & Fluid):** Las páginas combinan un contenedor central con tope de ancho (`max-width: 1280px`) para el contenido principal y secciones con "escape de viewport" (`100vw`) para fondos completos.
- **Sistema de Capas Estables (CLS Prevention):** Los componentes inyectados dinámicamente (`#navbar-placeholder`, `#footer-placeholder`) reservan alturas mínimas explícitas para evitar saltos de pantalla durante la carga.
- **Experiencia Móvil Nativa:** En pantallas reducidas, los elementos cambian a distribuciones verticales de 1 columna o patrones interactivos táctiles como carruseles con **Scroll Snap Horizontal**.

---

## 📐 2. Breakpoints y Puntos de Interrupción

El diseño ajusta su grilla y espaciados de acuerdo a los siguientes puntos de interrupción principales:

| Categoría Viewport | Rango de Ancho (px) | Comportamiento Clave de Interfaz |
| :--- | :--- | :--- |
| **Escritorio Grande (Wide Desktop)** | `> 1280px` | Contenidos centrados en contenedor máximo (`1280px` o `1200px`). Navbar completo. |
| **Escritorio / Laptop Standard** | `1081px - 1280px` | Secciones adaptadas con padding lateral estandarizado (`2rem` / `50px`). |
| **Laptop Compacta / Tablet Horizontal** | `881px - 1080px` | Truncamiento inteligente del subtítulo del Navbar (`-webkit-line-clamp: 1`). |
| **Tablet Vertical / Móvil Grande** | `681px - 880px` | En `880px`, el Navbar conmuta a menú hamburguesa. El Footer pasa a 2 columnas en `900px`. |
| **Celular Standard / Móvil** | `561px - 680px` | Sección de publicaciones conmuta a carrusel horizontal táctil (`scroll-snap`, tarjetas `85%` de ancho). |
| **Celular Pequeño** | `<= 560px` | Grillas a 1 columna completa. Paddings de sección reducidos a `1.25rem` (`20px`). |

---

## 🏗️ 3. Estructura de Contenedores Base

### 3.1 Contenedores de Ancho Máximo
```css
/* Contenedor principal de página */
main.page-content {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 3rem 0;
}

/* Contenedor interior con sangría de resguardo */
.page-inner {
  padding: 0 1.5rem;
}

/* Contenedor secundario (ej. Footer) */
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

### 3.2 Técnica de Escape de Ancho Completo (*Full-Width Escape*)
Para secciones con fondos de color completo (como *Líneas de Investigación* o banners institucionales) ubicadas dentro del `main`:
```css
.research-lines-section,
.quienes-header-section,
.mission-vision-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
```

### 3.3 Reserva de Espacio para Componentes (Evitar Cumulative Layout Shift - CLS)
```css
#navbar-placeholder {
  min-height: 70px;
  display: block;
}

#footer-placeholder {
  min-height: 250px;
  display: block;
}
```

---

## 🖥️ vs 📱 4. Comparativa de Estructura: Escritorio vs. Celular

### 4.1 Navegación Superior (`.navbar-header`)

```text
[ ESCRITORIO (> 880px) ]
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo 44x44]  RED BI4DT                          Inicio   Quienes   Lineas   Contacto  │
│                Red de Ciencia e Innovación...                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘
  Padding lateral: 2rem | Gap de links: 0.5rem | Altura estimada: ~70px

[ CELULAR (<= 880px) ]
┌────────────────────────────────────────────────────────┐
│  [Logo 44x44]  RED BI4DT                         [ ≡ ] │
└────────────────────────────────────────────────────────┘
  │ (Al presionar Menú Hamburguesa)                      │
  ├──────────────────────────────────────────────────────┤
  │  Inicio                                              │
  │  Quiénes Somos                                       │
  │  Líneas de Investigación                             │
  │  Contacto                                            │
  └──────────────────────────────────────────────────────┘
  Padding menú desplegable: 1.25rem | Nav-links: 100% ancho con padding: 0.75rem 1rem
```

- **Métricas Escritorio:**
  - `padding`: `0.85rem 2rem` (`~13.6px` superior/inferior, `32px` laterales).
  - `gap`: `1.5rem` entre marca y enlaces.
  - Subtítulo de marca visible (`max-width: 460px`).
- **Métricas Móvil (`<= 880px`):**
  - Botón hamburguesa visible: `padding: 8px`, borde `1px solid rgba(255,255,255,0.15)`.
  - Menú desplegable absoluto (`top: 100%`, `background: rgba(15, 23, 42, 0.98)`).
  - `padding` interno del desplegable: `1.25rem` (`20px`), `gap: 0.75rem`.
  - Subtítulo oculto por completo.

---

### 4.2 Banners y Heros (`.quienes-header-section`, `.proyectos-hero-section`)

- **Escritorio:**
  - `padding`: `5.5rem 80px 4.5rem` (Hero Proyectos) / `3rem 50px 4rem 50px` (Quienes Somos).
  - Tamaño de Título (`h1` / `.quienes-title`): `3.2rem` - `3.5rem` (`51px - 56px`), `line-height: 1.1 - 1.2`.
  - Ancho máximo de subtítulo: `700px - 800px`.
- **Móvil (`<= 680px`):**
  - `padding`: `3rem 20px 3.5rem 20px`.
  - Tamaño de Título: `2.0rem` - `2.2rem` (`32px - 35px`).
  - Tamaño de Subtítulo: `1.0rem` (`16px`).

---

### 4.3 Sección Líneas de Investigación (`.research-lines-section`)

```text
[ ESCRITORIO ]                                 [ CELULAR ]
┌───────────┐ ┌───────────┐ ┌───────────┐       ┌───────────────────────┐
│ Área 01   │ │ Área 02   │ │ Área 03   │       │ Área 01               │
│ Informát. │ │ IA Salud  │ │ Interop.  │       └───────────────────────┘
└───────────┘ └───────────┘ └───────────┘       ┌───────────────────────┐
  Grid: 3 columnas | Gap: 1.25rem               │ Área 02               │
                                                └───────────────────────┘
                                                Grid: 1 columna | Gap: 1rem
```

- **Métricas Escritorio:**
  - Fondo Blanco (`#ffffff`), texto oscuro (`#0f172a`).
  - `padding`: `3rem 50px 3.5rem 50px`.
  - Grilla: `grid-template-columns: repeat(3, 1fr)`, `gap: 1.25rem` (`20px`).
  - Tarjetas (`.research-area-card`): `padding: 1.4rem 1.5rem`, `border-radius: 12px`, borde izquierdo acentuado `4px`.
- **Métricas Móvil (`<= 680px`):**
  - `padding`: `2.5rem 1.25rem 3rem 1.25rem`.
  - Grilla: `grid-template-columns: 1fr`, `gap: 1rem`.

---

### 4.4 Sección Misión y Visión (`.mission-vision-section`)

- **Escritorio:**
  - `padding`: `4.5rem 50px 5rem 50px`.
  - Grilla: `grid-template-columns: 1fr 1fr`, `gap: 2.5rem` (`40px`).
  - Tarjetas (`.mv-card`): `padding: 2.75rem 2.5rem`, `border-radius: 16px`.
- **Móvil (`<= 680px`):**
  - `padding`: `2.5rem 1.25rem`.
  - Grilla: `grid-template-columns: 1fr`, `gap: 1.5rem`.
  - Tarjetas: `padding: 1.75rem 1.25rem`, `border-radius: 12px`.

---

### 4.5 Sección Publicaciones / Novedades (`.publicaciones-section`)

- **Escritorio (> 960px):**
  - Grilla de 3 columnas: `grid-template-columns: repeat(3, 1fr)`, `gap: 1.5rem`.
  - Tarjetas estáticas adaptables a la altura de iframe LinkedIn.
- **Tablet (681px - 960px):**
  - Grilla de 2 columnas: `grid-template-columns: repeat(2, 1fr)`, `gap: 1.25rem`.
- **Móvil (`<= 680px`):**
  - **Patrón Scroll Snap Horizontal:**
    ```css
    .publicaciones-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 1.25rem;
      padding-bottom: 1.25rem;
    }
    .publicacion-card {
      flex: 0 0 85%;
      max-width: 85%;
      scroll-snap-align: center;
    }
    ```
  - Muestra un **85%** de la tarjeta actual y deja ver el borde de la siguiente tarjeta para inducir la interacción táctil.

---

### 4.6 Pie de Página (`.site-footer`)

```text
[ ESCRITORIO (3 Columnas) ]
┌───────────────────────────┬───────────────────┬───────────────────────────┐
│ Columna 1: Brand          │ Columna 2: Links  │ Columna 3: Entidad        │
│ Logo, descripción, redes  │ Navegación web    │ Dirección y Email oficial │
└───────────────────────────┴───────────────────┴───────────────────────────┘
  Grid: 1.8fr 1.2fr 1.6fr | Gap: 3rem 4rem | Padding: 3rem 2rem 2.5rem

[ TABLET (900px: 2 Columnas) ]
┌───────────────────────────────────────────────────────────────────────────┐
│ Columna 1: Brand (Ocupa ambas columnas: grid-column: 1 / -1)              │
├─────────────────────────────────────┬─────────────────────────────────────┤
│ Columna 2: Navegación               │ Columna 3: Entidad                  │
└─────────────────────────────────────┴─────────────────────────────────────┘

[ CELULAR (560px: 1 Columna) ]
┌───────────────────────────────────────────────────────────────────────────┐
│ Columna 1: Brand                                                          │
├───────────────────────────────────────────────────────────────────────────┤
│ Columna 2: Navegación                                                     │
├───────────────────────────────────────────────────────────────────────────┤
│ Columna 3: Entidad                                                        │
└───────────────────────────────────────────────────────────────────────────┘
  Padding: 2.5rem 1.25rem 2rem | Gap: 2rem
```

- **Métricas Escritorio:**
  - Grilla: `grid-template-columns: 1.8fr 1.2fr 1.6fr`, `gap: 3rem 4rem`.
  - `padding` interno: `3rem 2rem 2.5rem`.
  - Botones Sociales: `36px x 36px`, `border-radius: 8px`, `gap: 0.55rem`.
  - Barra inferior (`.footer-bottom-bar`): `padding: 1.1rem 2rem`, `border-top: 1px solid rgba(255, 255, 255, 0.06)`.
- **Métricas Celular (`<= 560px`):**
  - Grilla: `grid-template-columns: 1fr`, `gap: 2rem`.
  - `padding` interno: `2.5rem 1.25rem 2rem`.
  - Barra inferior: `padding: 1rem 1.25rem`.

---

## 📏 5. Matriz Resumen de Métricas de Espaciado (Spacing System)

### 5.1 Márgenes y Padding Estándar

| Nivel de Espaciado | Valor rem / px | Aplicación Típica |
| :--- | :--- | :--- |
| **xs (Extra Small)** | `0.25rem` (`4px`) | Micro-separadores de texto, líneas indicadoras. |
| **sm (Small)** | `0.5rem` - `0.75rem` (`8px` - `12px`) | Gaps en flexboxes de badges, padding de enlaces nav. |
| **md (Medium)** | `1.0rem` - `1.25rem` (`16px` - `20px`) | Padding interno de tarjetas, gap en grillas móviles. |
| **lg (Large)** | `1.5rem` - `2.0rem` (`24px` - `32px`) | Padding lateral de contenedores, gap entre bloques institucionales. |
| **xl (Extra Large)** | `2.5rem` - `3.5rem` (`40px` - `56px`) | Padding vertical de secciones estándar. |
| **2xl (Hero Spacing)**| `4.5rem` - `5.5rem` (`72px` - `88px`) | Padding vertical superior de secciones Hero/Banner en Escritorio. |

---

### 5.2 Dimensiones de Cajas e Íconos

| Elemento | Escritorio (Ancho x Alto) | Móvil (Ancho x Alto) | Borde / Radio |
| :--- | :--- | :--- | :--- |
| **Caja Logo Navbar** | `44px × 44px` | `44px × 44px` | Borde `1.5px`, `border-radius: 11px` |
| **Caja Logo Footer** | `42px × 42px` | `42px × 42px` | Borde `1px`, `border-radius: 10px` |
| **Caja Ícono Tarjeta Área** | `48px × 48px` | `44px × 44px` | Borde `1.5px`, `border-radius: 10px` |
| **Botón Social Footer** | `36px × 36px` | `36px × 36px` | `border-radius: 8px` |
| **Ícono Email Contacto** | `28px × 28px` | `28px × 28px` | `border-radius: 6px` |
| **Botón Hamburguesa** | N/A | `38px × 38px` | Borde `1px solid rgba(255,255,255,0.15)`, `border-radius: 8px` |

---

### 5.3 Radios de Borde (Border Radius Hierarchy)

| Valor | Elementos Aplicados |
| :--- | :--- |
| `4px` | Badges pequeños, líneas decorativas, indicadores de enlace. |
| `6px` | Cajas de íconos secundarios (ej. email footer). |
| `8px` | Enlaces del Navbar, botones sociales, botón hamburguesa, inputs de formulario. |
| `10px` | Cajas de íconos principales, cuadros de tarjetas informativas. |
| `11px` | Caja del isotipo oficial en Navbar. |
| `12px` | Tarjetas de Área de Investigación, Tarjetas de Publicación. |
| `16px` | Tarjetas de Misión y Visión en Escritorio. |
| `30px` (Pill) | Badges de temas / etiquetas (*tags*) dentro de las tarjetas. |

---

## 🖼️ 6. Regla Obligatoria para Imágenes de Fondo y Canvases (`GEMINI.md`)

De acuerdo a la normativa técnica del proyecto en `GEMINI.md`, **toda imagen o banner de fondo** debe seguir estrictamente el formato de HTML con overlay superpuesto, evitando `background-image` en CSS:

```html
<!-- Estructura Fija e Inalterable -->
<img src="assets/images/NOMBRE_IMAGEN.jpg" class="NOMBRE-CLASE">
<div class="NOMBRE-CLASE-overlay"></div>
```

### Reglas de Aplicación:
1. **Sin atributo `alt`:** Por regla del proyecto, no se incluye `alt` en imágenes decorativas/canvas.
2. **Overlay Hermano Inmediato:** El `<div>` del overlay debe ubicarse justo después del `<img>` y compartir el prefijo de la clase (`-overlay`).
3. **Control por CSS:** El posicionamiento del overlay utiliza `position: absolute; inset: 0; pointer-events: none;`.

---

## 📋 7. Checklist de Verificación Responsive para Desarrolladores

Al añadir o modificar vistas en **Red BI4DT**, verificar siempre:

- [ ] **Sin Overflow Horizontal:** La página debe tener `overflow-x: hidden` en `html, body` y ningún contenedor debe superar el `100vw`.
- [ ] **Servidor Local Activo:** Los componentes `.html` inyectados vía `loadComponents.js` deben probarse bajo protocolo `http://` (ej. `npx serve .` o `python -m http.server 8000`) para evitar bloqueos por CORS.
- [ ] **Placeholders de Componentes:** Asegurar que `#navbar-placeholder` posea `min-height: 70px` y `#footer-placeholder` posea `min-height: 250px`.
- [ ] **Despliegue de Menú Móvil:** En `<= 880px`, comprobar que el menú desplegable abra suavemente y los enlaces tengan espacio táctil cómodo (`min 44px` de alto útil).
- [ ] **Tarjetas en Móvil:** Verificar que las tarjetas se adapten a 1 columna o mantengan scroll snap horizontal en pantallas de `<= 680px`.
