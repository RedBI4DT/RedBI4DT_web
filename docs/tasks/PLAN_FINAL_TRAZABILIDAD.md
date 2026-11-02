# PLAN FINAL DE EJECUCIÓN CON TRAZABILIDAD DE TAREAS – RED BI4DT WEB
**Proyecto:** Sitio Web Institucional de la Red BI4DT (Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global)  
**Documento:** Plan Maestro de Cierre y Trazabilidad de Tareas  
**Versión:** 1.0.0 (Avance Final I)  
**Fecha:** 1 de noviembre de 2026  
**Fuentes de entrada:**
1. Transcripción de la reunión: *Reunion BI4DT - Avance Final I Web Transcripción.txt* (29 oct 2026).
2. Resumen ordenado de feedback: *Pendientes_Edicion_Web_BI4DT.md*.

---

## 1. Resumen Ejecutivo

### 1.1. Alcance
El presente plan establece la hoja de ruta definitiva para ejecutar las correcciones de diseño, reestructuración arquitectónica, depuración visual y enriquecimiento de contenido del portal web de la Red BI4DT. Las tareas derivan exclusivamente de la sesión de feedback técnico sostenida entre Rodrigo Chacón (desarrollo) y Pamela Chacón (revisión de producto y gobernanza), complementada por las notas de sesión y las convenciones de desarrollo del repositorio (Vanilla JS, CSS modular sin dependencias, formato de lienzo estricto).

El principio rector del plan es **"Menos es más"**: erradicar el aspecto artificial generado por IA (exceso de íconos, bordes decorativos, fuentes asimétricas y paletas discordantes), profesionalizar la jerarquía visual orientada a investigadores e instituciones socias (NIH, Amazon Research ARC, Prociencia) y consolidar la trazabilidad hacia bases de datos de publicaciones científicas.

### 1.2. Métrica Total de Tareas
- **Total de tareas atómicas identificadas:** 84 tareas.
- **Distribución por Estado actual:** 9 Hecho (10.7%), 75 Pendientes (89.3%).

### 1.3. Distribución por Nivel de Prioridad
| Prioridad | Cantidad de Tareas | Porcentaje | Descripción |
|---|---|---|---|
| **Alta** | 42 | 50.0% | Cambios críticos de identidad de marca, navegación principal, paleta, remoción de íconos IA, reestructuración de instituciones y módulo de artículos. |
| **Media** | 38 | 45.2% | Ajustes de jerarquía tipográfica, estandarización de layouts, depuración de filtros, optimización de copies (<10 palabras / <150 palabras) y estilo del mapa. |
| **Baja** | 4 | 4.8% | Descarte formal de líneas de conexión del mapa, exportación opcional de publicaciones y ajustes secundarios no bloqueantes. |
| **Total** | **84** | **100%** | |

### 1.4. Distribución de Tareas por Página / Componente
| Prefijo | Componente / Página | Cantidad | Prioridad Alta | Prioridad Media | Prioridad Baja |
|---|---|---|---|---|---|
| `G` | Principios y Estilos Globales | 9 | 5 | 4 | 0 |
| `NAV` | Menú y Navegación | 4 | 2 | 2 | 0 |
| `HEA` | Header y Logotipo | 2 | 2 | 0 | 0 |
| `INI` | Página de Inicio (Home) | 7 | 3 | 4 | 0 |
| `INS` | Instituciones de la Red | 9 | 6 | 3 | 0 |
| `QS` | Quiénes Somos | 8 | 4 | 4 | 0 |
| `INV` | Investigación (Líneas y Publicaciones) | 6 | 4 | 2 | 0 |
| `MAP` | Mapa Interactivo de la Red | 7 | 1 | 5 | 1 |
| `EQ` | Equipo General | 5 | 3 | 2 | 0 |
| `PER` | Perfil Individual (Investigador/Estudiante) | 8 | 3 | 5 | 0 |
| `PRO` | Catálogo de Proyectos (Listado) | 4 | 3 | 1 | 0 |
| `DET` | Detalle de Proyecto | 8 | 4 | 3 | 1 |
| `CON` | Contacto | 4 | 4 | 0 | 0 |
| `FOO` | Pie de Página (Footer) | 3 | 2 | 1 | 0 |
| **Total** | **14 Secciones / Componentes** | **84** | **42** | **38** | **4** |

---

## 2. Mapa del Proyecto

Este mapa relaciona cada vista funcional y componente con sus archivos físicos en el repositorio y su código de prefijo único.

| Página / Componente | Archivo(s) HTML | Archivo(s) CSS | Archivo(s) JS / Data | Prefijo ID |
|---|---|---|---|---|
| **Principios y Estilos Globales** | Transversal a todas las páginas | `styles/colors.css`<br>`styles/index.css` | N/A | `G` |
| **Menú y Navegación** | `pages/components/navbar.html` | `styles/components/navbar.css` | `scripts/components/navbar.js`<br>`scripts/loadComponents.js` | `NAV` |
| **Header y Logotipo** | `pages/components/navbar.html` | `styles/components/navbar.css` | `assets/images/bi4dt-logo.png`<br>`assets/images/logo_red_web.png` | `HEA` |
| **Inicio (Home)** | `index.html` | `styles/index.css` | `scripts/index.js`<br>`scripts/publicaciones.js` | `INI` |
| **Instituciones de la Red** | `index.html`<br>(`pages/quienes.html`) | `styles/index.css` | `assets/images/associations_logo/*` | `INS` |
| **Quiénes Somos** | `pages/quienes.html` | `styles/quienes.css` | `scripts/quienes.js` | `QS` |
| **Investigación** | `pages/area.html`<br>(Nueva ruta o hub científico) | `styles/area.css`<br>`styles/investigacion.css` | `scripts/area.js`<br>`assets/data/areas.json` | `INV` |
| **Mapa de la Red** | `pages/quienes.html`<br>(`index.html`) | `styles/quienes.css`<br>`styles/index.css` | `scripts/quienes.js`<br>`assets/data/areas.json` | `MAP` |
| **Equipo General** | `pages/equipo.html` | `styles/equipo.css` | `assets/data/miembros.json`<br>`assets/images/members_bi4dt/*` | `EQ` |
| **Perfil Individual** | `pages/investigacion.html`<br>`pages/estudiante.html` | `styles/investigacion.css`<br>`styles/estudiante.css` | `scripts/investigacion.js`<br>`scripts/estudiante.js`<br>`assets/data/miembros.json` | `PER` |
| **Proyectos (Listado)** | `pages/proyectos.html` | `styles/proyectos.css` | `scripts/proyectos.js`<br>`assets/data/proyectos.json` | `PRO` |
| **Detalle de Proyecto** | `pages/proyecto-detalle.html` | `styles/proyecto-detalle.css` | `scripts/proyecto-detalle.js`<br>`assets/data/proyectos.json`<br>`assets/data/publicaciones.json` | `DET` |
| **Contacto** | `pages/contacto.html` | `styles/contacto.css` | `scripts/contact.js`<br>`assets/images/moments_bi4dt/*` | `CON` |
| **Footer** | `pages/components/footer.html` | `styles/components/footer.css` | `scripts/components/footer.js` | `FOO` |

---

## 3. Matriz de Trazabilidad (Tabla Principal)

La siguiente tabla consolida las 84 tareas del proyecto, asegurando trazabilidad directa a la transcripción o minuta, dependencia técnica, recurso y estado actual.

