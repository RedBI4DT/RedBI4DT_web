document.addEventListener('DOMContentLoaded', () => {
  const base = getBasePath();
  loadComponent('navbar-placeholder', base + 'pages/components/navbar.html', base + 'styles/components/navbar.css', base + 'scripts/components/navbar.js', 'initNavbar');
  loadComponent('footer-placeholder', base + 'pages/components/footer.html', base + 'styles/components/footer.css', base + 'scripts/components/footer.js', 'initFooter');
});

/**
 * Determina la ruta relativa al directorio raíz según la ubicación de la página actual.
 */
function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

/**
 * Carga un componente HTML dinámicamente asegurando cero desfasamiento de estilos (FOUC).
 */
async function loadComponent(elementId, htmlUrl, cssUrl, jsUrl, initFnName) {
  const placeholder = document.getElementById(elementId);
  if (!placeholder) return;

  // Iniciar componente en modo invisible para evitar parpadeos no estilizados
  placeholder.classList.add('component-loading');

  try {
    // 1. Precargar CSS si no estuviera importado previamente
    if (cssUrl && !document.querySelector(`link[href="${cssUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    // 2. Cargar contenido HTML
    const response = await fetch(htmlUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const htmlContent = await response.text();
    placeholder.innerHTML = htmlContent;

    // 3. Cargar JS si se especifica
    if (jsUrl) {
      if (!document.querySelector(`script[src="${jsUrl}"]`)) {
        const script = document.createElement('script');
        script.src = jsUrl;
        script.onload = () => {
          if (initFnName && typeof window[initFnName] === 'function') {
            window[initFnName]();
          }
          showComponent(placeholder);
        };
        document.body.appendChild(script);
      } else {
        if (initFnName && typeof window[initFnName] === 'function') {
          window[initFnName]();
        }
        showComponent(placeholder);
      }
    } else {
      showComponent(placeholder);
    }
  } catch (error) {
    console.error(`Error al cargar el componente "${elementId}":`, error);
    showComponent(placeholder);
  }
}

function showComponent(placeholder) {
  placeholder.classList.remove('component-loading');
  placeholder.classList.add('component-loaded');
}
