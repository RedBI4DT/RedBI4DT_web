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

  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const correoInput = document.getElementById('correo');
  const telefonoInput = document.getElementById('telefono');
  const mensajeInput = document.getElementById('mensaje');

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
   * Valida formato de teléfono (números, espacios, guiones, paréntesis y opcional signo +)
   */
  function isValidPhone(phone) {
    if (!phone) return true;
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,18}$/;
    return re.test(phone.trim());
  }

  /**
   * Muestra mensaje en el contenedor de estado
   * @param {string} type - 'success' | 'error' | 'loading'
   * @param {string} title - Título del mensaje
   * @param {string} message - Descripción o detalle
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

    // Asignar evento al botón de cierre
    const closeBtn = statusBox.querySelector('.contacto-status-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideStatus);
    }

    // Scroll accesible hacia el mensaje si no está visible en pantalla
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Oculta el contenedor de estado
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
   * Valida los campos del formulario antes de despachar la petición
   * @returns {boolean} true si pasa la validación, false de lo contrario
   */
  function validateForm() {
    const nombre = nombreInput ? nombreInput.value.trim() : '';
    const apellido = apellidoInput ? apellidoInput.value.trim() : '';
    const correo = correoInput ? correoInput.value.trim() : '';
    const telefono = telefonoInput ? telefonoInput.value.trim() : '';
    const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

    if (!nombre) {
      showStatus('error', 'Campo requerido', 'Por favor, ingresa tu nombre.');
      if (nombreInput) nombreInput.focus();
      return false;
    }

    if (!apellido) {
      showStatus('error', 'Campo requerido', 'Por favor, ingresa tu apellido.');
      if (apellidoInput) apellidoInput.focus();
      return false;
    }

    if (!correo) {
      showStatus('error', 'Campo requerido', 'Por favor, ingresa tu correo electrónico.');
      if (correoInput) correoInput.focus();
      return false;
    }

    if (!isValidEmail(correo)) {
      showStatus('error', 'Correo no válido', 'Por favor, ingresa una dirección de correo electrónico válida (ej: nombre@dominio.com).');
      if (correoInput) correoInput.focus();
      return false;
    }

    if (telefono && !isValidPhone(telefono)) {
      showStatus('error', 'Teléfono no válido', 'Por favor, ingresa un número de teléfono con formato válido o déjalo en blanco.');
      if (telefonoInput) telefonoInput.focus();
      return false;
    }

    if (!mensaje) {
      showStatus('error', 'Campo requerido', 'Por favor, escribe tu mensaje o consulta antes de enviar.');
      if (mensajeInput) mensajeInput.focus();
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
      // Solo actuar si el formulario está efectivamente en proceso de envío
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

    // Ejecutar validaciones
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;
    setLoadingButton();
    showStatus('loading', 'Enviando información', 'Estamos registrando tu mensaje en nuestra plataforma...');

    // Timeout de seguridad en caso de red lenta o si el iframe bloquea el evento de load cruzado
    submissionTimeout = setTimeout(() => {
      if (isSubmitting) {
        handleSubmissionComplete();
      }
    }, 4500);

    // Enviar formulario al endpoint de Zoho por medio del iframe target
    form.submit();
  });

  // Limpiar mensaje de error cuando el usuario vuelva a interactuar con los campos
  [nombreInput, apellidoInput, correoInput, telefonoInput, mensajeInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        if (!isSubmitting && statusBox.classList.contains('contacto-status--error')) {
          hideStatus();
        }
      });
    }
  });
});