| ID | Página / Componente | Archivo(s) | Tarea | Tipo | Origen | Prioridad | Depende de | Recurso necesario | Estado |
|---|---|---|---|---|---|---|---|---|---|
| `G-01` | Global | `styles/colors.css` | Estandarizar la paleta cromática oficial: eliminar color rojo no contemplado, fijar azul oscuro uniforme para subtítulos en todas las vistas y restringir amarillo/magenta a botones de acción (CTA). | Cambiar | [12:21 - 16:00, 22:10], Sec. 0 | Alta | Ninguna | Paleta formal en CSS | Pendiente |
| `G-02` | Global | `styles/index.css`, `styles/colors.css` | Establecer jerarquía tipográfica consistente y armónica bajo la regla de proporción visual (60-30-10) con escalas fijas para H1, H2, H3 y cuerpo de texto. | Cambiar | [12:21 - 16:00], Sec. 0 | Alta | `G-01` | Guía de escala tipográfica | Pendiente |
| `G-03` | Global | Transversal (HTML / CSS) | Reducir masivamente el uso de íconos decorativos en títulos, encabezados de bloque, tarjetas y filtros que otorgan aspecto genérico ("look IA"), manteniéndolos solo en redes y canales de contacto. | Quitar | [20:47, 30:30, 31:52, 33:28], Sec. 0 | Alta | Ninguna | Auditoría visual | Pendiente |
| `G-04` | Global | Transversal (CSS) | Eliminar cajas con bordes decorativos visibles y líneas superiores de adorno en tarjetas y contenedores ("look IA") para lograr una estética limpia e institucional. | Quitar | [20:47 - 21:42], Sec. 0 | Media | Ninguna | Limpieza de reglas CSS | Pendiente |
| `G-05` | Global | Transversal (HTML) | Eliminar duplicidad de títulos: cuando exista un subtítulo descriptivo, evitar colocar un título grande redundante encima o debajo. | Quitar | [16:00, 21:42], Sec. 0 | Media | Ninguna | Revisión de layout | Pendiente |
| `G-06` | Global | Transversal (HTML / JS) | Aplicar el principio de concisión y síntesis en textos informativos: limitar párrafos institucionales y badges a un máximo de 10 palabras. | Cambiar | [18:00 - 18:30, 41:44 - 41:56], Sec. 0, 4, 10 | Media | Ninguna | Copies redactados | Pendiente |
| `G-07` | Global | Transversal (HTML) | Asegurar el cumplimiento estricto del formato lienzo HTML en todas las imágenes de fondo/sección (`<img ... class="XYZ"><div class="XYZ-overlay"></div>`, sin `alt`, sin `background-image`). | Cambiar | Regla GEMINI.md | Alta | Ninguna | Estructura fija de marcado | Pendiente |
| `G-08` | Global | Transversal (CSS / Layout) | Ajustar patrones visuales de diseño institucional científico tomando como referencia Amazon Research ARC, NIH y Prociencia. | Cambiar | [19:03 - 19:38, 25:40 - 27:16], Sec. 0 | Media | `G-01`, `G-02` | Enlaces de referencia | Pendiente |
| `G-09` | Global | Transversal (CSS Media Queries) | Realizar auditoría responsive completa y optimización en viewport de celulares para todas las vistas y componentes. | Cambiar | [20:41, 21:52], Sec. 0, 11 | Alta | Fases 1 a 4 | Dispositivo / Emulador móvil | Pendiente |
| `NAV-01` | Menú / Navegación | `pages/components/navbar.html`, `styles/components/navbar.css` | Quitar la barra/texto de navegación redundante ("Ciencia de datos, inteligencia de producción...") y la mención de entidad ejecutora que satura la cabecera en móvil. | Quitar | [19:03 - 19:52], Sec. 5 | Alta | Ninguna | Ninguno | Hecho |
| `NAV-02` | Menú / Navegación | `pages/components/navbar.html`, `scripts/components/navbar.js`, `styles/components/navbar.css` | Crear en el menú la pestaña "Investigación" con submenú desplegable (dropdown) estructurado en: 1. Líneas, 2. Proyectos, 3. Artículos / Publicaciones (patrón ARC). | Agregar | [56:45 - 57:47], Sec. 5 | Alta | Ninguna | Lógica de menú desplegable | Hecho |
| `NAV-03` | Menú / Navegación | `pages/components/navbar.html`, `scripts/components/navbar.js` | Integrar dentro del submenú desplegable de Investigación accesos directos a líneas resaltadas y proyectos insignia. | Agregar | [56:45 - 57:47], Sec. 5 | Media | `NAV-02` | Selección de proyectos clave | Hecho |
| `NAV-04` | Menú / Navegación | `styles/components/navbar.css` | Estilizar el navbar con acabado profesional sobrio, eliminando bordes artificiales dorados excesivos o líneas decorativas pesadas. | Cambiar | [19:03 - 19:38], Sec. 5 | Media | `G-01`, `G-04` | Estilos CSS limpios | Hecho |
| `HEA-01` | Header / Logo | `pages/components/navbar.html`, `styles/components/navbar.css` | Corregir contraste y visibilidad del logo en el header: resolver la zona oscura que se pierde aplicando fondo blanco sutil, degradado/difusión de aclarado o realineación. | Cambiar | [0:00 - 0:23], Sec. 1 | Alta | Ninguna | Logo optimizado o CSS | Hecho |
| `HEA-02` | Header / Logo | `styles/components/navbar.css`, `pages/components/navbar.html` | Aumentar el tamaño del logo institucional para que tanto el isotipo como las letras de "BI4DT Network" sean claramente legibles y jerarquizadas. | Cambiar | [0:36 - 0:45], Sec. 1 | Alta | `HEA-01` | Ninguno | Hecho |
| `INI-01` | Inicio | `index.html`, `scripts/index.js` | Configurar y vincular el link de redirección preparado por Rodrigo para la sección / banner de Líneas de Investigación. | Cambiar | [0:55], Sec. 2 | Media | Ninguna | URL de ancla o página | Pendiente |
| `INI-02` | Inicio | `index.html` | Cambiar la nomenclatura de "Entidad ejecutora" por "Nuestra institución líder" en el bloque institucional de UCSUR. | Cambiar | [9:28 - 9:30], Sec. 2 | Alta | Ninguna | Ninguno | Pendiente |
| `INI-03` | Inicio | `index.html` | Dejar únicamente el título "Nuestra institución líder", eliminando cualquier título grande adicional duplicado encima o debajo. | Quitar | [16:00], Sec. 2 | Media | `INI-02`, `G-05` | Ninguno | Pendiente |
| `INI-04` | Inicio | `index.html`, `assets/images/*` | Reemplazar fotos alteradas por IA o con fondos inapropiados (fondo de mar/playa) por imágenes institucionales auténticas en alta resolución sin recortes arbitrarios. | Cambiar | [9:51 - 10:46], Sec. 2 | Alta | Ninguna | Fotografías originales HD | Pendiente |
| `INI-05` | Inicio | `index.html`, `styles/index.css` | Corregir la jerarquía y estatus del tag/span ("Universidad Científica del Sur") ubicado sobre el título principal para que no compita visualmente con el encabezado. | Cambiar | [10:53 - 11:45], Sec. 2 | Media | `G-02` | Ninguno | Pendiente |
| `INI-06` | Inicio | `index.html` | Eliminar información duplicada entre la etiqueta "Líneas de investigación" y "Ejes científicos / bases científicas" en el home. | Quitar | [11:45 - 12:21], Sec. 2 | Media | `G-05` | Ninguno | Pendiente |
| `INI-07` | Inicio | `index.html`, `styles/index.css` | Quitar íconos decorativos en tarjetas y enlaces de áreas científicas en la página de inicio. | Quitar | [20:47, 33:28], Sec. 0, 2 | Alta | `G-03` | Ninguno | Pendiente |
| `INS-01` | Instituciones | `index.html`, `pages/quienes.html` | Renombrar la sección "Alianzas" por "Instituciones de la red" o "Instituciones que colaboran en la red" para reflejar adecuadamente la pertenencia formal. | Cambiar | [16:41 - 17:44], Sec. 3 | Alta | Ninguna | Ninguno | Pendiente |
| `INS-02` | Instituciones | `index.html`, `styles/index.css` | Unificar a todas las instituciones de la red (incluida la Universidad Científica del Sur) dentro de un único bloque o grilla integrada. | Reestructurar | [16:41 - 17:44], Sec. 3 | Alta | `INS-01` | Estructura de grilla | Pendiente |
| `INS-03` | Instituciones | `index.html`, `styles/index.css` | Posicionar a UCSUR en el primer lugar de la grilla integrada (esquina superior izquierda) bajo el principio de equidad acordado. | Cambiar | [17:44], Sec. 3 | Media | `INS-02` | Ninguno | Pendiente |
| `INS-04` | Instituciones | `index.html`, `styles/index.css`, `assets/images/associations_logo/*` | Formatear todos los logos institucionales como archivos PNG con transparencia sobre fondo blanco limpio, eliminando cuadros de distinto tamaño y bordes decorativos. | Cambiar | [16:00 - 16:19], Sec. 3 | Alta | `G-04` | Logos en PNG transparente | Pendiente |
| `INS-05` | Instituciones | `index.html`, `styles/index.css` | Estandarizar la presentación de las instituciones para que todas muestren el formato uniforme de "logo + marca institucional / nombre completo". | Cambiar | [15:12, 16:04], Sec. 3 | Alta | Ninguna | Nombres oficiales | Pendiente |
| `INS-06` | Instituciones | `index.html`, `assets/images/associations_logo/*` | Reemplazar el logo aislado del Instituto Nacional de Salud (INS) por la marca institucional completa ("Instituto Nacional de Salud", incorporando el escudo del MINSA). | Cambiar | [15:43 - 16:04], Sec. 3 | Alta | `INS-05` | Arte oficial INS + MINSA | Pendiente |
| `INS-07` | Instituciones | `index.html`, `assets/images/associations_logo/*` | Incorporar el logo institucional de la Universidad Científica del Sur (UCSUR) dentro de la grilla de instituciones. | Agregar | [15:31, 16:41], Sec. 3 | Alta | `INS-02` | Logo oficial UCSUR | Pendiente |
| `INS-08` | Instituciones | `index.html`, `scripts/index.js` | Actualizar y validar redirecciones externas de cada institución: UCSUR (web oficial), UNMSM (área de salud/medicina), INS (gob.pe/ins), ProcesaLab (Facebook), Univ. Arizona (Centro informática en salud), USFQ (web oficial), UCSP (ambos departamentos). | Cambiar | [2:33 - 4:09], Sec. 3 | Media | Ninguna | Enlaces verificados | Pendiente |
| `INS-09` | Instituciones | `index.html`, `assets/images/*` | Incorporar una imagen representativa y una imagen de fondo institucional adecuada en la sección de instituciones para resolver el vacío visual pendiente. | Agregar | [4:09, 16:19], Sec. 3 | Media | `G-07` | Imagen institucional HD | Pendiente |
| `QS-01` | Quiénes Somos | `pages/quienes.html` | Reestructurar la página para enfocarla estrictamente en la red institucional: propósito, misión, visión y distribución geográfica colaborativa. | Reestructurar | [55:25 - 56:20], Sec. 4 | Alta | Ninguna | Redacción institucional | Pendiente |
| `QS-02` | Quiénes Somos | `pages/quienes.html`, `styles/quienes.css` | Agregar la sección de estructura organizativa y liderazgo de la red ("Leadership"), detallando los roles de gobernanza con las personas responsables. | Agregar | [55:25 - 56:03], Sec. 4 | Alta | Ninguna | Estructura de líderes | Pendiente |
| `QS-03` | Quiénes Somos | `pages/quienes.html`, `styles/quienes.css` | Trasladar la galería / carrusel de fotografías y momentos de la red desde la página de Contacto hacia "Quiénes somos". | Reestructurar | [54:37 - 55:25], Sec. 4, 9 | Alta | `CON-01` | Galería de imágenes | Pendiente |
| `QS-04` | Quiénes Somos | `pages/quienes.html` | Dejar un solo título en "Nuestro enfoque", eliminando subtítulo o línea adicional redundante. | Quitar | [21:42 - 21:46], Sec. 4 | Media | `G-05` | Ninguno | Pendiente |
| `QS-05` | Quiénes Somos | `pages/quienes.html` | Sintetizar el texto del bloque "Nuestra ambición" a un límite estricto de menos de 10 palabras. | Cambiar | [18:00 - 18:30], Sec. 4 | Media | `G-06` | Copy sintetizado | Pendiente |
| `QS-06` | Quiénes Somos | `styles/quienes.css` | Quitar bordes decorativos, líneas superiores ornamentales y cajas estilo IA de las tarjetas de misión, visión y contenido en Quiénes somos. | Quitar | [20:47 - 21:42], Sec. 4 | Media | `G-04` | Ninguno | Pendiente |
| `QS-07` | Quiénes Somos | `pages/quienes.html`, `styles/quienes.css` | Quitar los íconos de los encabezados de misión y visión (dianas, ojos decorativos) para mantener un diseño profesional limpio. | Quitar | [20:47, 33:28], Sec. 0, 4 | Alta | `G-03` | Ninguno | Pendiente |
| `QS-08` | Quiénes Somos | `pages/quienes.html`, `styles/quienes.css` | Reducir la sección de líneas de investigación en Quiénes somos a un resumen sintético introductorio, derivando el detalle completo a la sección de Investigación. | Reestructurar | [56:20 - 56:45], Sec. 4 | Alta | `INV-01` | Ninguno | Pendiente |
| `INV-01` | Investigación | `pages/investigacion.html` / `pages/area.html`, `styles/investigacion.css` | Consolidar la arquitectura de Investigación: crear o reestructurar el hub científico con sus tres secciones hijas (Líneas, Proyectos y Artículos/Publicaciones). | Reestructurar | [56:45 - 57:47], Sec. 4, 5 | Alta | `NAV-02` | Arquitectura de vistas | Pendiente |
| `INV-02` | Investigación | `pages/quienes.html` / `pages/area.html`, `styles/quienes.css` | Quitar los números (01, 02, etc.) en los bloques de las 6 líneas de investigación para erradicar cualquier falsa percepción de prelación o jerarquía. | Quitar | [23:33 - 25:36], Sec. 4 | Alta | Ninguna | Ninguno | Pendiente |
| `INV-03` | Investigación | `styles/quienes.css`, `styles/area.css` | Unificar el tamaño y proporción de las tarjetas de líneas de investigación, eliminando la disposición asimétrica tipo tetris/bento que confunde jerarquía con dimensión. | Reestructurar | [23:04 - 25:36], Sec. 4 | Alta | `INV-02` | Grilla simétrica | Pendiente |
| `INV-04` | Investigación | `pages/quienes.html` / `pages/area.html`, `assets/images/*` | Reemplazar los íconos genéricos en las tarjetas de líneas de investigación por imágenes fotográficas o ilustraciones científicas temáticas de alta calidad. | Cambiar | [25:36 - 25:40], Sec. 4 | Alta | `G-07` | 6 imágenes temáticas | Pendiente |
| `INV-05` | Investigación | `styles/quienes.css`, `styles/area.css` | Enfatizar con diseño equilibrado las 3 líneas con mayor producción de estudios (*Salud digital*, *IA en salud* e *Informática biomédica*), sin romper la simetría ni el esquema cromático. | Cambiar | [6:45, 23:17], Sec. 4 | Media | `INV-03`, `G-01` | Datos de líneas | Pendiente |
| `INV-06` | Investigación | `styles/quienes.css`, `styles/colors.css` | Corregir los colores de los bloques de líneas de investigación, eliminando el color rojo y cualquier tono ajeno a la paleta institucional aprobada. | Cambiar | [22:10], Sec. 4 | Alta | `G-01` | Paleta oficial | Pendiente |
| `MAP-01` | Mapa de la Red | `pages/quienes.html`, `scripts/quienes.js` | Reemplazar la capa cartográfica actual (OpenTopoMap que resalta relieve de sierra y selva) por un mapa plano monocromático y neutral que no enfatice divisiones geográficas. | Cambiar | [27:16 - 28:22], Sec. 6 | Alta | Ninguna | TileLayer plano (ej. CartoDB Positron) | Pendiente |
| `MAP-02` | Mapa de la Red | `scripts/quienes.js` | Quitar el nodo internacional aislado del mapa, manteniendo la visualización a nivel de país en lugar de punto de ciudad específico para nodos extranjeros. | Quitar | [27:16 - 28:22], Sec. 6 | Media | Ninguna | Ajuste de datos Leaflet | Pendiente |
| `MAP-03` | Mapa de la Red | `scripts/quienes.js` | Quitar el ícono decorativo o logotipo en el marcador de la Universidad San Francisco de Quito en el mapa. | Quitar | [28:22], Sec. 6 | Media | Ninguna | Ninguno | Pendiente |
| `MAP-04` | Mapa de la Red | `styles/quienes.css`, `scripts/quienes.js` | Estandarizar los marcadores de puntos del mapa con una paleta sobria de pocos colores para evitar distracciones visuales. | Cambiar | [28:44 - 29:22], Sec. 6 | Media | `G-01` | Reglas CSS de pines | Pendiente |
| `MAP-05` | Mapa de la Red | `scripts/quienes.js` | Descartar formalmente el trazado de líneas de interconexión entre los puntos del mapa (mantener los marcadores independientes y limpios). | Quitar | [28:52 - 29:22], Sec. 6 | Baja | Ninguna | Ninguno | Pendiente |
| `MAP-06` | Mapa de la Red | `scripts/quienes.js`, `styles/quienes.css` | Configurar el panel lateral o lista de instituciones que se despliega al seleccionar un nodo para que muestre texto plano limpio, sin íconos decorativos. | Cambiar | [28:44 - 29:22], Sec. 6 | Media | `G-03` | Ninguno | Pendiente |
| `MAP-07` | Mapa de la Red | `scripts/quienes.js` | Implementar dimensionamiento proporcional del radio del marcador circular según el número de instituciones en cada ubicación, con opacidad baja para no obstruir el mapa. | Cambiar | [29:22 - 30:14], Sec. 6 | Media | `MAP-04` | Script de radios Leaflet | Pendiente |
| `EQ-01` | Equipo | `pages/equipo.html`, `styles/equipo.css` | Simplificar la estructura de categorías de la página Equipo en solo dos grupos: "Equipo" y "Estudiantes" (eliminando "Gestión y articulación productiva"). | Reestructurar | [30:51 - 31:01], Sec. 7 | Alta | Ninguna | Estructura en HTML | Pendiente |
| `EQ-02` | Equipo | `pages/equipo.html`, `assets/data/miembros.json` | Actualizar nomenclatura de cargos: asignar "Líder" a la responsable técnica y mostrar la institución de adscripción en los demás integrantes, omitiendo rótulos de co-investigador. | Cambiar | [31:01 - 31:51], Sec. 7 | Alta | `EQ-01` | Dataset de miembros | Pendiente |
| `EQ-03` | Equipo | `pages/equipo.html`, `assets/images/members_bi4dt/*` | Reemplazar avatares/íconos provisionales en miembros sin fotografía por retratos reales en alta resolución o placeholder neutral sin íconos genéricos. | Cambiar | [30:14], Sec. 7 | Media | `G-07` | Fotos de miembros | Pendiente |
| `EQ-04` | Equipo | `styles/equipo.css` | Eliminar el marco blanco redundante sobre fondo blanco en las tarjetas de presentación de los miembros. | Quitar | [31:01 - 31:51], Sec. 7 | Media | `G-04` | Reglas de tarjeta en CSS | Pendiente |
| `EQ-05` | Equipo | `pages/equipo.html`, `styles/equipo.css` | Quitar íconos decorativos en los títulos y encabezados de categorías en la página de Equipo (p. ej. ícono de microscopio). | Quitar | [30:30, 31:52], Sec. 7 | Alta | `G-03` | Ninguno | Pendiente |
| `PER-01` | Perfil Individual | `pages/investigacion.html` / `pages/estudiante.html`, `styles/investigacion.css` | Reestructurar el layout del perfil individual en 3 columnas horizontales alineadas: 1. Foto a la izquierda, 2. Brief/descripción al centro, 3. Bloques de líneas de investigación apilados a la derecha. | Reestructurar | [37:29 - 38:33], Sec. 7 | Alta | Ninguna | Maquetación Flex/Grid | Pendiente |
| `PER-02` | Perfil Individual | `styles/investigacion.css` | Estandarizar la altura y proporción de la foto de perfil para que coincida exactamente con la altura total del bloque de información y líneas a la derecha, evitando huecos verticales. | Cambiar | [37:29 - 38:33], Sec. 7 | Media | `PER-01` | Ajuste CSS de altura | Pendiente |
| `PER-03` | Perfil Individual | `styles/investigacion.css` | Quitar el borde decorativo amarillo de la fotografía de perfil, conservando bordes redondeados limpios. | Quitar | [38:34 - 39:22], Sec. 7 | Media | `G-01` | Ninguno | Pendiente |
| `PER-04` | Perfil Individual | `assets/data/miembros.json`, `pages/investigacion.html` | Limitar la extensión del texto del brief biográfico a un máximo estricto de 4–5 líneas o 150 palabras. | Cambiar | [37:29 - 38:00], Sec. 7 | Media | `G-06` | Bios redactadas | Pendiente |
| `PER-05` | Perfil Individual | `pages/investigacion.html`, `styles/investigacion.css` | Reubicar los enlaces de contacto en la parte superior junto a foto/nombre, usando exclusivamente íconos limpios: Email, LinkedIn, ORCID (ícono oficial verde), Google Scholar y Scopus. | Reestructurar | [34:24 - 37:29], Sec. 7 | Alta | `PER-01` | Íconos oficiales SVG/FA | Pendiente |
| `PER-06` | Perfil Individual | `pages/investigacion.html` | Quitar el encabezado redundante "Equipo de investigación" dentro de la página del perfil individual. | Quitar | [32:26 - 33:05], Sec. 7 | Media | `G-05` | Ninguno | Pendiente |
| `PER-07` | Perfil Individual | `pages/investigacion.html`, `styles/investigacion.css` | Quitar los íconos de los títulos de sección "Proyectos relacionados" y "Contacto" dentro del perfil (manteniendo solo el ícono funcional del correo). | Quitar | [33:28 - 34:24], Sec. 7 | Alta | `G-03` | Ninguno | Pendiente |
| `PER-08` | Perfil Individual | `scripts/investigacion.js`, `assets/data/proyectos.json` | Asegurar la vinculación dinámica entre los proyectos en los que participa cada persona y sus líneas de investigación asociadas. | Cambiar | [32:26, 33:28], Sec. 7 | Media | Ninguna | Mapeo en JSON | Pendiente |
| `PRO-01` | Proyectos | `pages/proyectos.html`, `scripts/proyectos.js` | Depurar los filtros avanzados del catálogo de proyectos: mantener "Línea de investigación" y "Estado"; eliminar los filtros de "País" e "Institución". | Quitar | [40:05 - 40:26], Sec. 8 | Alta | Ninguna | Lógica de filtros JS | Pendiente |
| `PRO-02` | Proyectos | `pages/proyectos.html`, `scripts/proyectos.js` | Eliminar el campo/filtro de palabras clave (keywords) en el buscador de proyectos al operar este por coincidencia de texto literal. | Quitar | [40:28 - 41:42], Sec. 8 | Alta | Ninguna | Ninguno | Pendiente |
| `PRO-03` | Proyectos | `pages/proyectos.html`, `scripts/proyectos.js` | Unificar los dos botones de limpiar existentes en un único botón funcional ("Limpiar todo"). | Quitar | [42:40 - 43:01], Sec. 8 | Media | Ninguna | Ninguno | Pendiente |
| `PRO-04` | Proyectos | `pages/proyectos.html`, `styles/proyectos.css` | Quitar íconos decorativos en las etiquetas de los filtros y elementos del catálogo de proyectos para eliminar ruido visual. | Quitar | [43:07 - 44:16], Sec. 8 | Alta | `G-03` | Ninguno | Pendiente |
| `DET-01` | Detalle Proyecto | `pages/proyecto-detalle.html`, `scripts/proyecto-detalle.js` | Mantener y validar la visualización de descripción completa, temporalidad (fechas), equipo de participantes e instituciones colaboradoras del proyecto. | Cambiar | [43:07, 44:16], Sec. 8 | Media | Ninguna | Datos de proyectos | Pendiente |
| `DET-02` | Detalle Proyecto | `pages/proyecto-detalle.html`, `scripts/proyecto-detalle.js` | Eliminar el bloque de "Palabras clave y temáticas" de la ficha de detalle de proyecto. | Quitar | [45:15], Sec. 8 | Media | Ninguna | Ninguno | Pendiente |
| `DET-03` | Detalle Proyecto | `pages/proyecto-detalle.html`, `styles/proyecto-detalle.css` | Reemplazar el bloque redundante de texto "Otros proyectos en esta línea" y sus íconos por un único enlace o botón directo "Proyectos similares" que filtre por la misma línea. | Reestructurar | [43:20 - 44:02, 45:17], Sec. 8 | Alta | Ninguna | Enlace parametrizado | Pendiente |
| `DET-04` | Detalle Proyecto | `pages/proyecto-detalle.html`, `scripts/proyecto-detalle.js`, `styles/proyecto-detalle.css` | Agregar el módulo de artículos y publicaciones del proyecto estructurado como lista colapsable (acordeón/dropdown) para soportar volúmenes amplios (25+ papers) sin saturar la vista. | Agregar | [45:43 - 52:25], Sec. 8 | Alta | Ninguna | Componente acordeón | Pendiente |
| `DET-05` | Detalle Proyecto | `pages/proyecto-detalle.html`, `scripts/proyecto-detalle.js` | Estandarizar los campos mínimos de cada publicación científica: título del artículo, año de publicación y enlace directo a base de datos indexada (PubMed, Scopus, DOI). | Agregar | [52:25 - 52:26], Sec. 8 | Alta | `DET-04` | URLs de papers indexados | Pendiente |
| `DET-06` | Detalle Proyecto | `pages/proyecto-detalle.html`, `assets/data/proyectos.json` | Incorporar metadatos de financiamiento institucional del proyecto (entidad financiadora y código de subvención/contrato, siguiendo estándares NIH / Prociencia). | Agregar | [51:17 - 52:25, 53:00 - 53:33], Sec. 8 | Media | `DET-01` | Datos de subvención | Pendiente |
| `DET-07` | Detalle Proyecto | `pages/proyecto-detalle.html`, `scripts/proyecto-detalle.js` | Implementar botón opcional para exportar la lista de publicaciones de un proyecto en formato estándar (BibTeX / CSV / RIS). | Agregar | [52:25], Sec. 8 | Baja | `DET-04` | Script de exportación | Pendiente |
| `DET-08` | Detalle Proyecto | `pages/proyecto-detalle.html`, `styles/proyecto-detalle.css` | Quitar íconos decorativos en los títulos de sección del detalle de proyecto (descripción, equipo, fichas). | Quitar | [43:07, 44:16], Sec. 8 | Alta | `G-03` | Ninguno | Pendiente |
| `CON-01` | Contacto | `pages/contacto.html`, `scripts/contact.js` | Quitar la galería/carrusel de imágenes y fotografías de la página de Contacto para transformarla en una página de acción rápida y directa (mover a Quiénes somos). | Quitar | [54:37 - 55:25], Sec. 9 | Alta | Ninguna | Ninguno | Pendiente |
| `CON-02` | Contacto | `pages/contacto.html` | Reducir drásticamente el texto general explicativo de la página de Contacto. | Cambiar | [54:37 - 55:25], Sec. 9 | Alta | `G-06` | Copy sintetizado | Pendiente |
| `CON-03` | Contacto | `pages/contacto.html`, `styles/contacto.css` | Implementar un botón de llamada a la acción (CTA) destacado y de gran tamaño con el texto: "¿Deseas contactar con nosotros?". | Agregar | [18:00 - 18:30], Sec. 9 | Alta | `G-01` | Estilo de botón CTA | Pendiente |
| `CON-04` | Contacto | `pages/contacto.html`, `scripts/contact.js` | Configurar y verificar el enlace de contacto funcional (formulario / correo directo), resolviendo el link pendiente de edición. | Cambiar | [4:09], Sec. 9 | Alta | Ninguna | Enlace de contacto válido | Pendiente |
| `FOO-01` | Footer | `pages/components/footer.html`, `styles/components/footer.css` | Simplificar el footer de todas las páginas: mantener correo institucional visible y enlaces a redes sociales (conservar LinkedIn e incorporar enlace a GitHub). | Cambiar | [4:09 - 4:33, 20:41], Sec. 10 | Alta | Ninguna | URL de GitHub oficial | Hecho |
| `FOO-02` | Footer | `pages/components/footer.html` | Eliminar del footer la columna redundante de "Entidad ejecutora / Universidad Científica del Sur" duplicada de la navegación y el texto extenso institucional. | Quitar | [19:03 - 20:41], Sec. 10 | Alta | Ninguna | Ninguno | Hecho |
| `FOO-03` | Footer | `pages/components/footer.html` | Reducir el texto descriptivo del footer a una síntesis estricta de menos de 10 palabras. | Cambiar | [18:00 - 18:30, 20:41], Sec. 10 | Media | `G-06` | Copy condensado | Hecho |

