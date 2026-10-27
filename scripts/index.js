document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

/**
 * Inicializa el observador de intersección para animar elementos al entrar al viewport
 */
function initScrollReveal() {
  const selectores = '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale';
  const elementos = document.querySelectorAll(selectores);

  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback para navegadores antiguos sin IntersectionObserver
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Animar una sola vez para una lectura fluida
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Activar un poco antes de llegar a la parte inferior
    threshold: 0.1
  });

  elementos.forEach((el) => observer.observe(el));

  // Exponer función global para que módulos asíncronos (como publicaciones.js) puedan registrar nuevos elementos
  window.observeRevealElements = function (contenedor) {
    if (!contenedor) return;
    const nuevosElementos = contenedor.querySelectorAll(selectores);
    nuevosElementos.forEach((el) => observer.observe(el));
  };
}
