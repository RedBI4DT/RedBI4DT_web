# Protocolo y Guía de Pruebas: Formulario de Contacto e Integración con Zoho Forms

**Proyecto:** Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global (Red BI4DT)  
**Módulo:** Formulario de Contacto (`pages/contacto.html`)  
**Script de Lógica:** `scripts/contact.js`  
**Servicio Externo:** Zoho Forms (`https://forms.zohopublic.com/...`)  
**Fecha de Elaboración:** Octubre 2026  

---

## 1. Resumen de la Integración

El formulario de contacto institucional se encuentra conectado al servicio de **Zoho Forms** mediante una estrategia de envío por **Iframe oculto (`target="zoho-submit-frame"`)**. Esta solución técnica:
1. Respeta el formato nativo exigido por Zoho (`POST`, `enctype="multipart/form-data"`, `accept-charset="UTF-8"`).
2. Evita errores de restricciones CORS en navegadores al procesar formularios externos.
3. Brinda una experiencia de usuario fluida (SPA): valida datos en el cliente, muestra estados de carga interactivos, feedback visual (éxito/error) y limpia los campos tras el registro sin recargar la página.

---

## 2. Mapeo de Campos y Atributos

| Campo en Interfaz | Selector ID | Atributo `name` Zoho | Tipo / Restricción Zoho | Regla de Validación Cliente |
| :--- | :--- | :--- | :--- | :--- |
| **Nombre** | `#nombre` | `Name_First` | `maxlength="255"`, `fieldType="7"` | Obligatorio, texto no vacío |
| **Apellido** | `#apellido` | `Name_Last` | `maxlength="255"`, `fieldType="7"` | Obligatorio, texto no vacío |
| **Correo** | `#correo` | `Email` | `maxlength="255"`, `fieldType="9"` | Obligatorio, formato email estándar |
| **Teléfono** | `#telefono` | `PhoneNumber_countrycode` | `maxlength="20"`, `fieldType="11"` | Opcional; si existe, formato numérico válido |
| **Mensaje** | `#mensaje` | `MultiLine` | `maxlength="65535"` | Obligatorio, texto no vacío |
| *Oculto (Referrer)* | — | `zf_referrer_name` | String | Requerido por Zoho (valor vacío) |
| *Oculto (Redirect)* | — | `zf_redirect_url` | String | Requerido por Zoho (valor vacío) |
| *Oculto (Google Ads)* | — | `zc_gad` | String | Requerido por Zoho (valor vacío) |

---

## 3. Matriz de Casos de Prueba (Test Cases)

### TC-01: Envío exitoso con formulario completo
- **Propósito:** Validar que los datos completos son procesados y enviados a Zoho satisfactoriamente.
- **Datos de prueba:**
  - **Nombre:** `Ana María`
  - **Apellido:** `Torres Vega`
  - **Correo:** `ana.torres@ejemplo.com`
  - **Teléfono:** `+51 987654321`
  - **Mensaje:** `Consulta sobre las líneas de investigación en Inteligencia Artificial en Salud de la Red BI4DT.`
- **Resultado esperado:**
  - Botón muestra `Enviando...` con icono spinner giratorio.
  - Al completar la petición, aparece el banner verde: *"¡Mensaje enviado con éxito! Muchas gracias por comunicarte con la Red BI4DT..."*.
  - Los campos del formulario se limpian automáticamente.
  - El registro figura en el panel de entradas de Zoho Forms.

---

### TC-02: Envío exitoso con campo opcional omitido (sin teléfono)
- **Propósito:** Validar que el campo Teléfono es estrictamente opcional.
- **Datos de prueba:**
  - **Nombre:** `Carlos`
  - **Apellido:** `Mendoza`
  - **Correo:** `cmendoza@universidad.edu.pe`
  - **Teléfono:** *(dejar en blanco)*
  - **Mensaje:** `Interés en articulación interinstitucional para proyectos biomédicos.`
- **Resultado esperado:**
  - Envío exitoso, banner de confirmación verde y registro guardado en Zoho con teléfono vacío.

---

### TC-03: Validación de campos obligatorios vacíos
- **Propósito:** Impedir el envío cuando falte alguno de los campos requeridos.
- **Escenarios de prueba:**
  1. Nombre vacío.
  2. Apellido vacío.
  3. Correo electrónico vacío.
  4. Mensaje vacío.
- **Resultado esperado:**
  - Se detiene el envío.
  - Aparece el banner rojo de error indicando el campo faltante: *"Campo requerido: Por favor, ingresa tu..."*.
  - El cursor se posiciona automáticamente en el campo faltante (`focus`).
  - El botón no se bloquea ni despacha datos a Zoho.