---

## 4. Plan por Página y Criterios de Cierre

### 4.1. Menú / Navegación (`NAV`)
- **Archivos:** `pages/components/navbar.html`, `styles/components/navbar.css`, `scripts/components/navbar.js`, `scripts/loadComponents.js`.
- **Propósito:** Brindar orientación limpia, directa e intuitiva por las áreas estratégicas de la red sin sobrecargar la cabecera.
- **Tareas aplicables:**
  - [x] `NAV-01` – Quitar barra/texto de navegación redundante ("Ciencia de datos...") y mención de entidad ejecutora.
  - [x] `NAV-02` – Crear pestaña "Investigación" con submenú desplegable (Líneas, Proyectos, Artículos / Publicaciones).
  - [x] `NAV-03` – Integrar dentro del submenú de Investigación enlaces directos a líneas y proyectos resaltados.
  - [x] `NAV-04` – Estilizar navbar eliminando bordes artificiales dorados y líneas pesadas.
  - *Afectada por globales:* `G-01` (paleta), `G-03` (sin íconos), `G-04` (sin bordes decorativos), `G-08` (patrón ARC), `G-09` (responsive móvil).
- **Criterio de cierre:**
  1. No existe ningún texto explicativo largo ni duplicado de entidad ejecutora en la barra de navegación.
  2. El menú "Investigación" despliega fluidamente las 3 opciones requeridas y se repliega correctamente tanto en escritorio como en móvil.
  3. No hay íconos superfluos en los ítems de navegación.
  4. En celular, el toggle hamburguesa abre un menú vertical limpio y sin desbordes horizontales.

