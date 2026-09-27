# Contexto de Proyecto: Red BI4DT

## 1. Resumen del proyecto
RedBI4DT_web es una página web estática de difusión para el grupo "Red BI4DT" (Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global). Su objetivo es presentar información institucional, líneas de investigación (Informática Biomédica, IA en Salud, Interoperabilidad) y proyectos del grupo, funcionando como una tarjeta de presentación digital.

## 2. Stack técnico
- **Lenguajes:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla, ES6).
- **Frameworks/Librerías:** No utiliza frameworks frontend modernos (como React, Angular o Vue).
- **Herramientas de Build/Paquetes:** No posee gestor de dependencias (npm, yarn, composer, pip) ni herramientas de empaquetado (Webpack, Vite). Todo el código es nativo y ejecutable directamente por el navegador.
- **Iconos:** FontAwesome.

## 3. Estructura del repositorio
- `/`: Archivos principales como `index.html` (punto de entrada principal).
- `assets/`: Recursos estáticos como imágenes, fuentes y otros archivos multimedia.
- `docs/`: Documentación adicional o recursos para descarga.
- `pages/`: Archivos HTML secundarios para secciones específicas adicionales (rutas).
- `scripts/`: Lógica de JavaScript. Incluye scripts de inicialización (`index.js`, `contact.js`), carga dinámica de componentes (`loadComponents.js`) y componentes modulares (`components/`).
- `styles/`: Hojas de estilo CSS. Incluye variables de colores (`colors.css`), estilos globales (`index.css`), estilos por página (`contact.css`) y componentes específicos (`components/`).

## 4. Comandos esenciales
Al ser un proyecto de archivos estáticos sin entorno de dependencias de servidor (Node, Python), no requiere un build formal.
- **Instalar dependencias:** N/A.
- **Correr el proyecto (Desarrollo):** Usar cualquier servidor HTTP local en la raíz del proyecto para evitar errores de CORS con los scripts modulares. Ejemplos:
  - Python: `python -m http.server 8000`
  - Node: `npx serve .` o `npx http-server`
  - VS Code: Extensión "Live Server".
- **Testear/Lintear/Buildear:** N/A. No existen configuraciones de tests o linters definidos.

## 5. Convenciones de código
- **Arquitectura Frontend:** Uso de Vanilla JS para simular un comportamiento modular (inyección de HTML vía `loadComponents.js` en placeholders como `navbar-placeholder`).
- **CSS:** Uso de variables CSS para el manejo de estilos base (`colors.css`). Se prefieren clases descriptivas para el estilado.
- **JavaScript:** Organización modular, separando scripts de utilidad global o carga de componentes de la lógica específica de una vista.

## 6. Reglas para el agente
- **NO modificar sin confirmación:** No alteres el diseño base, la paleta de colores (`colors.css`) ni la estructura de navegación inyectada sin consultar. 
- **Validación de tareas:** Asegurarse de que no haya errores de consola tras modificar scripts y que los componentes dinámicos carguen correctamente al correr en un servidor HTTP local.
- **Preferencias de commits:** Usar mensajes descriptivos, de preferencia en español para alinearse al contexto.
- **Limitación Tecnológica:** Mantén el uso estricto de Vanilla JS y CSS. No introduzcas dependencias, empaquetadores (Webpack, Vite) ni frameworks a menos que el usuario lo solicite explícitamente.

## 7. Contexto de negocio/dominio
- **Dominio:** Informática Biomédica, Salud Global, Inteligencia Artificial en Salud, Interoperabilidad Clínica.
- **Entidades Clave:** BI4DT Network (la red de investigación), Ejes Científicos (líneas de estudio) y los distintos actores con los que articulan (academia, sector público).

## 8. Puntos de atención
- **Carga de componentes:** La carga asíncrona de HTML/componentes requerirá que la página se visualice a través de un servidor HTTP local; no funcionará correctamente con el protocolo directo `file://`.
- **Ausencia de Linters:** Al no haber reglas estrictas configuradas en el repositorio, intenta respetar el estilo visual y de tabulación existente en los archivos adyacentes al realizar modificaciones.

## 9. Formato de imágenes tipo "lienzo" (HTML) - Regla Obligatoria
Cada vez que se implemente un espacio de imagen o fondo (hero, banner, avatar, thumbnail, etc.), el agente DEBE usar SIEMPRE esta estructura exacta, sin excepción:

**✅ Formato obligatorio**
```html
<img src="assets/images/NOMBRE_IMAGEN.jpg" class="NOMBRE-CLASE">
<div class="NOMBRE-CLASE-overlay"></div>
```
Ejemplo real de referencia:
```html
<img src="assets/images/Imagen_1.jpg" class="banner-hero-img">
<div class="banner-hero-overlay"></div>
```

**Reglas específicas**
1. **NO usar el atributo `alt`** en ninguna imagen. Nunca agregarlo, aunque el contexto tenga descripción disponible.
2. **Siempre usar `<img src="...">` con clase**, nunca `background-image` ni contenedores tipo `<div>` como reemplazo de la imagen. Este es el formato fijo del proyecto.
3. La ruta debe seguir siempre el patrón: `assets/images/NOMBRE_IMAGEN.extension`
4. Cada imagen debe llevar su `<div class="NOMBRE-CLASE-overlay"></div>` inmediatamente después, siguiendo la nomenclatura: `[misma-clase-del-img]-overlay`
5. El nombre de clase (`class="..."`) debe ser descriptivo y consistente con el rol de la imagen, y el overlay debe heredar ese mismo prefijo.
6. Al cargar una nueva imagen, se debe reemplazar ÚNICAMENTE el valor de `src`, manteniendo intacta la clase, el overlay y el resto de la estructura.

**Aplica siempre a:**
- Banners / hero images
- Fondos de sección con overlay
- Avatares y fotos de perfil
- Miniaturas de tarjetas

**Prohibido:**
- Usar `alt="..."`
- Usar `background-image` en CSS para estos espacios
- Cambiar el orden `<img>` → `<div class="...-overlay">`
- Omitir el overlay
