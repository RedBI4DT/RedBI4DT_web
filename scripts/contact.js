/**
 * scripts/contact.js
 * Manejo de validación y envío del formulario de contacto integrado con Zoho Forms
 * Red de Ciencia, Tecnología e Innovación en Informática Biomédica y Salud Global (Red BI4DT)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contacto-form');
  const statusBox = document.getElementById('contacto-status');
  const submitBtn = document.getElementById('contacto-submit-btn');
  const iframe = document.getElementById('zoho-submit-frame');

  if (!form || !statusBox || !submitBtn) {
    return;
  }

  // Inputs
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const correoInput = document.getElementById('correo');
  const mensajeInput = document.getElementById('mensaje');

  // Elementos de error específicos
  const errorNombre = document.getElementById('error-nombre');
  const errorApellido = document.getElementById('error-apellido');
  const errorCorreo = document.getElementById('error-correo');
  const errorMensaje = document.getElementById('error-mensaje');

  let isSubmitting = false;
  let submissionTimeout = null;

  /**
   * Valida formato básico y estándar de correo electrónico
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email);
  }

  /**
   * Muestra el error visual en un campo específico
   */
  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    errorEl.classList.add('is-visible');
  }

  /**
   * Limpia el error visual de un campo específico
   */
  function clearFieldError(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    errorEl.innerHTML = '';
    errorEl.classList.remove('is-visible');
  }

  /**
   * Limpia todos los errores de campo
   */
  function clearAllFieldErrors() {
    clearFieldError(nombreInput, errorNombre);
    clearFieldError(apellidoInput, errorApellido);
    clearFieldError(correoInput, errorCorreo);
    clearFieldError(mensajeInput, errorMensaje);
  }

  let currentStatusState = null;

  const t = (k, fb) => (window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(k) : null) || fb;

  /**
   * Muestra mensaje en el contenedor de estado general
   */
  function showStatus(type, title, message) {
    currentStatusState = { type, title, message };
    statusBox.className = `contacto-status contacto-status--${type}`;
    statusBox.style.display = 'flex';

    let iconHtml = '';
    let closeBtnHtml = '';
    const closeAria = t('contacto.aria_cerrar_notificacion', 'Cerrar notificación');

    if (type === 'success') {
      iconHtml = '<i class="fa-solid fa-circle-check contacto-status-icon"></i>';
      closeBtnHtml = `<button type="button" class="contacto-status-close" aria-label="${closeAria}"><i class="fa-solid fa-xmark"></i></button>`;
    } else if (type === 'error') {
      iconHtml = '<i class="fa-solid fa-circle-exclamation contacto-status-icon"></i>';
      closeBtnHtml = `<button type="button" class="contacto-status-close" aria-label="${closeAria}"><i class="fa-solid fa-xmark"></i></button>`;
    } else if (type === 'loading') {
      iconHtml = '<i class="fa-solid fa-circle-notch fa-spin contacto-status-icon"></i>';
    }

    statusBox.innerHTML = `
      ${iconHtml}
      <div class="contacto-status-content">
        <strong class="contacto-status-title">${title}</strong>
        ${message ? `<p class="contacto-status-desc">${message}</p>` : ''}
      </div>
      ${closeBtnHtml}
    `;

    const closeBtn = statusBox.querySelector('.contacto-status-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideStatus);
    }

    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Oculta el contenedor de estado general
   */
  function hideStatus() {
    currentStatusState = null;
    statusBox.style.display = 'none';
    statusBox.className = 'contacto-status';
    statusBox.innerHTML = '';
  }

  /**
   * Restaura el estado visual del botón de envío
   */
  function resetButton() {
    submitBtn.disabled = false;
    const txt = t('contacto.btn_enviar', 'Enviar Mensaje');
    submitBtn.innerHTML = `
      <span data-i18n="contacto.btn_enviar">${txt}</span>
      <i class="fa-solid fa-paper-plane"></i>
    `;
  }

  /**
   * Establece el estado de carga en el botón
   */
  function setLoadingButton() {
    submitBtn.disabled = true;
    const txt = t('contacto.btn_enviando', 'Enviando...');
    submitBtn.innerHTML = `
      <span>${txt}</span>
      <i class="fa-solid fa-circle-notch fa-spin"></i>
    `;
  }

  /**
   * Valida todos los campos simultáneamente y resalta los que tengan error
   * @returns {boolean} true si pasa la validación, false si hay errores
   */
  function validateForm() {
    clearAllFieldErrors();

    let hasErrors = false;
    let firstErrorElement = null;

    const nombre = nombreInput ? nombreInput.value.trim() : '';
    const apellido = apellidoInput ? apellidoInput.value.trim() : '';
    const correo = correoInput ? correoInput.value.trim() : '';
    const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

    const t = (k, fb) => (window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(k) : null) || fb;

    // Validar Nombre
    if (!nombre) {
      setFieldError(nombreInput, errorNombre, t('contacto.err_nombre_req', 'Por favor, ingresa tu nombre.'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = nombreInput;
    }

    // Validar Apellido
    if (!apellido) {
      setFieldError(apellidoInput, errorApellido, t('contacto.err_apellido_req', 'Por favor, ingresa tu apellido.'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = apellidoInput;
    }

    // Validar Correo
    if (!correo) {
      setFieldError(correoInput, errorCorreo, t('contacto.err_correo_req', 'Por favor, ingresa tu correo electrónico.'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = correoInput;
    } else if (!isValidEmail(correo)) {
      setFieldError(correoInput, errorCorreo, t('contacto.err_correo_inv', 'Ingresa un correo electrónico válido (ej: nombre@dominio.com).'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = correoInput;
    }

    // Validar Mensaje
    if (!mensaje) {
      setFieldError(mensajeInput, errorMensaje, t('contacto.err_mensaje_req', 'Por favor, escribe tu mensaje o consulta antes de enviar.'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = mensajeInput;
    } else if (mensaje.length < 5) {
      setFieldError(mensajeInput, errorMensaje, t('contacto.err_mensaje_len', 'El mensaje es demasiado breve. Cuéntanos más detalles.'));
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = mensajeInput;
    }

    if (hasErrors) {
      showStatus(
        'error',
        t('contacto.status_validation_title', 'Campos incompletos o incorrectos'),
        t('contacto.status_validation_desc', 'Por favor, revisa y completa los campos señalados en rojo para poder enviar tu mensaje.')
      );
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
      return false;
    }

    return true;
  }

  /**
   * Callback ejecutado cuando el iframe finaliza la carga o concluye el timeout
   */
  function handleSubmissionComplete() {
    if (!isSubmitting) return;

    if (submissionTimeout) {
      clearTimeout(submissionTimeout);
      submissionTimeout = null;
    }

    isSubmitting = false;
    resetButton();
    clearAllFieldErrors();

    // Limpieza de campos del formulario
    form.reset();

    const tSuccessTitle = t('contacto.status_success_title', '¡Mensaje enviado con éxito!');
    const tSuccessDesc = t('contacto.status_success_desc', 'Muchas gracias por comunicarte con la Red BI4DT. Hemos recibido tu consulta y nos pondremos en contacto contigo a la brevedad.');
    showStatus('success', tSuccessTitle, tSuccessDesc);
  }

  // Escuchar el evento de carga del iframe para detectar respuesta de Zoho
  if (iframe) {
    iframe.addEventListener('load', () => {
      if (isSubmitting) {
        handleSubmissionComplete();
      }
    });
  }

  // Interceptar el envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    hideStatus();

    // Ejecutar validaciones multicampo
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;
    setLoadingButton();
    showStatus(
      'loading',
      t('contacto.status_sending_title', 'Enviando mensaje...'),
      t('contacto.status_sending_desc', 'Por favor, espera un momento mientras procesamos tu consulta.')
    );

    // Timeout de seguridad en caso de respuesta lenta de red
    submissionTimeout = setTimeout(() => {
      if (isSubmitting) {
        handleSubmissionComplete();
      }
    }, 4500);

    // Enviar formulario al endpoint de Zoho por medio del iframe target
    form.submit();
  });

  // Limpieza en tiempo real conforme el usuario escribe
  const fieldPairs = [
    { input: nombreInput, error: errorNombre },
    { input: apellidoInput, error: errorApellido },
    { input: correoInput, error: errorCorreo },
    { input: mensajeInput, error: errorMensaje }
  ];

  fieldPairs.forEach(({ input, error }) => {
    if (!input) return;

    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) {
        clearFieldError(input, error);

        // Si ya no quedan errores visibles, retirar el banner general de error
        const remainingErrors = form.querySelectorAll('.contacto-input.input-error');
        if (remainingErrors.length === 0 && statusBox.classList.contains('contacto-status--error')) {
          hideStatus();
        }
      }
    });
  });

  // Re-traducción reactiva al cambiar de idioma
  function refreshContactoTexts() {
    if (isSubmitting) {
      setLoadingButton();
    } else {
      resetButton();
    }

    if (currentStatusState) {
      if (currentStatusState.type === 'error') {
        showStatus(
          'error',
          t('contacto.status_validation_title', 'Campos incompletos o incorrectos'),
          t('contacto.status_validation_desc', 'Por favor, revisa y completa los campos señalados en rojo para poder enviar tu mensaje.')
        );
      } else if (currentStatusState.type === 'loading') {
        showStatus(
          'loading',
          t('contacto.status_sending_title', 'Enviando mensaje...'),
          t('contacto.status_sending_desc', 'Por favor, espera un momento mientras procesamos tu consulta.')
        );
      } else if (currentStatusState.type === 'success') {
        showStatus(
          'success',
          t('contacto.status_success_title', '¡Mensaje enviado con éxito!'),
          t('contacto.status_success_desc', 'Gracias por comunicarte con la Red BI4DT. Nuestro equipo se pondrá en contacto contigo a la brevedad.')
        );
      }
    }

    // Si hay campos con errores visibles, actualizar sus textos al nuevo idioma
    if (nombreInput && nombreInput.classList.contains('input-error')) {
      errorNombre.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${t('contacto.err_nombre_req', 'El nombre es obligatorio.')}`;
    }
    if (apellidoInput && apellidoInput.classList.contains('input-error')) {
      errorApellido.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${t('contacto.err_apellido_req', 'El apellido es obligatorio.')}`;
    }
    if (correoInput && correoInput.classList.contains('input-error')) {
      const val = correoInput.value.trim();
      const errTxt = !val
        ? t('contacto.err_correo_req', 'El correo electrónico es obligatorio.')
        : t('contacto.err_correo_inv', 'Por favor ingresa un correo electrónico válido.');
      errorCorreo.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errTxt}`;
    }
    if (mensajeInput && mensajeInput.classList.contains('input-error')) {
      const val = mensajeInput.value.trim();
      const errTxt = !val
        ? t('contacto.err_mensaje_req', 'El mensaje es obligatorio.')
        : t('contacto.err_mensaje_len', 'El mensaje debe tener al menos 10 caracteres.');
      errorMensaje.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errTxt}`;
    }
  }

  document.addEventListener('i18n:changed', refreshContactoTexts);
  window.addEventListener('i18n:changed', refreshContactoTexts);
});