### 4.2. Header / Logo (`HEA`)
- **Archivos:** `pages/components/navbar.html`, `styles/components/navbar.css`, `assets/images/bi4dt-logo.png`.
- **Propósito:** Identificar con claridad institucional la marca de la red en todas las vistas del sitio.
- **Tareas aplicables:**
  - [x] `HEA-01` – Corregir contraste y visibilidad del logo resolviendo la zona oscura con fondo blanco o difusión.
  - [x] `HEA-02` – Aumentar el tamaño del logo para garantizar legibilidad completa del isotipo y del texto "BI4DT Network".
  - *Afectada por globales:* `G-01` (paleta), `G-07` (formato lienzo), `G-09` (escala móvil).
- **Criterio de cierre:**
  1. El logotipo es 100% nítido y legible sobre cualquier fondo de la cabecera, sin zonas oscuras invisibles.
  2. El texto "BI4DT Network" es legible a simple vista a una distancia estándar de pantalla sin pixelación ni deformación.

### 4.3. Inicio (Home) (`INI`)
- **Archivos:** `index.html`, `styles/index.css`, `scripts/index.js`, `scripts/publicaciones.js`.
- **Propósito:** Presentar el propósito estratégico de la red, convocar a la comunidad y dar acceso inmediato a la producción científica y la institución líder.
- **Tareas aplicables:**
  - [ ] `INI-01` – Configurar link de redirección hacia Líneas de Investigación.
  - [ ] `INI-02` – Cambiar "Entidad ejecutora" por "Nuestra institución líder" en bloque UCSUR.
  - [ ] `INI-03` – Dejar únicamente "Nuestra institución líder" sin título grande adicional.
  - [ ] `INI-04` – Reemplazar imágenes alteradas por IA o con fondos irreales (mar/playa) por fotografías originales HD.
  - [ ] `INI-05` – Corregir jerarquía del tag/span sobre el título para no competir con H1/H2.
  - [ ] `INI-06` – Eliminar información duplicada entre "Líneas de investigación" y "Ejes científicos".
  - [ ] `INI-07` – Quitar íconos decorativos en tarjetas y enlaces de áreas científicas.
  - *Afectada por globales:* `G-01` (paleta), `G-02` (jerarquía tipográfica), `G-03` (sin íconos), `G-04` (sin bordes IA), `G-05` (título único), `G-06` (<10 palabras), `G-07` (lienzo obligatorio), `G-09` (móvil).
