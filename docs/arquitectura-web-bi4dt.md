# Arquitectura de información: Equipo, Proyectos y Líneas de Investigación (Red BI4DT)

> Bosquejo de diseño web. Objetivo: que cada página muestre **solo lo necesario para su nivel**, sin repetir información y con una única fuente de datos.

---

## 1. Principio rector: "de lo mínimo a lo completo"

| Nivel | Página | Qué muestra | Qué NO muestra |
|---|---|---|---|
| 1 | Landing (Equipo) | Foto, nombre, rol, institución | Bio, proyectos, líneas |
| 2 | Perfil del integrante | Bio corta, proyectos (cards mínimas), contacto | Descripciones largas, tags técnicos |
| 3 | Listado general de Proyectos | Cards con resumen, estado, línea, institución | Detalle completo |
| 4 | Detalle del proyecto | Todo: objetivo, equipo, instituciones, resultados | — |

Regla: **cuanto más público y general el nivel, menos texto.** El detalle vive en un solo lugar (la página del proyecto) y los demás niveles solo apuntan a él.

---

## 2. Modelo de relaciones

```
        ┌──────────────┐        N:M        ┌──────────────┐
        │  INTEGRANTE  │◄─────────────────►│   PROYECTO   │
        └──────────────┘                   └──────┬───────┘
                                                  │ N:1
                                                  ▼
                                           ┌──────────────┐
                                           │    LÍNEA DE  │
                                           │ INVESTIGACIÓN│
                                           └──────────────┘

   PROYECTO ──N:M──► INSTITUCIÓN        PROYECTO ──N:1──► PAÍS
```

**Decisión clave: el integrante NO se asocia directamente a una línea.**
La relación se **deriva** de sus proyectos:

> Integrante → Proyectos → Líneas

Ventajas:
- Un solo lugar que mantener (el proyecto).
- Si un integrante cambia de proyecto, su perfil se actualiza solo.
- Evita inconsistencias (ej.: aparece en "IA en Salud" pero ningún proyecto lo respalda).

### Respuesta a tu pregunta: ¿hace falta "Líneas de Investigación" en el perfil?

**No como sección propia.** En tu diseño actual esa sección repite lo que ya dicen los proyectos. Mi recomendación:

- ❌ Quitar la sección grande "Líneas de Investigación" con "EJE CIENTÍFICO".
- ✅ Opcional: mostrar **1–3 chips pequeños** debajo del cargo en el hero (generados automáticamente desde sus proyectos), para que el visitante entienda de un vistazo qué hace la persona.
- ✅ Dejar que los **proyectos relacionados** sean la evidencia principal.

---

## 3. Modelo de datos (fuente única)

```yaml
integrante:
  id: pamela-chacon
  nombre: Pamela Chacón
  rol: Responsable Técnico
  institucion: Universidad Científica del Sur
  foto: /img/equipo/pamela-chacon.jpg
  bio: "Investigadora principal en Informática Biomédica..."
  contacto: { email, linkedin, orcid }
  proyectos: [fhir-interoperabilidad, ia-diagnostico-cronicas]   # solo IDs

proyecto:
  id: fhir-interoperabilidad
  titulo: Sistema de Interoperabilidad FHIR
  anio_inicio: 2023
  anio_fin: 2025
  estado: en-curso            # en-curso | concluido
  pais: Perú
  linea: interoperabilidad-gobernanza-datos   # 1 línea principal
  instituciones: [uc-sur, ins]
  resumen: "Plataforma de intercambio de datos clínicos..."   # 1-2 frases
  descripcion_larga: "..."    # solo para la página de detalle
  tags: [FHIR, Interoperabilidad, HL7]
  integrantes: [pamela-chacon, david-villarreal]

linea:
  id: interoperabilidad-gobernanza-datos
  nombre: Interoperabilidad y Gobernanza de Datos
  color: "#0F9D74"
```

> `resumen` (corto) y `descripcion_larga` (completa) son campos distintos. Cada nivel de la web usa el que le corresponde.

---

## 4. Mapa del sitio y URLs

```
/                          Landing
  └─ #equipo               Sección Equipo (4 cards)
/equipo/pamela-chacon      Perfil del integrante
/proyectos                 Listado general (filtros + búsqueda)
/proyectos?linea=ia-salud  Listado ya filtrado por línea
/proyectos/fhir-interoperabilidad   Detalle del proyecto
```

**¿Páginas de línea de investigación?** No hacen falta. Con 6 líneas, un **filtro por URL** (`?linea=...`) cumple la misma función sin crear 6 páginas más que mantener.

---

