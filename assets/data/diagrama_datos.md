# Modelo y Diagrama de Base de Datos - Red BI4DT

Este documento describe la arquitectura relacional y el modelo de datos estructurado en formato JSON ubicado en `assets/data/` para la plataforma de la **Red BI4DT** (Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global).

---

## 1. Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    INSTITUCION ||--o{ MIEMBRO : "afilia a (1:N)"
    INSTITUCION ||--o{ PROYECTO : "participa en (N:M)"
    
    AREA ||--o{ PROYECTO : "clasifica cientificamente (1:N)"
    
    PROYECTO ||--o{ PUBLICACION_CIENTIFICA : "produce (1:N)"
    
    PROYECTO }o--o{ MIEMBRO : "integrantes del equipo (N:M)"
    
    INSTITUCION {
        string id PK "Identificador único (slug)"
        string nombre "Nombre oficial de la institución"
        string sigla "Acrónimo institucional (UCSUR, UNMSM, INS, UCSP, URP, USFQ, UofA)"
        string nombre_completo "Nombre con acrónimo para etiquetas y modales"
        string pais "País sede (Perú, Ecuador, Estados Unidos)"
        string pais_id "Identificador para nodos geográficos (peru, ecuador, usa)"
        string ciudad "Ciudad del nodo territorial"
        string tipo "Universidad | Instituto Público de Investigación | Empresa I+D"
        boolean es_sede_principal "Indica el nodo central de coordinación"
        float[] coords "Coordenadas geográficas [latitud, longitud]"
    }

    AREA {
        string id PK "Identificador científico canónico (slug)"
        string nombre "Nombre formal del eje científico"
        string slug "Ruta amigable para navegación web"
        string descripcion "Marco conceptual y alcance"
        string icono "Clase de FontAwesome representativa"
        string color "Alias de color de la paleta institucional"
    }

    MIEMBRO {
        string id PK "Identificador único del investigador (slug)"
        string nombre "Nombre y apellidos completos"
        string institucion FK "Nombre de institución de adscripción"
        string foto "Ruta local del recurso de imagen webp"
        string descripcion "Perfil profesional, trayectoria y biografía científica"
        string categoria "investigadores | gestion | estudiantes"
    }

    PROYECTO {
        string id PK "Identificador único del proyecto (slug)"
        string titulo "Título oficial de investigación"
        string resumen "Resumen ejecutivo para tarjetas de catálogo"
        string descripcion_larga "Memoria técnica y planteamiento metodológico"
        string anio "Período o rango de ejecución (ej. 2023–2025)"
        string estado "Estado de ejecución: En curso | Concluido"
        string area_id FK "Línea científica principal asignada"
        string[] paises "Países con intervención o investigadores asociados"
        string[] instituciones FK "Nombres de instituciones participantes"
        string investigador_principal FK "ID del investigador líder del proyecto"
        string[] integrantes FK "Array de IDs de los miembros participantes"
        string[] tags "Palabras clave temáticas"
    }

    PUBLICACION_CIENTIFICA {
        string titulo "Título del artículo científico o paper"
        string url "Enlace externo directo (PubMed, DOI, Revista indexada)"
        int anio "Año de publicación"
        string revista "Revista científica o journal indexado"
    }
```

---

## 2. Diccionario de Entidades y Colecciones

### A. `instituciones.json`
* **Colección:** `instituciones[]`
* **Propósito:** Mapear de forma normalizada las universidades, institutos públicos y centros de I+D de la red internacional a partir de la filiación de los miembros.
* **Campos clave:**
  * `id` (PK): Slug único (`ucsur`, `unmsm`, `ins`, `ucsp`, `procesa-lab`, `urp`, `usfq`, `arizona`).
  * `nombre`: Nombre oficial sin acrónimo.
  * `sigla`: Acrónimo oficial.
  * `nombre_completo`: Nombre formateado para visualización en el mapa (`Universidad Científica del Sur (UCSUR)`).
  * `pais_id`: Clave de agrupación territorial (`peru`, `ecuador`, `usa`).
  * `coords`: Coordenadas `[latitud, longitud]` para Leaflet / OpenStreetMap.

### B. `areas.json`
* **Colección:** `areas[]`
* **Propósito:** Definir los 6 ejes estratégicos de investigación científica de la red.
* **Campos clave:**
  * `id` (PK): Slug del área (`informatica-biomedica`, `ia-salud`, `interoperabilidad`, `analitica-datos`, `sociotecnica-adopcion`, `salud-digital`).
  * `nombre`: Denominación formal del eje.
  * `descripcion`: Fundamentación científica.

### C. `miembros.json`
* **Colecciones:** `investigadores[]`, `gestion[]`, `estudiantes[]`
* **Propósito:** Directorio del equipo humano científico y administrativo.
* **Campos clave:**
  * `id` (PK): Slug del integrante (`pamela-chacon`, `david-villarreal`, `irvin-dongo`, etc.).
  * `institucion` (FK): Nombre de la institución a la que está afiliado (relacionado con `instituciones.json`).
  * `proyectos` (FK[]): Lista de IDs de proyectos en los que participa (relación N:M).

### D. `proyectos.json`
* **Colección:** `proyectos[]`
* **Propósito:** Catálogo de iniciativas de I+D+i de la Red BI4DT.
* **Campos clave:**
  * `id` (PK): Slug del proyecto (`fhir-interoperabilidad-2023`, `hce-nacional-2022`, etc.).
  * `area_id` (FK): Clave foránea hacia `areas.json`.
  * `investigador_principal` (FK): Clave foránea al líder en `miembros.json`.
  * `integrantes` (FK[]): Claves foráneas de los co-investigadores en `miembros.json` (relación N:M).
  * `instituciones` (FK[]): Lista de instituciones vinculadas.
  * `publicaciones` (1:N anidada): Lista de artículos indexados (`titulo`, `url`, `anio`, `revista`).

---

## 3. Matriz de Relaciones y Trazabilidad en las Vistas

| Relación | Implementación Técnica | Flujo de Usuario en la Web |
| :--- | :--- | :--- |
| **Proyecto ↔ Área** | `PROYECTO.area_id` → `AREA.id` | En `proyectos.html` se filtra por línea. En `proyecto-detalle.html` el badge enlaza a `area.html?id=...`. En `area.html` se listan los proyectos de esa línea. |
| **Proyecto ↔ Miembro (N:M)** | `PROYECTO.integrantes[]` → `MIEMBRO.id` | En `proyecto-detalle.html` se muestra el equipo con fotos que enlazan a `investigacion.html?id=...`. En `investigacion.html` el perfil muestra los proyectos del miembro filtrando por `p.integrantes.includes(m.id)`. |
| **Proyecto ↔ Institución** | `PROYECTO.instituciones[]` ↔ `INSTITUCION.nombre` | En `proyecto-detalle.html` la ficha técnica muestra las instituciones socias del proyecto. |
| **Miembro ↔ Institución** | `MIEMBRO.institucion` → `INSTITUCION.nombre` | En las tarjetas de miembro y en el perfil del investigador se indica su universidad o centro de investigación. |
| **Institución ↔ Mapa de Red** | `INSTITUCION.pais_id` y `INSTITUCION.coords` | En `quienes.html` el mapa de OpenStreetMap sitúa los nodos y al hacer clic en un país el panel lateral despliega sus instituciones aliadas. |
| **Proyecto ↔ Publicación (1:N)** | `PROYECTO.publicaciones[]` | En `proyecto-detalle.html` la tarjeta "Publicaciones" lista los papers enlazados a PubMed o DOI ordenados descendentemente por año. |

