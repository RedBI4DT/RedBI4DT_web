# Plan de Páginas de Perfiles Dinámicos

## 1. Arquitectura de Datos (JSON)
- **Fuente de Datos**: La información de todas las personas se centralizará en un archivo JSON (ej. `assets/data/miembros.json`) o en múltiples archivos según la categoría.
- **Lógica Dinámica**: Al dar clic en un nombre en el `index.html`, se pasará un identificador por la URL (ej. `investigacion.html?id=pamela-chacon`).
- **Scripts**: Un script de JS (ej. `scripts/perfil.js`) leerá este ID, buscará los datos correspondientes en el JSON e inyectará dinámicamente la foto, líneas de investigación y proyectos en la estructura de la página.

---

## 2. Tipos de Página y Archivos

### A) `investigacion.html`
- **Aplica para**: Miembros de "Equipo de Investigación" y "Gestión y Articulación Productiva".
- **Archivos asociados**:
  - HTML: `investigacion.html` (ubicado en raíz o `/pages`)
  - CSS: `styles/investigacion.css`
  - JS: `scripts/investigacion.js` (o `perfil.js`)

**Bosquejo Visual:**
```text
+-------------------------------------------------------------+
|  [Logo RedBI4DT]       Inicio | Equipo | Investigacion      |
+-------------------------------------------------------------+
|  +---------------------+                                    |
|  |    FOTO             |  Nombre Completo                   |
|  |  (con overlay)      |  Cargo, Institución                |
|  +---------------------+  [Descripción breve]               |
+-------------------------------------------------------------+
| LÍNEAS DE INVESTIGACIÓN                                     |
|  - Línea 1 | - Línea 2                                      |
+-------------------------------------------------------------+
| PROYECTOS RELACIONADOS                                      |
|  [Proyecto 1]  [Proyecto 2]                                 |
+-------------------------------------------------------------+
| CONTACTO (Email / LinkedIn)                                 |
+-------------------------------------------------------------+
| FOOTER                                                      |
+-------------------------------------------------------------+
```

---

### B) `estudiante.html`
- **Aplica para**: "Estudiantes" y "Colaboradores".
- **Archivos asociados**:
  - HTML: `estudiante.html` (ubicado en raíz o `/pages`)
  - CSS: `styles/estudiante.css` (o reciclando clases de investigacion.css)
  - JS: `scripts/estudiante.js` (o el mismo `perfil.js`)

**Bosquejo Visual:**
```text
+-------------------------------------------------------------+
|  [Logo RedBI4DT]       Inicio | Equipo | Investigacion      |
+-------------------------------------------------------------+
|  +---------------------+                                    |
|  |    FOTO             |  Nombre Completo                   |
|  |  (con overlay)      |  Cargo / Rol de Estudiante         |
|  +---------------------+  [Descripción breve]               |
+-------------------------------------------------------------+
| LÍNEAS DE INVESTIGACIÓN (o de Interés)                      |
|  - Línea 1 | - Línea 2                                      |
+-------------------------------------------------------------+
| CONTACTO (Email / LinkedIn)                                 |
+-------------------------------------------------------------+
| FOOTER                                                      |
+-------------------------------------------------------------+
```

---
*Si este plan de dos vistas (con y sin proyectos) alimentadas por un JSON te parece correcto, el siguiente paso será crear el JSON de prueba y armar la estructura base.*
