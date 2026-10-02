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

  console.log('Componente Footer inicializado correctamente con enlaces dinámicos.');
}