- **Criterio de cierre:**
  1. El término "Entidad ejecutora" no aparece en el cuerpo del Home.
  2. El título del bloque UCSUR es únicamente "Nuestra institución líder".
  3. No hay fondos de playa o alteraciones artificiales en las imágenes de actividades.
  4. No existen duplicidades entre bloques de líneas científicas.
  5. Todas las imágenes cumplen el formato lienzo estricto con overlay y sin atributo `alt`.

### 4.4. Instituciones de la Red (`INS`)
- **Archivos:** `index.html`, `pages/quienes.html`, `styles/index.css`, `assets/images/associations_logo/*`.
- **Propósito:** Visibilizar con equidad y armonía a todas las entidades académicas y de salud que articulan la red.
- **Tareas aplicables:**
  - [ ] `INS-01` – Renombrar "Alianzas" por "Instituciones de la red" o "Instituciones que colaboran en la red".
  - [ ] `INS-02` – Unificar a todas las instituciones (incluida UCSUR) dentro del mismo bloque integrado.
  - [ ] `INS-03` – Ubicar a UCSUR en primer lugar (esquina superior izquierda) bajo principio de equidad.
  - [ ] `INS-04` – Formatear todos los logos como PNG transparentes sobre fondo blanco, sin bordes decorativos.
  - [ ] `INS-05` – Estandarizar presentación al formato uniforme "logo + marca institucional / título".
  - [ ] `INS-06` – Reemplazar logo del INS por la marca completa con texto institucional y escudo MINSA.
  - [ ] `INS-07` – Incorporar el logo institucional de UCSUR en la grilla integrada.
  - [ ] `INS-08` – Actualizar y verificar redirecciones de todas las instituciones (UCSUR, UNMSM, INS, ProcesaLab, Arizona, USFQ, UCSP).
  - [ ] `INS-09` – Incorporar imagen representativa y fondo institucional en el bloque para eliminar vacíos.
  - *Afectada por globales:* `G-01` (paleta), `G-04` (sin bordes desiguales), `G-05` (título único), `G-07` (formato lienzo), `G-09` (grilla responsive).
- **Criterio de cierre:**
  1. La palabra "Alianzas" ha sido reemplazada en títulos y subtítulos.
  2. UCSUR forma parte de la misma grilla ocupando la primera posición superior izquierda.
  3. Todos los logotipos tienen fondo transparente, proporción uniforme y van acompañados de su nombre institucional.
  4. El INS cuenta con su marca formal completa MINSA/INS.
  5. Cada logo redirige a la URL externa verificada en pestaña nueva (`target="_blank" rel="noopener noreferrer"`).

### 4.5. Quiénes Somos (`QS`)
- **Archivos:** `pages/quienes.html`, `styles/quienes.css`, `scripts/quienes.js`.
- **Propósito:** Transmitir la identidad, gobernanza, estructura de liderazgo y alcance internacional de la red.
- **Tareas aplicables:**
  - [ ] `QS-01` – Reestructurar contenido enfocándolo en la red como institución (misión, visión, distribución).
  - [ ] `QS-02` – Agregar sección de estructura de gobernanza y liderazgo ("Leadership") con las personas líderes.
  - [ ] `QS-03` – Mover la galería de fotos y momentos de la red desde Contacto a Quiénes somos.
  - [ ] `QS-04` – Dejar un solo título en "Nuestro enfoque", eliminando subtítulo adicional.
  - [ ] `QS-05` – Reducir texto de "Nuestra ambición" a menos de 10 palabras en su bloque.
  - [ ] `QS-06` – Quitar bordes decorativos y líneas superiores de cajas ("look IA") en misión/visión.
  - [ ] `QS-07` – Quitar íconos de encabezados en misión y visión (dianas, ojos decorativos).
  - [ ] `QS-08` – Reducir líneas de investigación en esta vista a un resumen breve, derivando el detalle a Investigación.
  - *Afectada por globales:* `G-01` (paleta), `G-02` (jerarquía tipográfica), `G-03` (sin íconos), `G-04` (sin bordes IA), `G-05` (título único), `G-06` (<10 palabras), `G-07` (lienzo en fotos), `G-09` (móvil).
- **Criterio de cierre:**
  1. Existe la sección "Leadership / Liderazgo" con los roles directivos de la red claramente identificados.
  2. Las fotos de eventos y momentos institucionales se visualizan en esta vista y han sido retiradas de Contacto.
  3. No hay cajas con bordes superiores decorativos ni íconos de diana/ojo en misión y visión.
  4. El texto de "Nuestra ambición" tiene estrictamente menos de 10 palabras.

### 4.6. Investigación (Líneas y Publicaciones) (`INV`)
- **Archivos:** `pages/area.html`, `pages/investigacion.html` (hub científico), `styles/area.css`, `styles/investigacion.css`, `assets/data/areas.json`.
- **Propósito:** Presentar el núcleo científico de la red: sus 6 líneas de investigación, proyectos asociados y acervo de publicaciones.
- **Tareas aplicables:**
  - [ ] `INV-01` – Consolidar el hub científico de Investigación para alojar Líneas, Proyectos y Publicaciones.
  - [ ] `INV-02` – Quitar números (01, 02...) de los bloques de líneas de investigación para eliminar prelación artificial.
  - [ ] `INV-03` – Unificar tamaños y proporciones de las 6 tarjetas de líneas de investigación (eliminar tetris asimétrico).
  - [ ] `INV-04` – Reemplazar íconos genéricos por imágenes fotográficas o ilustraciones científicas temáticas.
  - [ ] `INV-05` – Enfatizar con diseño equilibrado las 3 líneas con más producción (*Salud digital*, *IA en salud*, *Informática biomédica*).
  - [ ] `INV-06` – Corregir colores de los bloques, eliminando el rojo y cualquier tono fuera de paleta.
  - *Afectada por globales:* `G-01` (paleta estricta), `G-02` (tipografía), `G-03` (sin íconos), `G-04` (sin bordes IA), `G-07` (formato lienzo), `G-08` (referencia ARC), `G-09` (móvil).
- **Criterio de cierre:**
  1. Ninguna tarjeta de línea de investigación tiene números impresos.
  2. Todas las tarjetas de líneas tienen dimensiones armoniosas y simétricas.
  3. No se utiliza el color rojo en ningún componente de las líneas.
  4. Las líneas cuentan con imágenes temáticas representativas en formato lienzo con overlay.

### 4.7. Mapa de la Red (`MAP`)
- **Archivos:** `pages/quienes.html` (o `index.html`), `scripts/quienes.js`, `styles/quienes.css`.
- **Propósito:** Mostrar de manera sobria y precisa el alcance geoestratégico de los nodos nacionales e internacionales de la red.
- **Tareas aplicables:**
  - [ ] `MAP-01` – Reemplazar la capa OpenTopoMap por un mapa plano monocromático neutral (ej. CartoDB Positron).
  - [ ] `MAP-02` – Quitar nodo internacional aislado, visualizando país en lugar de puntos de ciudad extranjeros.
  - [ ] `MAP-03` – Quitar ícono decorativo en el marcador de la Universidad San Francisco de Quito.
  - [ ] `MAP-04` – Estandarizar marcadores de puntos con paleta sobria de pocos colores armónicos.
  - [ ] `MAP-05` – Descartar formalmente el trazado de líneas de conexión entre nodos.
  - [ ] `MAP-06` – Configurar el panel lateral de instituciones seleccionadas con texto limpio sin íconos.
  - [ ] `MAP-07` – Implementar dimensionamiento proporcional del radio según número de instituciones (baja opacidad).
  - *Afectada por globales:* `G-01` (paleta), `G-03` (sin íconos en popups), `G-08` (patrones sobrios), `G-09` (touch móvil).
- **Criterio de cierre:**
  1. El mapa es plano, sin sombreado topográfico de cordillera ni resaltado de ecorregiones.
  2. No existen líneas de red trazadas entre marcadores.
  3. No hay logotipos ni íconos dentro de los popups o paneles de selección del mapa.
  4. La opacidad de los círculos permite visualizar la cartografía base con total nitidez.

### 4.8. Equipo (`EQ`)
- **Archivos:** `pages/equipo.html`, `styles/equipo.css`, `assets/data/miembros.json`, `assets/images/members_bi4dt/*`.
- **Propósito:** Presentar al capital humano de la red organizado con claridad jerárquica y académica.
- **Tareas aplicables:**
  - [ ] `EQ-01` – Simplificar estructura a solo dos categorías: "Equipo" y "Estudiantes".
  - [ ] `EQ-02` – Cambiar cargo de "responsable técnico" por "Líder" y mostrar institución sin rótulo de co-investigador.
  - [ ] `EQ-03` – Reemplazar íconos provisionales en miembros sin foto por retratos en HD o avatar neutral sin íconos IA.
  - [ ] `EQ-04` – Eliminar marco blanco redundante sobre fondo blanco en las tarjetas de miembros.
  - [ ] `EQ-05` – Quitar íconos decorativos en títulos de sección (microscopios, birretes).
  - *Afectada por globales:* `G-01` (paleta), `G-02` (tipografía), `G-03` (sin íconos en títulos), `G-04` (sin marcos redundantes), `G-07` (lienzo en fotos), `G-09` (grilla móvil).
