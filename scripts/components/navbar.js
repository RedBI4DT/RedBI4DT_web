function initNavbar() {
  const base = window.location.pathname.includes('/pages/') ? '../' : './';
  
  // Elementos de navegación
  const logoLink = document.getElementById('logo-link');
  const navInicio = document.getElementById('nav-inicio');
  const navQuienesSomos = document.getElementById('nav-quienes-somos');
  const navEquipo = document.getElementById('nav-equipo');
  const navProyectos = document.getElementById('nav-proyectos');
  const navContacto = document.getElementById('nav-contacto');

  if (logoLink) logoLink.href = base + 'index.html';
  if (navInicio) navInicio.href = base + 'index.html';
  if (navQuienesSomos) navQuienesSomos.href = base + 'pages/quienes.html';
  if (navEquipo) navEquipo.href = base + 'pages/equipo.html';
  if (navProyectos) navProyectos.href = base + 'index.html#proyectos';
  if (navContacto) navContacto.href = base + 'pages/contacto.html';

  // Toggle Menú Móvil
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('navbar-nav-links');

  if (toggleBtn && navLinksContainer) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : !navLinksContainer.classList.contains('is-active');
      navLinksContainer.classList.toggle('is-active', isExpanded);
      toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar menú al hacer clic en cualquier enlace
    const allLinks = navLinksContainer.querySelectorAll('.nav-link');
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Cerrar menú al hacer clic fuera del navbar
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // Marcar enlace activo según la ubicación actual
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  // Remover cualquier estado activo previo
  [navInicio, navQuienesSomos, navEquipo, navProyectos, navContacto].forEach(link => {
    if (link) link.classList.remove('active');
  });

  if (currentPath.includes('contacto.html')) {
    if (navContacto) navContacto.classList.add('active');
  } else if (currentPath.includes('quienes.html')) {
    if (navQuienesSomos) navQuienesSomos.classList.add('active');
  } else if (currentPath.includes('equipo.html')) {
    if (navEquipo) navEquipo.classList.add('active');
  } else if (currentHash === '#proyectos') {
    if (navProyectos) navProyectos.classList.add('active');
  } else {
    if (navInicio) navInicio.classList.add('active');
  }
}

