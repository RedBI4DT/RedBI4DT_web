/**
 * lineas.js - Red BI4DT
 * Inicialización y animaciones de la vista de Líneas de Investigación
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar animaciones de scroll reveal
  const reveals = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
});

