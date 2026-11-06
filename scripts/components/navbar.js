function initNavbar() {
  const base = window.location.pathname.includes('/pages/') ? '../' : './';

  // ── Rutas ──────────────────────────────────────────────────
  const logoLink        = document.getElementById('logo-link');
  const logoImg         = document.getElementById('navbar-logo-img');
  const navInicio       = document.getElementById('nav-inicio');
  const navQuienesSomos = document.getElementById('nav-quienes-somos');
  const navEquipo       = document.getElementById('nav-equipo');
  const navProyectos    = document.getElementById('nav-proyectos');
  const navContacto     = document.getElementById('nav-contacto');
  const navSubProyectos = document.getElementById('nav-sub-proyectos');
  const navSubArticulos = document.getElementById('nav-sub-articulos');

  if (logoLink)        logoLink.href        = base + 'index.html';
  const updateNavbarLogo = () => {
    if (logoImg) {
      const isEn = (window.i18n && typeof window.i18n.getLanguage === 'function')
        ? window.i18n.getLanguage() === 'en'
        : (localStorage.getItem('i18n_lang') === 'en');
      logoImg.src = base + (isEn ? 'assets/images/logo_red/logo_main_EN.png' : 'assets/images/logo_red/logo_main.png');
    }
  };
  updateNavbarLogo();
  document.addEventListener('i18n:changed', updateNavbarLogo);
  window.addEventListener('i18n:changed', updateNavbarLogo);
  if (navInicio)       navInicio.href       = base + 'index.html';
  if (navQuienesSomos) navQuienesSomos.href = base + 'pages/quienes.html';
  if (navEquipo)       navEquipo.href       = base + 'pages/equipo.html';
  if (navProyectos)    navProyectos.href    = base + 'pages/proyectos.html';
  if (navContacto)     navContacto.href     = base + 'pages/contacto.html';
  if (navSubProyectos) navSubProyectos.href = base + 'pages/proyectos.html';
  if (navSubArticulos) navSubArticulos.href = base + 'pages/articulos.html';

  // ── Dropdown INVESTIGACIÓN (click en desktop Y móvil) ──────
  const dropdownBtn       = document.getElementById('nav-investigacion-btn');
  const dropdownContainer = document.getElementById('nav-dropdown-investigacion');

  const closeDropdown = () => {
    if (!dropdownContainer) return;
    dropdownContainer.classList.remove('is-open');
    if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
  };

  if (dropdownBtn && dropdownContainer) {
    dropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // evita que el click llegue al document y lo cierre inmediatamente
      const isOpen = dropdownContainer.classList.toggle('is-open');
      dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar dropdown al hacer click en cualquier lugar fuera de él
    document.addEventListener('click', (e) => {
      if (!dropdownContainer.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  // ── Toggle Menú Móvil (Hamburguesa) ────────────────────────
  const toggleBtn        = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('navbar-nav-links');

  if (toggleBtn && navLinksContainer) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined
        ? open
        : !navLinksContainer.classList.contains('is-active');

      navLinksContainer.classList.toggle('is-active', isExpanded);
      toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      // Al cerrar el menú hamburguesa, también cierra el dropdown interno
      if (!isExpanded) closeDropdown();
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar al hacer click en cualquier enlace del menú móvil
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar menú hamburguesa al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Accesibilidad: cerrar todo con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleMenu(false);
        closeDropdown();
        closeLangDropdown();
      }
    });
  }

  // ── Selector de Idioma (ES / EN) ───────────────────────────
  const langDropdownBtn       = document.getElementById('nav-lang-btn');
  const langDropdownContainer = document.getElementById('nav-lang-dropdown');
  const langCurrentText       = document.getElementById('current-lang-text');

  const closeLangDropdown = () => {
    if (!langDropdownContainer) return;
    langDropdownContainer.classList.remove('is-open');
    if (langDropdownBtn) langDropdownBtn.setAttribute('aria-expanded', 'false');
  };

  if (langDropdownBtn && langDropdownContainer) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = langDropdownContainer.classList.toggle('is-open');
      langDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!langDropdownContainer.contains(e.target)) {
        closeLangDropdown();
      }
    });

    langDropdownContainer.querySelectorAll('.bi4dt-lang-option-btn').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedLang = opt.getAttribute('data-lang');
        if (selectedLang && window.i18n && typeof window.i18n.setLang === 'function') {
          window.i18n.setLang(selectedLang);
        }
        closeLangDropdown();
      });
    });
  }

  // Sincronizar texto de idioma actual y clase activa en opciones
  if (window.i18n && typeof window.i18n.getCurrentLang === 'function') {
    const cur = window.i18n.getCurrentLang();
    if (langCurrentText) langCurrentText.textContent = cur.toUpperCase();
    if (langDropdownContainer) {
      langDropdownContainer.querySelectorAll('.bi4dt-lang-option-btn').forEach(btn => {
        const isActive = (btn.getAttribute('data-lang') || '').toLowerCase() === cur;
        btn.classList.toggle('is-active', isActive);
        btn.classList.toggle('i18n-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
  }

  // ── Enlace activo según URL ─────────────────────────────────
  const currentPath = window.location.pathname;
  [navInicio, navQuienesSomos, navEquipo, navProyectos, navContacto]
    .forEach(l => l && l.classList.remove('active'));

  const navInvestigacionBtn = document.getElementById('nav-investigacion-btn');
  if (navInvestigacionBtn) navInvestigacionBtn.classList.remove('active');

  if      (currentPath.includes('contacto.html'))                                                            { if (navContacto)     navContacto.classList.add('active'); }
  else if (currentPath.includes('quienes.html'))                                                             { if (navQuienesSomos) navQuienesSomos.classList.add('active'); }
  else if (currentPath.includes('equipo.html') || currentPath.includes('investigacion.html') || currentPath.includes('estudiante.html')) { if (navEquipo) navEquipo.classList.add('active'); }
  else if (currentPath.includes('articulos.html')) {
    if (navInvestigacionBtn) navInvestigacionBtn.classList.add('active');
    if (navSubArticulos) navSubArticulos.classList.add('active');
  }
  else if (currentPath.includes('proyectos.html') || currentPath.includes('proyecto-detalle.html')) {
    if (navInvestigacionBtn) navInvestigacionBtn.classList.add('active');
    if (navSubProyectos) navSubProyectos.classList.add('active');
  }
  else if (currentPath.includes('area.html')) {
    if (navInvestigacionBtn) navInvestigacionBtn.classList.add('active');
  }
  else                                                                                                       { if (navInicio)       navInicio.classList.add('active'); }

  // Reaplicar traducciones por si navbar se inyectó de forma asíncrona
  if (window.i18n && typeof window.i18n.reapply === 'function') {
    window.i18n.reapply();
  }
}
