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

  /**
   * Muestra mensaje en el contenedor de estado general
   */
  function showStatus(type, title, message) {
    statusBox.className = `contacto-status contacto-status--${type}`;
    statusBox.style.display = 'flex';

    let iconHtml = '';
    let closeBtnHtml = '';

    if (type === 'success') {
      iconHtml = '<i class="fa-solid fa-circle-check contacto-status-icon"></i>';
      closeBtnHtml = '<button type="button" class="contacto-status-close" aria-label="Cerrar notificación"><i class="fa-solid fa-xmark"></i></button>';
    } else if (type === 'error') {
      iconHtml = '<i class="fa-solid fa-circle-exclamation contacto-status-icon"></i>';
      closeBtnHtml = '<button type="button" class="contacto-status-close" aria-label="Cerrar notificación"><i class="fa-solid fa-xmark"></i></button>';
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
    statusBox.style.display = 'none';
    statusBox.className = 'contacto-status';
    statusBox.innerHTML = '';
  }

  /**
   * Restaura el estado visual del botón de envío
   */
  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <span>Enviar Mensaje</span>
      <i class="fa-solid fa-paper-plane"></i>
    `;
  }

  /**
   * Establece el estado de carga en el botón
   */
  function setLoadingButton() {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Enviando...</span>
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

    // Validar Nombre
    if (!nombre) {
      setFieldError(nombreInput, errorNombre, 'Por favor, ingresa tu nombre.');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = nombreInput;
    }

    // Validar Apellido
    if (!apellido) {
      setFieldError(apellidoInput, errorApellido, 'Por favor, ingresa tu apellido.');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = apellidoInput;
    }

    // Validar Correo
    if (!correo) {
      setFieldError(correoInput, errorCorreo, 'Por favor, ingresa tu correo electrónico.');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = correoInput;
    } else if (!isValidEmail(correo)) {
      setFieldError(correoInput, errorCorreo, 'Ingresa un correo electrónico válido (ej: nombre@dominio.com).');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = correoInput;
    }

    // Validar Mensaje
    if (!mensaje) {
      setFieldError(mensajeInput, errorMensaje, 'Por favor, escribe tu mensaje o consulta antes de enviar.');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = mensajeInput;
    } else if (mensaje.length < 5) {
      setFieldError(mensajeInput, errorMensaje, 'El mensaje es demasiado breve. Cuéntanos más detalles.');
      hasErrors = true;
      if (!firstErrorElement) firstErrorElement = mensajeInput;
    }

    if (hasErrors) {
      showStatus(
        'error',
        'Campos incompletos o incorrectos',
        'Por favor, revisa y completa los campos señalados en rojo para poder enviar tu mensaje.'
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

    showStatus(
      'success',
      '¡Mensaje enviado con éxito!',
      'Muchas gracias por comunicarte con la Red BI4DT. Hemos recibido tu consulta y nos pondremos en contacto contigo a la brevedad.'
    );
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
    showStatus('loading', 'Enviando información', 'Estamos registrando tu mensaje en nuestra plataforma...');

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
});
