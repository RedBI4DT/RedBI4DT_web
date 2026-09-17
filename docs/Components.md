# Guía de Implementación y Creación de Componentes

Esta documentación explica la arquitectura del proyecto y cómo reutilizar o crear nuevos componentes (HTML, CSS y JS) en cualquier página de la web sin necesidad de utilizar frameworks pesados.

---

## 📁 Estructura del Proyecto

```text
RedBI4DT_web/
├── index.html                   <-- Página de entrada principal (raíz)
├── pages/                       <-- Vistas secundarias
│   ├── contact.html
│   └── components/              <-- Componentes HTML
│       ├── navbar.html
│       └── footer.html
├── styles/
│   ├── index.css                <-- Estilos globales
│   └── components/              <-- Estilos CSS por componente
│       ├── navbar.css
│       └── footer.css
└── scripts/
    ├── index.js                 <-- Script de vista principal
    ├── loadComponents.js        <-- Cargador automático de componentes
    └── components/              <-- Lógica JS por componente
        ├── navbar.js
        └── footer.js
```

---

## 🚀 1. Cómo usar componentes en una página existente o nueva

Para utilizar la Navbar y el Footer (o cualquier componente) en una vista HTML:

### Paso 1: Agregar los contenedores (placeholders)
Coloca los contenedores donde desees inyectar los componentes:

```html
<!-- En la parte superior de tu <body> -->
<div id="navbar-placeholder"></div>

<!-- Tu contenido principal -->
<main class="page-content">
  <h1>Mi Nueva Página</h1>
</main>

<!-- En la parte inferior de tu <body> -->
<div id="footer-placeholder"></div>
```

### Paso 2: Incluir el cargador de componentes
Agrega el script `loadComponents.js` antes de cerrar la etiqueta `</body>`:

- **Si la página está en la raíz (`index.html`):**
  ```html
  <script src="scripts/loadComponents.js"></script>
  <script src="scripts/index.js"></script>
  ```

- **Si la página está dentro de `pages/` (`pages/contact.html`, etc.):**
  ```html
  <script src="../scripts/loadComponents.js"></script>
  <script src="../scripts/index.js"></script>
  ```

> 💡 **Nota:** El script `loadComponents.js` detecta automáticamente si la página está en la raíz o en una subcarpeta y ajustará las rutas relativas sin romper los enlaces.

---

## 🛠️ 2. Cómo crear un NUEVO componente paso a paso

Supongamos que deseas crear un nuevo componente llamado **CardUser**:

### 1. Crear la estructura HTML
Crea el archivo en `pages/components/cardUser.html`:
```html
<div class="user-card">
  <h3 id="card-username">Usuario</h3>
  <button id="card-action-btn" class="btn btn-primary">Saludar</button>
</div>
```

### 2. Crear sus estilos CSS
Crea el archivo en `styles/components/cardUser.css`:
```css
.user-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
}
```

### 3. Crear su lógica JS (opcional)
Crea el archivo en `scripts/components/cardUser.js`:
```javascript
function initCardUser() {
  const btn = document.getElementById('card-action-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('¡Hola desde el componente CardUser!');
    });
  }
}
```

### 4. Registrarlo en `scripts/loadComponents.js`
Abre `scripts/loadComponents.js` y agrega la llamada dentro del evento `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const base = getBasePath();
  
  // Componentes existentes
  loadComponent('navbar-placeholder', base + 'pages/components/navbar.html', base + 'styles/components/navbar.css', base + 'scripts/components/navbar.js', 'initNavbar');
  loadComponent('footer-placeholder', base + 'pages/components/footer.html', base + 'styles/components/footer.css', base + 'scripts/components/footer.js', 'initFooter');

  // Tu nuevo componente
  loadComponent('user-card-placeholder', base + 'pages/components/cardUser.html', base + 'styles/components/cardUser.css', base + 'scripts/components/cardUser.js', 'initCardUser');
});
```

### 5. Usarlo en tu HTML
En cualquier archivo HTML, solo añade:
```html
<div id="user-card-placeholder"></div>
```

---

## ⚙️ Parámetros de la función `loadComponent`

```javascript
loadComponent(elementId, htmlUrl, cssUrl, jsUrl, initFnName)
```

| Parámetro | Tipo | Descripción |
| :--- | :--- | :--- |
| `elementId` | `string` | ID del elemento `<div>` donde se inyectará el componente. |
| `htmlUrl` | `string` | Ruta relativa del archivo HTML del componente. |
| `cssUrl` | `string` | *(Opcional)* Ruta del CSS. Se cargará dinámicamente en el `<head>`. |
| `jsUrl` | `string` | *(Opcional)* Ruta del JS. Se cargará dinámicamente al final del `<body>`. |
| `initFnName` | `string` | *(Opcional)* Nombre de la función JS global a ejecutar tras cargar el componente. |