- **Criterio de cierre:**
  1. Solo existen dos bloques de personas: "Equipo" y "Estudiantes".
  2. Pamela Chacón figura con el cargo "Líder".
  3. No se lee "responsable técnico" ni "co-investigador" en ninguna tarjeta de miembro.
  4. Los títulos de sección carecen de íconos FontAwesome.
  5. Las fotos tienen proporción idéntica y marco unificado sin doble borde blanco.

### 4.9. Perfil Individual (`PER`)
- **Archivos:** `pages/investigacion.html` / `pages/estudiante.html`, `styles/investigacion.css`, `styles/estudiante.css`, `scripts/investigacion.js`, `assets/data/miembros.json`.
- **Propósito:** Detallar la trayectoria científica, producción, líneas y datos de contacto de cada investigador o estudiante.
- **Tareas aplicables:**
  - [ ] `PER-01` – Reestructurar layout en 3 secciones horizontales: Foto (izq), Brief (centro), Líneas apiladas (der).
  - [ ] `PER-02` – Estandarizar la altura de la foto para abarcar exactamente el alto del bloque lateral derecho.
  - [ ] `PER-03` – Quitar borde amarillo decorativo de la foto, manteniendo bordes redondeados limpios.
  - [ ] `PER-04` – Limitar extensión del brief a un tope máximo de 4–5 líneas o 150 palabras.
  - [ ] `PER-05` – Reubicar contacto arriba (junto a foto/nombre) con solo íconos: Email, LinkedIn, ORCID (oficial verde), Scholar, Scopus.
  - [ ] `PER-06` – Quitar título "Equipo de investigación" en la cabecera del perfil individual.
  - [ ] `PER-07` – Quitar íconos de títulos de sección "Proyectos relacionados" y "Contacto" (salvo ícono de email).
  - [ ] `PER-08` – Mantener y asegurar vinculación dinámica entre proyectos del miembro y sus líneas científicas.
  - *Afectada por globales:* `G-01` (paleta / sin borde amarillo), `G-02` (jerarquía), `G-03` (sin íconos en títulos), `G-06` (<150 palabras), `G-07` (formato lienzo), `G-09` (móvil apilable).
- **Criterio de cierre:**
  1. La ficha del investigador tiene la estructura horizontal de 3 bloques sin huecos verticales.
  2. La foto no tiene borde amarillo.
  3. La biografía respeta el límite estricto de 150 palabras.
  4. Los enlaces académicos muestran sus íconos correspondientes (especialmente el ícono verde oficial de ORCID).
  5. No existe el título "Equipo de investigación" dentro del perfil.

### 4.10. Proyectos (Listado) (`PRO`)
- **Archivos:** `pages/proyectos.html`, `styles/proyectos.css`, `scripts/proyectos.js`, `assets/data/proyectos.json`.
- **Propósito:** Permitir la exploración ágil del catálogo de proyectos de investigación mediante filtros útiles y sin ruido.
- **Tareas aplicables:**
  - [ ] `PRO-01` – Mantener filtros de "Línea de investigación" y "Estado"; eliminar filtros de "País" e "Institución".
  - [ ] `PRO-02` – Quitar campo/filtro de palabras clave (keywords) en el buscador por ser búsqueda de texto literal.
  - [ ] `PRO-03` – Unificar botones de limpiar en un solo botón funcional ("Limpiar todo").
  - [ ] `PRO-04` – Quitar íconos decorativos en etiquetas de filtros y encabezados del catálogo.
  - *Afectada por globales:* `G-01` (paleta), `G-03` (sin íconos en filtros), `G-04` (sin bordes IA), `G-06` (copies directos), `G-09` (toolbar móvil).
- **Criterio de cierre:**
  1. El panel de filtros contiene exclusivamente los selectores de "Línea de investigación" y "Estado".
  2. No existen selectores de país, institución ni tags de keywords.
  3. Existe un único botón de limpieza general de filtros.
  4. Los labels de filtros no tienen íconos decorativos adyacentes.

### 4.11. Detalle de Proyecto (`DET`)
- **Archivos:** `pages/proyecto-detalle.html`, `styles/proyecto-detalle.css`, `scripts/proyecto-detalle.js`, `assets/data/proyectos.json`, `assets/data/publicaciones.json`.
- **Propósito:** Documentar la ficha técnica integral del proyecto, sus fuentes de financiamiento y su producción de publicaciones indexadas.
- **Tareas aplicables:**
  - [ ] `DET-01` – Validar descripción, temporalidad (fechas), equipo e instituciones colaboradoras del proyecto.
  - [ ] `DET-02` – Eliminar bloque de "Palabras clave y temáticas" de la ficha.
  - [ ] `DET-03` – Reemplazar bloque "Otros proyectos en esta línea" por un botón directo "Proyectos similares".
  - [ ] `DET-04` – Agregar módulo colapsable (acordeón/dropdown) de artículos y publicaciones del proyecto (soporte 25+ papers).
  - [ ] `DET-05` – Estandarizar campos obligatorios por paper: título, año y link directo a PubMed/Scopus/DOI.
  - [ ] `DET-06` – Incorporar metadatos de financiamiento institucional (entidad y código de subvención, estándar NIH/Prociencia).
  - [ ] `DET-07` – Implementar botón opcional de exportación de publicaciones (BibTeX / CSV / RIS).
  - [ ] `DET-08` – Quitar íconos decorativos de títulos de sección en la ficha de detalle.
  - *Afectada por globales:* `G-01` (paleta), `G-02` (jerarquía tipográfica), `G-03` (sin íconos en títulos), `G-04` (sin bordes IA), `G-08` (patrón NIH/Prociencia), `G-09` (móvil).
- **Criterio de cierre:**
  1. No aparece la sección "Palabras clave y temáticas".
  2. El enlace a proyectos similares es un botón simple sin bloques de texto redundantes.
  3. Las publicaciones se muestran en formato colapsable con título, año y enlace externo a PubMed/DOI funcional.
  4. Se muestra la entidad financiadora y código de subvención del proyecto.
  5. Los encabezados no llevan íconos de adorno.

### 4.12. Contacto (`CON`)
- **Archivos:** `pages/contacto.html`, `styles/contacto.css`, `scripts/contact.js`.
- **Propósito:** Generar una interacción directa, rápida y sin fricción para vincular nuevos investigadores y aliados a la red.
- **Tareas aplicables:**
  - [ ] `CON-01` – Quitar la galería / carrusel de fotos para agilizar la acción directa (trasladar a Quiénes somos).
  - [ ] `CON-02` – Reducir drásticamente el texto general explicativo de la página.
  - [ ] `CON-03` – Implementar botón de llamada a la acción destacado y grande con el texto: "¿Deseas contactar con nosotros?".
  - [ ] `CON-04` – Configurar y verificar el enlace de contacto funcional (formulario o correo oficial).
  - *Afectada por globales:* `G-01` (botón CTA en amarillo/magenta), `G-05` (título único), `G-06` (máxima síntesis), `G-09` (móvil).
- **Criterio de cierre:**
  1. No hay carruseles ni galerías de fotos en la página de Contacto.
  2. El botón principal dice exactamente: "¿Deseas contactar con nosotros?".
  3. El botón ejecuta la acción o abre el formulario de contacto sin errores.
  4. El texto de la página es directo y se lee en menos de 10 segundos.

### 4.13. Footer (`FOO`)
- **Archivos:** `pages/components/footer.html`, `styles/components/footer.css`, `scripts/components/footer.js`.
- **Propósito:** Cerrar la experiencia de navegación de forma minimalista, institucional y funcional.
- **Tareas aplicables:**
  - [x] `FOO-01` – Simplificar footer manteniendo correo institucional y redes: conservar LinkedIn e incorporar GitHub.
  - [x] `FOO-02` – Eliminar la columna redundante de "Entidad ejecutora / UCSUR" y el texto largo institucional.
  - [x] `FOO-03` – Reducir el texto descriptivo del footer a una síntesis estricta de menos de 10 palabras.
  - *Afectada por globales:* `G-01` (paleta), `G-04` (sin bordes IA), `G-06` (<10 palabras), `G-09` (móvil).
- **Criterio de cierre:**
  1. La columna "Entidad ejecutora" ha sido eliminada por completo del footer.
  2. El texto descriptivo tiene estrictamente menos de 10 palabras.
  3. Los íconos de LinkedIn, GitHub y Correo dirigen a sus destinos correspondientes.
  4. El copyright y enlaces secundarios se adaptan perfectamente a una sola columna en pantallas móviles.

---

## 5. Matriz Página × Tarea Global

Esta matriz cruzada detalla cómo cada una de las 9 tareas globales impacta en las diferentes vistas y componentes, sirviendo como guía de verificación obligatoria durante el cierre de cada página.

| Página / Componente | `G-01`<br>Paleta estricta | `G-02`<br>Jerarquía 60-30-10 | `G-03`<br>Quitar íconos IA | `G-04`<br>Sin bordes decorativos | `G-05`<br>Títulos únicos | `G-06`<br>Síntesis (<10 / <150 p.) | `G-07`<br>Lienzo HTML | `G-08`<br>Patrones referencia | `G-09`<br>Auditoría móvil |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Menú / Navegación (`NAV`)** | X | | X | X | | | | X | X |
| **Header / Logo (`HEA`)** | X | | | | | | X | | X |
| **Inicio (`INI`)** | X | X | X | X | X | X | X | X | X |
| **Instituciones (`INS`)** | X | | | X | X | | X | | X |
| **Quiénes Somos (`QS`)** | X | X | X | X | X | X | X | X | X |
| **Investigación (`INV`)** | X | X | X | X | | | X | X | X |
| **Mapa de la Red (`MAP`)** | X | | X | | | | | X | X |
| **Equipo (`EQ`)** | X | X | X | X | | | X | | X |
| **Perfil Individual (`PER`)** | X | X | X | | X | X | X | | X |
| **Proyectos - Listado (`PRO`)** | X | | X | X | | X | | X | X |
| **Detalle de Proyecto (`DET`)** | X | X | X | X | | | | X | X |
| **Contacto (`CON`)** | X | | | | X | X | | | X |
| **Footer (`FOO`)** | X | | | X | | X | | | X |