## 5. Wireframes (nivel por nivel)

### 5.1 Landing → Sección "Equipo de Investigación"

```
┌─────────────────────────────────────────────────────────┐
│ [icono] Equipo de Investigación                         │
│                                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │  FOTO    │ │  FOTO    │ │  FOTO    │ │  FOTO    │     │
│ │          │ │          │ │          │ │          │     │
│ │ Nombre   │ │ Nombre   │ │ Nombre   │ │ Nombre   │     │
│ │ Rol, Inst│ │ Rol, Inst│ │ Rol, Inst│ │ Rol, Inst│     │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────┘
        Toda la card es clicable → /equipo/{id}
```

Sin cambios respecto a lo que ya tienes. Es el nivel mínimo y está bien.

> Detalle: ahora las 4 cards usan la misma foto. Cuando tengas fotos reales de cada persona, el efecto de "equipo" mejora mucho.

---

### 5.2 Perfil del integrante

```
┌─────────────────────────────────────────────────────────┐
│ HERO (azul)                                             │
│ ┌────────┐  [EQUIPO DE INVESTIGACIÓN]                   │
│ │  FOTO  │  Pamela Chacón                               │
│ │        │  Responsable Técnico                         │
│ └────────┘  Universidad Científica del Sur              │
│             (chips opcionales: Informática Biomédica ·  │
│              Interoperabilidad · IA en Salud)           │
│             Bio breve (2-3 líneas)                      │
├─────────────────────────────────────────────────────────┤
│ [carpeta] Proyectos relacionados                        │
│                                                         │
│ ┌───────────────────┐  ┌───────────────────┐            │
│ │ 2023–2025         │  │ 2024–2026         │            │
│ │ ● Interoperab. y  │  │ ● IA en Salud     │            │
│ │   Gobernanza      │  │                   │            │
│ │                   │  │                   │            │
│ │ Sistema de        │  │ IA para Diagnóst. │            │
│ │ Interoperab. FHIR │  │ Temprano de ...   │            │
│ └───────────────────┘  └───────────────────┘            │
├─────────────────────────────────────────────────────────┤
│ [sobre] Contacto:  correo · LinkedIn · ORCID            │
└─────────────────────────────────────────────────────────┘
```

Orden recomendado: **Hero → Proyectos → Contacto.** (La sección de líneas desaparece; su información ya está en los chips y en los proyectos.)

#### Card de proyecto (versión mínima para el perfil)

```
┌───────────────────────────────┐
│▔▔▔▔▔ borde color de la línea ▔│
│ 2023–2025         EN CURSO    │   ← año + estado (opcional)
│                               │
│ ● Interoperabilidad y         │   ← línea = 1 solo tag
│   Gobernanza de Datos         │
│                               │
│ Sistema de Interoperabilidad  │   ← título (máx. 2 líneas)
│ FHIR                          │
│                               │
│                         →     │   ← flecha discreta
└───────────────────────────────┘
   Toda la card es clicable → /proyectos/{id}
```

**Qué se elimina respecto a tu versión actual:**

| Elemento | Decisión | Motivo |
|---|---|---|
| Descripción larga | ❌ Quitar | Es el nivel "mínimo"; el detalle vive en el proyecto |
| Tags (FHIR, HL7…) | ❌ Quitar | Ruido visual; son para el listado general |
| "Ver línea de investigación →" | ❌ Quitar | Confunde: lleva a una línea, no al proyecto |
| Tag de línea | ✅ Mantener (1 solo) | Es lo único que pediste mostrar |
| Año | ✅ Mantener | Da contexto temporal en 1 vistazo |
| Estado | ➖ Opcional | Útil si mezclas concluidos y en curso |

**Alineación:** en tu captura el tag de línea aparece pegado a la derecha y con distinta altura en cada card. Mejor **alinearlo siempre a la izquierda**, justo bajo el año, para que las cards queden parejas.

---

### 5.3 Listado general de Proyectos (`/proyectos`)

Aquí ya tienes un buen diseño. Es el único lugar donde sí tiene sentido mostrar más información porque la persona **vino a explorar**.

```
┌──────────────────────────────────────────────┐
│ 2023–2025 [EN CURSO] [📍Perú]                │
│ [INTEROPERABILIDAD Y GOBERNANZA DE DATOS]    │
│                                              │
│ Sistema de Interoperabilidad FHIR            │
│ Resumen (máx. 4 líneas, con recorte "…")     │
│                                              │
│ (FHIR) (Interoperabilidad) (HL7) +1          │   ← máx. 3 tags + "+N"
│ ──────────────────────────────────────────── │
│ 🏛 Universidad Científica del Sur · INS      │
└──────────────────────────────────────────────┘
   Card clicable → /proyectos/{id}
```

