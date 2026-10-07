function initFooter() {
  const base = window.location.pathname.includes('/pages/') ? '../' : './';

  // Logo
  const footerLogo = document.getElementById('footer-logo-link');
  const footerLogoImg = document.getElementById('footer-logo-img');
  if (footerLogo) footerLogo.href = base + 'index.html';
  if (footerLogoImg) footerLogoImg.src = base + 'assets/images/logo_r4.png';

  // Navegación
  const footerMain = document.getElementById('footer-nav-main');
  if (footerMain) footerMain.href = base + 'index.html';

  const footerContact = document.getElementById('footer-nav-contact');
  if (footerContact) footerContact.href = base + 'pages/contact.html';

  // Botón Volver Arriba universal
  inicializarBotonVolverArriba();

  console.log('Componente Footer inicializado correctamente con enlaces dinámicos.');
}

/**
 * Lógica universal para mostrar/ocultar el botón flotante Volver Arriba al hacer scroll
 * y realizar desplazamiento suave al inicio al hacer clic.
 */
function inicializarBotonVolverArriba() {
  let btnBackToTop = document.getElementById('btn-back-to-top');

  // Si por alguna razón el botón no está presente, crearlo dinámicamente
  if (!btnBackToTop) {
    btnBackToTop = document.createElement('button');
    btnBackToTop.id = 'btn-back-to-top';
    btnBackToTop.className = 'back-to-top-btn';
    btnBackToTop.setAttribute('aria-label', 'Volver arriba al inicio de la página');
    btnBackToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    document.body.appendChild(btnBackToTop);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      btnBackToTop.classList.add('is-visible');
    } else {
      btnBackToTop.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility(); // Evaluación inicial

  btnBackToTop.onclick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
}