---

## 6. Recursos Pendientes

Tabla de activos gráficos, enlaces y contenidos requeridos antes de la ejecución o cierre definitivo de las tareas correspondientes.

| Recurso / Activo Requerido | Descripción y Especificación | Tareas Bloqueadas | Responsable Sugerido |
|---|---|---|---|
| **Marca Institucional INS + MINSA** | Logo PNG transparente en alta definición del Instituto Nacional de Salud con su texto completo y escudo MINSA. | `INS-05`, `INS-06` | Pamela Chacón / Rodrigo Chacón |
| **Logos transparentes unificados** | Versiones en PNG con fondo transparente de UNMSM, UCSP, ProcesaLab, UA y USFQ. | `INS-04` | Rodrigo Chacón |
| **Fotografías institucionales auténticas** | Imágenes en alta resolución de reuniones, conferencias y laboratorios sin alteraciones de IA ni fondos de playa. | `INI-04`, `INS-09` | Pamela Chacón |
| **Fotografías de miembros del equipo** | Retratos de integrantes que aún figuran con placeholder o ícono. | `EQ-03` | Rodrigo Chacón / Pamela Chacón |
| **Imágenes temáticas para líneas** | 6 fotografías o ilustraciones científicas temáticas para sustituir los íconos de las líneas. | `INV-04` | Rodrigo Chacón |
| **Enlace y configuración de Contacto** | URL definitiva del formulario institucional o confirmación de dirección de correo corporativo para acción rápida. | `CON-04` | Rodrigo Chacón |
| **URL de GitHub oficial de la Red** | Enlace del repositorio u organización oficial en GitHub para el footer. | `FOO-01` | Rodrigo Chacón |
| **Links de páginas de referencia científica** | Publicación de los enlaces en el canal "plataforma web" (post "canales de ejemplo": NIH, Amazon ARC, Prociencia). | `G-08`, `DET-06` | Pamela Chacón |

---

## 7. Orden de Ejecución Paso a Paso

El plan se estructura en 5 fases secuenciales. Cada fase agrupa tareas por afinidad arquitectónica y culmina con un **Checkpoint de Validación** que debe cumplirse al 100% antes de avanzar a la fase siguiente.

### Fase 1: Base Global de Diseño, Identidad y Componentes Estructurales
- **Objetivo:** Establecer los cimientos visuales del sistema (colores, fuentes, bordes) y cerrar los componentes fijos transversales (Navbar, Header y Footer) que enmarcan todas las páginas.
- **Tareas incluidas:**
  - `G-01` (Paleta oficial en `colors.css`)
  - `G-02` (Jerarquía tipográfica en `index.css`)
  - `G-03` (Regla transversal de reducción de íconos)
  - `G-04` (Eliminación de bordes decorativos IA)
  - `G-05` (Eliminación de duplicidades de títulos)
  - `G-06` (Regla de síntesis en copies)
  - `G-07` (Verificación del formato lienzo en marcado)
  - `HEA-01` (Corrección de contraste y fondo del logo)
  - `HEA-02` (Aumento de escala del logo)
  - `NAV-01` (Eliminación de texto redundante en navbar)
  - `NAV-02` (Creación de pestaña Investigación con dropdown)
  - `NAV-03` (Enlaces destacados en submenú)
  - `NAV-04` (Estilización limpia del navbar)
  - `FOO-01` (Footer simplificado con redes y GitHub)
  - `FOO-02` (Eliminación de columna UCSUR en footer)
  - `FOO-03` (Reducción de texto en footer a <10 palabras)
- **Justificación:** Los estilos globales y los componentes inyectados dinámicamente (`navbar.html`, `footer.html`) afectan al 100% de las páginas. Resolverlos primero evita reprocesos de maquetación en las vistas individuales.
- **Checkpoint de Validación 1:**
  - [x] El logo es visible, nítido y legible en todas las pantallas.
  - [x] El menú de navegación incluye el desplegable de Investigación funcional.
  - [x] El footer no tiene mención duplicada de entidad ejecutora y su texto tiene menos de 10 palabras.
  - [x] No existen colores rojos ni íconos fuera de paleta en navbar o footer.

### Fase 2: Páginas Estructurales e Institucionales
- **Objetivo:** Refactorizar las vistas de presentación institucional principal: Inicio, Instituciones de la Red y Quiénes Somos.
- **Tareas incluidas:**
  - `INI-01` (Configuración de enlace de Líneas)
  - `INI-02` (Nomenclatura "Nuestra institución líder")
  - `INI-03` (Título único en bloque líder)
  - `INI-04` (Reemplazo de fotos IA / playa por HD)
  - `INI-05` (Jerarquía de tag institucional)
  - `INI-06` (Eliminación de duplicidad en líneas/ejes en home)
  - `INI-07` (Quitar íconos de áreas en home)
  - `INS-01` (Renombrar Alianzas por Instituciones de la red)
  - `INS-02` (Unificación de grilla integrada incluyendo UCSUR)
  - `INS-03` (UCSUR en primera posición superior izquierda)
  - `INS-04` (Logos PNG transparentes sobre fondo blanco)
  - `INS-05` (Formato unificado logo + nombre)
  - `INS-06` (Marca completa INS + MINSA)
  - `INS-07` (Logo UCSUR en grilla)
  - `INS-08` (Verificación de redirecciones externas)
  - `INS-09` (Imagen representativa y fondo institucional)
  - `QS-01` (Reestructuración institucional de Quiénes somos)
  - `QS-02` (Sección Leadership / Liderazgo con personas)
  - `QS-03` (Traslado de fotos/momentos desde Contacto)
  - `QS-04` (Título único en Nuestro enfoque)
  - `QS-05` (Texto de Nuestra ambición a <10 palabras)
  - `QS-06` (Eliminación de bordes decorativos en tarjetas)
  - `QS-07` (Eliminación de íconos en misión y visión)
  - `QS-08` (Resumen sintético de líneas en Quiénes somos)
- **Justificación:** Son las páginas de mayor visibilidad y confianza institucional. Reordenan la narrativa de la red antes de profundizar en los datos de proyectos e investigadores.
- **Checkpoint de Validación 2:**
  - [ ] El término "Entidad ejecutora" y "Alianzas" no existen en Home ni en Instituciones.
  - [ ] La sección "Leadership" está presente en Quiénes somos con personas reales.
  - [ ] La galería de fotos está en Quiénes somos y no en Contacto.
  - [ ] Todos los logos de instituciones tienen formato y tamaño armónico sin bordes desalineados.

### Fase 3: Páginas de Contenido, Datos y Producción Científica
- **Objetivo:** Actualizar la presentación del equipo, perfiles individuales, catálogo de proyectos y fichas técnicas con acervo de artículos.
- **Tareas incluidas:**
  - `EQ-01` (Simplificación a Equipo y Estudiantes)
  - `EQ-02` (Cargo "Líder" a Pamela e institución en demás)
  - `EQ-03` (Fotos reales en integrantes sin avatar genérico)
  - `EQ-04` (Eliminación de marco blanco sobre fondo blanco)
  - `EQ-05` (Quitar íconos de títulos en equipo)
  - `PER-01` (Layout en 3 secciones: Foto, Brief, Líneas apiladas)
  - `PER-02` (Altura estándar de foto alineada a bloque derecho)
  - `PER-03` (Quitar borde amarillo de foto)
  - `PER-04` (Brief biográfico tope 150 palabras)
  - `PER-05` (Contacto arriba con solo íconos oficiales: Email, LinkedIn, ORCID verde, Scholar, Scopus)
  - `PER-06` (Quitar título superior "Equipo de investigación" en perfil)
  - `PER-07` (Quitar íconos en títulos de perfil salvo email)
  - `PER-08` (Mapeo dinámico de proyectos y líneas)
  - `PRO-01` (Filtros: solo Línea y Estado; quitar País e Institución)
  - `PRO-02` (Quitar keywords del buscador literal)
  - `PRO-03` (Unificar en un solo botón "Limpiar todo")
  - `PRO-04` (Quitar íconos en filtros y catálogo)
  - `DET-01` (Validación de descripción, fechas, equipo e instituciones)
  - `DET-02` (Eliminar palabras clave y temáticas)
  - `DET-03` (Botón directo "Proyectos similares")
  - `DET-04` (Módulo colapsable de artículos / publicaciones)
  - `DET-05` (Datos mínimos de paper: título, año, link indexado)
  - `DET-06` (Metadatos de financiamiento institucional estándar NIH)
  - `DET-07` (Botón opcional de exportación de publicaciones)
  - `DET-08` (Quitar íconos en títulos de detalle de proyecto)
- **Justificación:** Requiere manipular la interacción de datos (`proyectos.json`, `miembros.json`, `publicaciones.json`) y ajustar los formularios y filtros de búsqueda.
- **Checkpoint de Validación 3:**
  - [ ] El perfil individual tiene exactamente 3 columnas horizontales y ningún borde amarillo en la foto.
  - [ ] El catálogo de proyectos solo filtra por Línea y Estado, con un solo botón de limpiar.
  - [ ] El detalle de proyecto incluye el módulo colapsable de artículos científicos con enlaces externos funcionales.
  - [ ] En Equipo solo existen las categorías "Equipo" y "Estudiantes".

