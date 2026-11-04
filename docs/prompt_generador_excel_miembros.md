# PROMPT PARA AGENTE: Generación de Plantilla Excel para Recolección de Datos de Miembros (Red BI4DT)

> **Instrucción para el usuario:** Copia y pega el contenido dentro del recuadro a continuación en la sesión del agente encargado de procesar o generar archivos Excel (por ejemplo, mediante Python con `openpyxl` o integración con Google Sheets/Excel).

---

```markdown
Eres un asistente experto en ingeniería de datos y desarrollo web para la Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global (**Red BI4DT**).

### OBJETIVO
Tu tarea es generar un archivo de Excel profesional (`.xlsx`) llamado `plantilla_recoleccion_miembros_bi4dt.xlsx` que sirva como instrumento de recolección y actualización de datos para los miembros del portal web. Los datos recopilados en este Excel se convertirán directamente en el archivo `assets/data/miembros.json` de la plataforma web.

---

### ESTRUCTURA DE PESTAÑAS DEL EXCEL

El libro de trabajo debe contener **3 pestañas de datos principales** y **1 pestaña de catálogos**:

1. **`Investigadores`**: Para los investigadores principales, co-investigadores y asociados RENACYT (perfiles vinculados a `pages/investigacion.html`).
2. **`Estudiantes`**: Para estudiantes tesistas, pregrado/posgrado y colaboradores académicos (perfiles vinculados a `pages/estudiante.html`).
3. **`Gestión`**: Para coordinadores de proyectos y articulación con el sector productivo.
4. **`Catálogos (Validación)`**: Lista de instituciones y líneas científicas oficiales para validación de datos.

---

### COLUMNAS EXACTAS DE CADA PESTAÑA DE MIEMBROS

Cada pestaña de miembros debe contener exactamente las siguientes columnas (de izquierda a derecha):

#### Bloque 1: Identificación y Perfil Académico
1. **`ID / Slug`** (Texto, ej: `pamela-chacon`, minúsculas sin acentos ni espacios).
2. **`Nombres y Apellidos`** (Texto, ej: `Pamela Chacón`).
3. **`Rol / Cargo Oficial`** (Texto o lista desplegable, ej: `Investigadora Principal`, `Co-investigador`, `Investigador RENACYT`, `Estudiante de Ing. Informática`, `Tesista`).
4. **`Institución de Afiliación`** (Lista desplegable con validación contra la pestaña Catálogos):
   * Universidad Científica del Sur (UCSUR)
   * Universidad Nacional Mayor de San Marcos (UNMSM)
   * Instituto Nacional de Salud (INS)
   * Universidad Católica San Pablo (UCSP)
   * Procesa Lab S.A.C.
   * Universidad Ricardo Palma (URP)
   * Universidad San Francisco de Quito (USFQ)
   * The University of Arizona (UofA)
5. **`Nombre Archivo Foto`** (Texto, ej: `Pamela Chacon.webp` o `user.webp` para predeterminado).
6. **`Biografía / Resumen Profesional`** (Texto largo descriptivo para el perfil web).
7. **`Líneas de Investigación`** (Texto separado por comas o lista de áreas asociadas).

#### Bloque 2: Redes de Contacto y Banderas Booleanas de Visibilidad
Cada red social o medio de contacto debe contar obligatoriamente con su respectivo campo booleano de visibilidad (`TRUE` o `FALSE`), ya que el sitio web solo mostrará en el perfil aquellos iconos cuya bandera esté en `TRUE`:

8. **`Email de Contacto`** (Texto, correo institucional o profesional).
9. **`Mostrar Correo en Web`** (Validación desplegable: `TRUE` / `FALSE`, por defecto `TRUE`).
10. **`URL de LinkedIn`** (URL completa, ej: `https://www.linkedin.com/in/...`).
11. **`Mostrar LinkedIn en Web`** (Validación desplegable: `TRUE` / `FALSE`, por defecto `TRUE`).
12. **`URL / Código ORCID`** (URL completa, ej: `https://orcid.org/0000-0002-XXXX-XXXX`).
13. **`Mostrar ORCID en Web`** (Validación desplegable: `TRUE` / `FALSE`, por defecto `TRUE`).
14. **`URL de Google Scholar`** (URL completa, ej: `https://scholar.google.com/citations?user=...`).
15. **`Mostrar Google Scholar en Web`** (Validación desplegable: `TRUE` / `FALSE`, por defecto `TRUE`).

---

### ESPECIFICACIONES DE DISEÑO Y FORMATO DEL EXCEL

1. **Cabecera Institucional:**
   * Fondo azul marino (`#001A4D` o `#1A3668`) con texto blanco en negrita para datos de perfil.
   * Fondo azul intermedio (`#0284C7`) con texto blanco para campos de URLs de contacto.
   * Fondo dorado/ámbar (`#F59E0B`) con texto oscuro/negrita para las columnas de control booleano (`Mostrar...`).
2. **Validación de Datos:**
   * Columnas de visibilidad (`Mostrar Correo`, `Mostrar LinkedIn`, `Mostrar ORCID`, `Mostrar Scholar`): configurar menú desplegable con opciones fijas: `TRUE, FALSE`.
   * Columna `Institución`: configurar validación de lista ligada al rango de la pestaña de catálogos.
3. **Ancho de columnas:** Auto-ajustar ancho con padding para evitar textos cortados.
4. **Fila de Ejemplo y Miembros Actuales:**
   * Precarga en la pestaña `Investigadores` a los investigadores existentes del portal web como referencia.
   * Precarga en la pestaña `Estudiantes` a los estudiantes registrados actualmente.
5. **Formato nativo:** Genera el archivo usando la librería Python `openpyxl` o genera el script ejecutable para crearlo de inmediato.

---

### CORRESPONDENCIA CON EL ARCHIVO JSON FINAL

Ten en cuenta que cada fila del Excel se traducirá al siguiente formato JSON consumido por el frontend:

```json
{
  "id": "slug-del-miembro",
  "nombre": "Nombres y Apellidos",
  "institucion": "Nombre Institución",
  "cargo": "Rol o Cargo",
  "foto": "../assets/images/members_bi4dt/Nombre.webp",
  "descripcion": "Biografía profesional...",
  "contacto": {
    "email": "correo@ejemplo.com",
    "linkedin": "https://www.linkedin.com/in/...",
    "orcid": "https://orcid.org/...",
    "scholar": "https://scholar.google.com/..."
  },
  "redes": {
    "correo": true,
    "linkedin": true,
    "orcid": false,
    "scholar": true
  }
}
```

Genera ahora el archivo o código necesario para entregar el Excel completamente formateado.
```

