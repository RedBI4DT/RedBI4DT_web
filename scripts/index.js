/**
 * scripts/index.js
 * Sistema de animaciones de scroll (Scroll Reveal):
 * - Flujo de carga limpio y sincronizado (sin retención en memoria ni caché artificial).
 * - Una vez visible, el elemento permanece visible para una lectura natural.
 */

const SELECTORES_REVEAL = '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

// Liberar estado al salir de la página para que el navegador no guarde memoria congelada
window.addEventListener('pagehide', () => {
  // Cierre limpio de página
});

function initScrollReveal() {
  const elementos = document.querySelectorAll(SELECTORES_REVEAL);
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // 1. Mostrar inmediatamente los elementos que ya están en el viewport
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  elementos.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });

  // 2. Observar elementos restantes que entren al hacer scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.05
  });

  elementos.forEach((el) => {
    if (!el.classList.contains('is-visible')) {
      observer.observe(el);
    }
  });

  // Exponer función global para módulos asíncronos (como publicaciones.js)
  window.observeRevealElements = function (contenedor) {
    if (!contenedor) return;
    const nuevosElementos = contenedor.querySelectorAll(SELECTORES_REVEAL);
    nuevosElementos.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  };
}