Ajustes sugeridos:
1. **Sustituir** "Ver línea de investigación →" por **"Ver proyecto →"** (o quitarlo y hacer clicable toda la card).
2. **Recortar el resumen** a 3–4 líneas (`line-clamp`) para que las 16 cards tengan altura pareja.
3. **Máximo 3 tags** visibles; el resto como "+2".
4. **El tag de línea sí debe ser clicable**: aplica el filtro `?linea=...` sobre el mismo listado.
5. Con 16 proyectos conviene **filtros por línea, estado, país e institución** (ya tienes el botón Filtros, perfecto).

---

### 5.4 Detalle del proyecto (`/proyectos/{id}`)

**Respuesta a tu pregunta: ¿página propia o solo tags?**

Recomiendo **sí crear la página de detalle**, pero con una plantilla simple y única (se llena desde el modelo de datos, no es diseño manual por proyecto).

```
┌─────────────────────────────────────────────────────────┐
│ HERO                                                    │
│ ← Volver a proyectos                                    │
│ [INTEROPERABILIDAD Y GOBERNANZA]  [EN CURSO]  [📍Perú]  │
│ Sistema de Interoperabilidad FHIR                       │
│ 2023–2025                                               │
├─────────────────────────────────────────────────────────┤
│ Descripción completa                                    │
│ Objetivo · Alcance · Resultados esperados / logrados    │
│                                                         │
│ Tags: FHIR · Interoperabilidad · HL7 · Hospital         │
├─────────────────────────────────────────────────────────┤
│ Equipo del proyecto  → cards mini de integrantes        │
│                        (clic → /equipo/{id})            │
│ Instituciones participantes                             │
├─────────────────────────────────────────────────────────┤
│ Proyectos relacionados (misma línea) · 2–3 cards        │
└─────────────────────────────────────────────────────────┘
```

**Por qué conviene la página y no solo tags:**

| Criterio | Solo tags/cards | Página de detalle |
|---|---|---|
| Escalabilidad (16 → 40 proyectos) | Se satura | ✅ Escala bien |
| URL para compartir (correos, papers, redes) | ❌ No | ✅ Sí |
| SEO / aparecer en Google | Pobre | ✅ Mejor |
| Cierra el círculo integrante ↔ proyecto | ❌ | ✅ Navegación bidireccional |
| Esfuerzo de mantenimiento | Bajo | Bajo **si usas plantilla desde datos** |

**Alternativa ligera** (si no quieres 16 páginas ahora): abrir el detalle en un **panel lateral (drawer) o modal** dentro de `/proyectos`. Es más rápido de construir, pero pierdes URL propia y SEO. Mi sugerencia es empezar con la página real, aunque su contenido inicial sea corto: título, descripción, equipo e instituciones.

---

## 6. Flujo de navegación completo

```
Landing ── clic en card de integrante ──► Perfil del integrante
                                              │
                                              │ clic en card de proyecto
                                              ▼
Listado /proyectos ── clic en card ──────► Detalle del proyecto
        ▲                                     │
        │                                     ├─ clic en integrante ─► Perfil
        └──── clic en tag de línea ◄──────────┘
              (filtra el listado)
```

Todo está interconectado, pero cada dato se escribe **una sola vez**.

---

## 7. Resumen de decisiones

1. **Integrante ↔ Línea:** relación derivada vía proyectos; sin sección propia en el perfil. Chips opcionales en el hero.
2. **Perfil → proyectos:** cards mínimas = año + 1 tag de línea + título; clic lleva al detalle del proyecto.
3. **Quitar** "Ver línea de investigación" de las cards; reemplazar por card clicable / "Ver proyecto".
4. **Listado general:** se mantiene rico (resumen, tags, institución), con recorte de texto y máx. 3 tags.
5. **Página de detalle del proyecto:** sí, con plantilla única alimentada desde datos.
6. **Páginas de línea:** no; usar filtros por URL.
7. **Contacto:** se queda al final del perfil, como ya lo tienes.

---

## 8. Siguientes pasos sugeridos

- [ ] Confirmar la lista final de líneas (6) y asignar **una línea principal** a cada uno de los 16 proyectos.
- [ ] Definir `resumen` (1–2 frases) para cada proyecto.
- [ ] Armar la plantilla de detalle de proyecto.
- [ ] Reemplazar fotos genéricas por fotos reales del equipo.
- [ ] Probar la navegación: Landing → Perfil → Proyecto → Listado filtrado.