### Fase 4: Mapa Interactivo, Hub de Investigación y Contacto Rápido
- **Objetivo:** Refinar los componentes especializados interactivos y optimizar la página de captación y contacto.
- **Tareas incluidas:**
  - `INV-01` (Consolidación de hub de Investigación)
  - `INV-02` (Quitar números 01-06 de líneas de investigación)
  - `INV-03` (Unificar tamaños de tarjetas de líneas simétricas)
  - `INV-04` (Imágenes temáticas para líneas en vez de íconos)
  - `INV-05` (Énfasis armónico en las 3 líneas prioritarias)
  - `INV-06` (Eliminar rojo y tonos ajenos en líneas)
  - `MAP-01` (Mapa plano monocromático sin relieve)
  - `MAP-02` (Quitar nodo internacional aislado; mostrar a nivel país)
  - `MAP-03` (Quitar ícono en marcador USFQ)
  - `MAP-04` (Marcadores con pocos colores sobrios)
  - `MAP-05` (Descartar trazado de líneas de conexión)
  - `MAP-06` (Panel lateral del mapa sin íconos)
  - `MAP-07` (Radios proporcionales según número de instituciones)
  - `CON-01` (Quitar carrusel de fotos de Contacto)
  - `CON-02` (Reducción drástica de texto en Contacto)
  - `CON-03` (Botón CTA grande: "¿Deseas contactar con nosotros?")
  - `CON-04` (Configuración de enlace de contacto funcional)
- **Justificación:** El mapa y las tarjetas científicas requieren calibración de scripts Leaflet y ajustes finos de CSS para evitar bloqueos visuales. Contacto queda limpio y listo para conversión directa.
- **Checkpoint de Validación 4:**
  - [ ] El mapa utiliza un layer monocromático neutral sin división de sierra/amazonía y sin líneas de red.
  - [ ] Las líneas de investigación no tienen números y sus tarjetas son del mismo tamaño con imágenes reales.
  - [ ] La página de Contacto es una acción rápida con el botón "¿Deseas contactar con nosotros?" sin fotos intermedias.

### Fase 5: Auditoría Responsive Integral, Accesibilidad y Cierre
- **Objetivo:** Garantizar la visualización perfecta en dispositivos celulares, comprobar la consistencia con las referencias de diseño y validar el 100% de los criterios de cierre.
- **Tareas incluidas:**
  - `G-08` (Validación de consistencia estética con referencias científicas: ARC, NIH, Prociencia)
  - `G-09` (Auditoría responsive completa en celulares y tablets)
  - Verificación manual de todas las redirecciones externas e internas.
- **Justificación:** Es la última etapa antes del despliegue y entrega al interesado, donde se comprueba que ningún cambio previo haya roto la experiencia móvil.
- **Checkpoint de Validación 5:**
  - [ ] Navegación en móvil 100% libre de scroll horizontal accidental.
  - [ ] Menú hamburguesa accesible y legible.
  - [ ] Todas las tablas, filtros y modales colapsan adecuadamente en pantallas pequeñas.
  - [ ] 84 de 84 tareas marcadas como `Hecho`.

---

## 8. Dudas por Confirmar

Las siguientes decisiones abiertas se documentan para resolución con los interesados (Rodrigo, Pamela y David Villarreal) sin asumir interpretaciones unilaterales:

| ID | Duda por Confirmar | Tareas Bloqueadas | Responsable de Decidir | Propuesta Técnica Recomendada |
|---|---|---|---|---|
| `D-01` | **Arquitectura de rutas de "Investigación":** Actualmente el archivo `pages/investigacion.html` funciona como la página de perfil del investigador individual. Al crearse la pestaña "Investigación" con submenú (Líneas, Proyectos, Artículos), ¿se debe renombrar `investigacion.html` a `perfil-investigador.html` (o unificarlo con `estudiante.html` en un único `perfil.html`) y crear una nueva página `investigacion.html` como hub científico? | `NAV-02`, `INV-01`, `PER-01` | Rodrigo Chacón / Pamela Chacón | Renombrar `pages/investigacion.html` a `pages/perfil.html` (parametrizado con `?id=xyz`) y utilizar `pages/investigacion.html` para el hub científico de la red. |
| `D-02` | **Definición de valores HEX de la paleta oficial:** Para eliminar el rojo y regular el amarillo/dorado, ¿se mantiene `--primary-gold: #c5a880` / `#d4af37` para detalles institucionales y un amarillo cálido de alto contraste para los botones de Call to Action (CTA)? | `G-01`, `CON-03`, `HEA-01` | Pamela Chacón / Rodrigo Chacón | Formalizar en `colors.css` tres roles: `--navy-subtitles: #0f172a` para subtítulos, `--accent-gold: #d4af37` para insignias, y `--cta-yellow: #f59e0b` para botones de acción. |
| `D-03` | **Tratamiento visual de UCSUR en Instituciones:** Aunque se acordó posicionarla primera en la esquina superior izquierda bajo equidad, Pamela mencionó la opción de un recuadro distintivo. ¿Se deja únicamente como primera en la grilla sin distinción adicional o se le añade una etiqueta sutil tipo "Institución Líder"? | `INS-03` | Pamela Chacón | Colocarla primera en la grilla con un badge sutil superior que diga "Institución Líder" sin alterar el tamaño de su tarjeta respecto a las demás. |
| `D-04` | **Estructuración de proyectos multi-población con alta densidad de papers (Caso David Villarreal - MAI con 25+ papers):** ¿Se registran como un único proyecto marco con acordeón colapsable por población/financiamiento, o se subdividen en subproyectos independientes vinculados por código de subvención? | `DET-04`, `DET-06` | David Villarreal / Pamela Chacón | Mantener un proyecto matriz por subvención y agrupar sus publicaciones en el acordeón colapsable con subdivisión por población/año. |
| `D-05` | **Acción del botón "¿Deseas contactar con nosotros?":** ¿El botón abrirá un formulario modal en la misma página, desplazará la pantalla hacia un formulario inferior o abrirá directamente el cliente de correo (`mailto:investigacion@ucsur.edu.pe`)? | `CON-03`, `CON-04` | Rodrigo Chacón | Implementar ancla directa suave hacia el formulario de contacto directo integrado en la misma página. |
| `D-06` | **Repositorio de GitHub oficial de la Red:** ¿Cuál es la URL definitiva de la organización o repositorio oficial en GitHub a enlazar en el Footer? | `FOO-01` | Rodrigo Chacón | Solicitar la URL exacta antes del cierre de la Fase 1 (ej. `https://github.com/RedBI4DT`). |
| `D-07` | **Composición del bloque "Leadership / Liderazgo" en Quiénes somos:** Además de Pamela Chacón como Líder de la Red, ¿qué otros investigadores específicos deben integrar este organigrama de gobernanza? | `QS-02` | Pamela Chacón | Registrar preliminarmente a los líderes por institución socia y confirmar nombres antes de la Fase 2. |
| `D-08` | **Proveedor del TileLayer para el mapa plano monocromático:** ¿Se aprueba el uso del proveedor libre CartoDB Positron (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`) por su estética plana en escala de grises y alta compatibilidad con Leaflet? | `MAP-01` | Rodrigo Chacón | Aprobar CartoDB Positron como capa estándar por ser el estándar más limpio en visualización académica. |

---

## 9. Fuera de Alcance / Futuro

Las siguientes iniciativas fueron mencionadas durante la reunión técnica o documentadas como ideas potenciales, pero quedan formalmente catalogadas como **fuera del alcance** de la etapa actual (Avance Final I):

| Iniciativa / Idea | Justificación Técnica | Origen |
|---|---|---|
| **Mini módulo de administrador web** | Implica desarrollo de backend, autenticación, sesiones y base de datos relacional, lo cual rompe la naturaleza estática del proyecto (Vanilla JS/HTML). Se descarta para esta fase estática. | Minuta / Transcripción [0:55 - 1:28] |
| **Automatización de publicaciones desde LinkedIn** | Requiere consumo de API oficial de LinkedIn (OAuth 2.0 / Enterprise API) o infraestructura de web scraping y funciones serverless actualmente no disponibles en el hosting estático. Rodrigo realizará pruebas experimentales por separado. | Minuta / Transcripción [1:32 - 2:21] |
| **Módulo dedicado de Patentes por proyecto** | Se incorporará en fases posteriores cuando se cuente con el catálogo formal de registros de propiedad intelectual aprobados por Indecopi / oficinas internacionales. | Minuta / Transcripción [53:33] |
| **Integración de enlaces a repositorios de código abierto por proyecto** | Se añadirá en una versión posterior cuando cada proyecto libere su código en GitHub/Zenodo. | Minuta / Transcripción [53:33] |
| **Trazado de líneas de interconexión animadas en el mapa** | Evaluado y descartado explícitamente en la reunión por generar saturación visual innecesaria (Pamela: "dejarlos solitos"). | Minuta / Transcripción [28:52 - 29:22] |

---

## 10. Verificación de Cobertura y Cumplimiento

Checklist de control de calidad para garantizar la integridad analítica del plan:

- [x] **100% de puntos del `.md` cubiertos:** Todos los ítems descritos en *Pendientes_Edicion_Web_BI4DT.md* tienen al menos una tarea con ID único asignado.
- [x] **100% de tareas con origen trazable:** Todas las tareas indican su marca de tiempo exacta `[mm:ss]` de la transcripción original o su sección del resumen de pendientes.
- [x] **Cero tareas duplicadas:** Las necesidades que afectan a múltiples páginas fueron consolidadas en tareas globales (`G-01` a `G-09`) y referenciadas en sus respectivas páginas sin duplicación.
- [x] **Pertenencia inequívoca:** Cada tarea pertenece a un prefijo funcional correspondiente a una página o al bloque global.
- [x] **Trazabilidad de dudas:** Toda duda o ambigüedad cuenta con ID propio (`D-01` a `D-08`), lista de tareas que bloquea y responsable de decisión asignado.
- [x] **Formato y restricciones:** No se ha modificado código del proyecto, no se han inventado requerimientos fuera de las fuentes y el documento está redactado en español técnico claro y directo.

