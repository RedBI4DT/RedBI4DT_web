# Guía de Uso de FontAwesome

Esta documentación explica cómo se integraron los iconos de **FontAwesome (versión local)** guardados en la carpeta `assets/fontawesome` y cómo utilizarlos en cualquier página o componente del proyecto.

---

## 📂 Ubicación de Archivos de FontAwesome

El proyecto incluye la biblioteca completa de FontAwesome de forma local en la siguiente ruta:

```text
RedBI4DT_web/
└── assets/
    └── fontawesome/
        ├── css/
        │   ├── all.min.css     <-- Archivo CSS cargado en el proyecto
        │   └── ...
        └── webfonts/
            ├── fa-solid-900.woff2
            ├── fa-brands-400.woff2
            └── ...
```

---

## ⚙️ ¿Cómo está integrado en el proyecto?

FontAwesome se importa **globalmente** al inicio del archivo [`styles/index.css`](file:///c:/Users/rodri/Projects-Programation/RedBI4DT_web/styles/index.css):

```css
@import url('../assets/fontawesome/css/all.min.css');
```

Como la hoja de estilos `styles/index.css` es cargada por todas las páginas (`index.html`, `pages/contact.html`, etc.), **no necesitas volver a importar FontAwesome en ningún otro sitio**. Los iconos funcionan automáticamente en componentes HTML, plantillas y contenido.

---

## 🎨 Cómo Usar Iconos en HTML

Para usar un icono, simplemente inserta una etiqueta `<i>` con las clases correspondientes de FontAwesome:

### 1. Iconos Sólidos (`fa-solid`)
```html
<i class="fa-solid fa-house"></i>
<i class="fa-solid fa-envelope"></i>
<i class="fa-solid fa-rocket"></i>
<i class="fa-solid fa-user"></i>
```

### 2. Iconos de Marcas (`fa-brands`)
```html
<i class="fa-brands fa-github"></i>
<i class="fa-brands fa-linkedin-in"></i>
<i class="fa-brands fa-x-twitter"></i>
```

---

## 💡 Ejemplos Prácticos en el Proyecto

### En Botones:
```html
<button class="btn btn-primary">
  <i class="fa-solid fa-paper-plane"></i> Enviar Mensaje
</button>
```

### En Enlaces de Navegación:
```html
<a href="contact.html" class="nav-link">
  <i class="fa-solid fa-envelope"></i> Contacto
</a>
```

### Dentro de Inputs / Formularios:
```html
<div class="form-input-container">
  <input type="text" class="form-input" placeholder="Nombre...">
  <i class="fa-solid fa-user form-input-icon"></i>
</div>
```

---

## 🔍 ¿Dónde encontrar más iconos?

Puedes consultar todos los nombres de clases de iconos compatibles navegando en la documentación oficial de [FontAwesome Icons](https://fontawesome.com/icons). Solo usa las clases que comiencen por `fa-solid` o `fa-brands`.
