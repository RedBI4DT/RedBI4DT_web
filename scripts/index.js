/**
 * scripts/index.js
 * - Animaciones de Scroll Reveal
 * - Carga y renderizado dinámico de publicaciones de LinkedIn desde assets/data/linkedin-posts.txt
 */

const MAX_POSTS = 3;
const SELECTORES_REVEAL = '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  cargarPublicacionesLinkedIn();
});

// Liberar estado al salir de la página
window.addEventListener('pagehide', () => {
  // Cierre limpio de página
});

/* ── 1. Scroll Reveal ────────────────────────────────── */
function initScrollReveal() {
  const elementos = document.querySelectorAll(SELECTORES_REVEAL);
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  elementos.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });

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

/* ── 2. Carga de Publicaciones de LinkedIn desde .txt ─── */
async function cargarPublicacionesLinkedIn() {
  const contenedorGrid = document.getElementById('publicaciones-grid');
  const contenedorError = document.getElementById('publicaciones-error');

  if (!contenedorGrid) return;

  if (contenedorError) {
    contenedorError.hidden = true;
  }

  const base = window.location.pathname.includes('/pages/') ? '../' : './';
  const rutaTxt = `${base}assets/data/linkedin-posts.txt`;

  try {
    const res = await fetch(rutaTxt);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}: no se pudo cargar ${rutaTxt}`);
    }

    const texto = await res.text();
    if (!texto || !texto.trim()) {
      throw new Error('El archivo linkedin-posts.txt está vacío.');
    }

    // Parseo seguro mediante DOMParser sin usar innerHTML sobre el archivo
    const parser = new DOMParser();
    const doc = parser.parseFromString(texto, 'text/html');
    const iframes = Array.from(doc.querySelectorAll('iframe'));

    const postsValidos = [];

    for (const iframe of iframes) {
      const src = iframe.getAttribute('src') || '';
      
      // Validación estricta: debe iniciar con https://www.linkedin.com/embed/
      if (!src.startsWith('https://www.linkedin.com/embed/')) {
        continue;
      }

      // Extracción de altoEmbed (default 600 si falta)
      const altoAttr = iframe.getAttribute('height');
      const altoParsed = parseInt(altoAttr, 10);
      const altoEmbed = !isNaN(altoParsed) && altoParsed > 0 ? altoParsed : 600;

      // Extracción de URN y construcción de linkedinUrl
      const urnMatch = src.match(/(urn:li:[^?&#]+)/);
      const urn = urnMatch ? urnMatch[1] : '';
      const linkedinUrl = urn ? `https://www.linkedin.com/feed/update/${urn}` : src;

      postsValidos.push({
        linkedinEmbed: src,
        altoEmbed: altoEmbed,
        linkedinUrl: linkedinUrl
      });

      if (postsValidos.length >= MAX_POSTS) {
        break;
      }
    }

    if (postsValidos.length === 0) {
      throw new Error('No se encontraron elementos iframe válidos de LinkedIn en linkedin-posts.txt.');
    }

    renderizarPostsLinkedIn(postsValidos, contenedorGrid);

  } catch (err) {
    console.error('Error al procesar publicaciones de LinkedIn:', err);
    contenedorGrid.innerHTML = '<p class="publicaciones-vacio">Aún no hay publicaciones para mostrar</p>';
  }
}

function renderizarPostsLinkedIn(posts, contenedor) {
  contenedor.innerHTML = '';

  const t = (k, fb) => (window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(k) : null) || fb;
  const verLinkedinTxt = t('noticias.ver_linkedin', 'Ver en LinkedIn');
  const verLinkedinAria = t('noticias.ver_linkedin_aria', 'Ver publicación en LinkedIn');
  const iframeTitle = t('noticias.iframe_title', 'Publicación de LinkedIn');

  posts.forEach((post, indice) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'publicacion-card reveal-on-scroll';
    const delayIndex = (indice % 3) + 1;
    tarjeta.classList.add(`reveal-delay-${delayIndex}`);

    const minAlto = Math.min(post.altoEmbed, 400);

    tarjeta.innerHTML = `
      <div class="publicacion-embed-container" style="min-height: ${minAlto}px;">
        <iframe 
          src="${post.linkedinEmbed}" 
          height="${post.altoEmbed}" 
          width="100%" 
          frameborder="0" 
          allowfullscreen="" 
          title="${iframeTitle}" 
          data-i18n-title="noticias.iframe_title"
          loading="lazy" 
          class="publicacion-iframe">
        </iframe>
      </div>
      <div class="publicacion-footer">
        <a 
          href="${post.linkedinUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="publicacion-link-mas" 
          aria-label="${verLinkedinAria}"
          data-i18n-aria-label="noticias.ver_linkedin_aria">
          <span data-i18n="noticias.ver_linkedin">${verLinkedinTxt}</span>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });

  if (typeof window.observeRevealElements === 'function') {
    window.observeRevealElements(contenedor);
  }
}