---

### TC-04: Validación de formato de correo electrónico
- **Propósito:** Verificar que solo se admitan direcciones de email válidas.
- **Datos de prueba (inválidos):**
  - `correo_sin_arroba.com`
  - `usuario@`
  - `usuario@dominio` (sin TLD de al menos 2 letras)
- **Resultado esperado:**
  - Banner rojo de error: *"Correo no válido: Por favor, ingresa una dirección de correo electrónico válida (ej: nombre@dominio.com)"*.
  - El formulario no se envía.

---

### TC-05: Validación de formato de teléfono
- **Propósito:** Evitar caracteres no telefónicos en el campo opcional.
- **Datos de prueba (inválidos):**
  - `abc12345`
  - `telefono--falso!!`
- **Resultado esperado:**
  - Banner rojo de error: *"Teléfono no válido: Por favor, ingresa un número de teléfono con formato válido o déjalo en blanco"*.

---

### TC-06: Prevención de doble clic y control de concurrencia
- **Propósito:** Evitar registros duplicados si el usuario presiona repetidamente el botón de envío.
- **Acción:**
  - Completar los datos de prueba válidos y hacer clic varias veces rápidamente en "Enviar Mensaje".
- **Resultado esperado:**
  - Al primer clic, el botón se deshabilita (`disabled`) y cambia su etiqueta a `Enviando...`.
  - Los clics subsiguientes son ignorados. Solo se procesa una petición.

---

### TC-07: Verificación en el Panel de Zoho Forms
- **Propósito:** Confirmar que los datos son recibidos correctamente por el backend de Zoho.
- **Pasos:**
  1. Ingresar a [Zoho Forms](https://forms.zoho.com).
  2. Seleccionar el formulario **BI4DTForm** (o **BI4DT_Form**).
  3. Ir a la pestaña **Entries / Registros / All Entries**.
- **Resultado esperado:**
  - El nuevo registro debe figurar con `First Name`, `Last Name`, `Email`, `Phone Number` y `Multi Line` exactamente como fueron ingresados.

---

### TC-08: Cierre manual de notificaciones (Botón X)
- **Propósito:** Permitir al usuario descartar manualmente cualquier banner de éxito o error.
- **Acción:**
  - Provocar un aviso (por ejemplo, clic en "Enviar Mensaje" con campos vacíos o realizar un envío exitoso).
  - Al visualizarse la notificación, hacer clic en el icono "X" en la esquina superior derecha del banner.
- **Resultado esperado:**
  - La notificación desaparece de la vista inmediatamente y el formulario queda listo para su uso continuo.

---

## 4. Instrucciones para la Ejecución Manual por el Usuario

Conforme a las directrices del proyecto (`GEMINI.md`), todas las pruebas de visualización y envío se efectúan manualmente en tu entorno local:

1. **Iniciar tu servidor local:**  
   En la raíz del proyecto (`RedBI4DT_web`), ejecuta en tu terminal:
   ```bash
   # Opción 1: Python
   python -m http.server 8000

   # Opción 2: Node (si está instalado)
   npx serve .
   ```
2. **Abrir la vista de contacto:**  
   Navega en tu navegador a:
   `http://localhost:8000/pages/contacto.html`
3. **Abrir Herramientas de Desarrollador (F12):**  
   - Ve a la pestaña **Console** (para verificar que no haya advertencias o errores JS).
   - Ve a la pestaña **Network** (para monitorear la petición POST a `https://forms.zohopublic.com/.../submit`).
4. **Ejecutar cada caso de prueba (TC-01 al TC-08)** y contrastar contra la siguiente lista de verificación.

---

## 5. Lista de Verificación de Resultados (Checklist)

| Caso | Descripción | Estado (Pasó / Falló) | Observaciones |
| :--- | :--- | :---: | :--- |
| **TC-01** | Envío completo con todos los campos | [ ] | |
| **TC-02** | Envío sin campo opcional (teléfono) | [ ] | |
| **TC-03** | Bloqueo ante campos vacíos obligatorios | [ ] | |
| **TC-04** | Bloqueo ante email con formato inválido | [ ] | |
| **TC-05** | Bloqueo ante teléfono no válido | [ ] | |
| **TC-06** | Deshabilitación de botón / anti doble envío | [ ] | |
| **TC-07** | Registro recibido en panel de Zoho Forms | [ ] | |
| **TC-08** | Cierre manual de notificación con botón X | [ ] | |

