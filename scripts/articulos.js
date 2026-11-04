/**
 * scripts/articulos.js
 * Lógica modular para el catálogo de artículos científicos de la Red BI4DT.
 * Carga artículos vinculados desde proyectos.json, permite búsqueda y paginación (6, 9, 12).
 */

(function () {
  'use strict';

  // Estado global del catálogo
  let todosArticulos = [];
  let articulosFiltrados = [];
  let paginaActual = 1;
  let itemsPorPagina = 6;

  // Elementos del DOM
  const listEl = document.getElementById('articulos-list');
  const countEl = document.getElementById('articulos-count');
  const totalStatEl = document.getElementById('stat-total-articulos');
  const emptyEl = document.getElementById('articulos-empty');
  const emptyResetBtn = document.getElementById('articulos-empty-reset');
  const paginationBar = document.getElementById('articulos-pagination');
  const searchInput = document.getElementById('articulos-search-input');
  const searchClearBtn = document.getElementById('articulos-search-clear');
  const perPageSelect = document.getElementById('articulos-per-page');

  /**
   * Inicialización de la vista
   */
  async function initArticulos() {
    try {
      const res = await fetch('../assets/data/proyectos.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const proyectos = Array.isArray(data.proyectos) ? data.proyectos : [];

      // Extraer y deduplicar artículos vinculados a los proyectos
      const titulosVistos = new Set();
      todosArticulos = [];

      proyectos.forEach(p => {
        if (Array.isArray(p.publicaciones)) {
          p.publicaciones.forEach(pub => {
            const titulo = (pub.titulo || '').trim();
            const tituloKey = titulo.toLowerCase();
            if (titulo && !titulosVistos.has(tituloKey)) {
              titulosVistos.add(tituloKey);
              todosArticulos.push({
                titulo: titulo,
                anio: pub.anio || '',
                revista: pub.revista || 'Publicación Científica Indexada',
                url: pub.url || '#'
              });
            }
          });
        }
      });

      // Ordenar por año descendente; ante igualdad, alfabéticamente por título
      todosArticulos.sort((a, b) => {
        const anioA = parseInt(a.anio, 10) || 0;
        const anioB = parseInt(b.anio, 10) || 0;
        if (anioB !== anioA) return anioB - anioA;
        return a.titulo.localeCompare(b.titulo);
      });

      // Actualizar contador del Hero
      if (totalStatEl) {
        totalStatEl.textContent = todosArticulos.length;
      }

      // Inicializar lista filtrada
      articulosFiltrados = [...todosArticulos];

      // Configurar listeners
      configurarListeners();

      // Renderizar vista inicial
      renderArticulos();

    } catch (err) {
      console.error('Error al cargar artículos:', err);
      if (listEl) {
        listEl.innerHTML = `<li class="articulos-empty"><p>Ocurrió un error al cargar los artículos científicos. Por favor, intenta de nuevo más tarde.</p></li>`;
      }
    }
  }

  /**
   * Configura los oyentes de eventos de búsqueda y paginación
   */
  function configurarListeners() {
    // Búsqueda en tiempo real
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (searchClearBtn) {
          searchClearBtn.hidden = !query;
        }
        aplicarFiltro(query);
      });
    }

    // Botón borrar búsqueda
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchClearBtn.hidden = true;
          searchInput.focus();
        }
        aplicarFiltro('');
      });
    }

    // Botón borrar en estado vacío
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          if (searchClearBtn) searchClearBtn.hidden = true;
        }
        aplicarFiltro('');
      });
    }

    // Selector de artículos por página (6, 9, 12)
    if (perPageSelect) {
      perPageSelect.addEventListener('change', (e) => {
        itemsPorPagina = parseInt(e.target.value, 10) || 6;
        paginaActual = 1;
        renderArticulos();
      });
    }
  }

  /**
   * Filtra los artículos por término de búsqueda (título, revista o año)
   */
  function aplicarFiltro(query) {
    if (!query) {
      articulosFiltrados = [...todosArticulos];
    } else {
      articulosFiltrados = todosArticulos.filter(art => {
        const tituloMatch = art.titulo.toLowerCase().includes(query);
        const revistaMatch = art.revista.toLowerCase().includes(query);
        const anioMatch = String(art.anio).includes(query);
        return tituloMatch || revistaMatch || anioMatch;
      });
    }

    paginaActual = 1;
    renderArticulos();
  }

  /**
   * Renderiza la lista paginada y los controles de paginación
   */
  function renderArticulos() {
    if (!listEl) return;

    const total = articulosFiltrados.length;
    if (countEl) countEl.textContent = total;

    // Estado vacío
    if (total === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (paginationBar) paginationBar.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    // Cálculos de paginación
    const totalPaginas = Math.ceil(total / itemsPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    if (paginaActual < 1) paginaActual = 1;

    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = Math.min(inicio + itemsPorPagina, total);
    const articulosPagina = articulosFiltrados.slice(inicio, fin);

    // Renderizar items con formato homologado: > a la izquierda, título con ↗, año - revista abajo
    listEl.innerHTML = articulosPagina.map((art, idx) => {
      const delay = idx * 30;
      const metaSubtexto = [art.anio, art.revista].filter(Boolean).join(' &mdash; ');

      return `
        <li class="articulos-item" style="animation-delay: ${delay}ms;">
          <span class="articulos-bullet" aria-hidden="true">
            <i class="fa-solid fa-chevron-right"></i>
          </span>
          <div class="articulos-content">
            <a href="${escapeAttr(art.url)}" target="_blank" rel="noopener noreferrer" class="articulos-link">
              ${escapeHTML(art.titulo)}
              <i class="fa-solid fa-arrow-up-right-from-square articulos-ext-icon" aria-hidden="true"></i>
            </a>
            <span class="articulos-meta">${metaSubtexto}</span>
          </div>
        </li>
      `;
    }).join('');

    // Renderizar barra de paginación
    renderControlesPaginacion(totalPaginas, total, inicio, fin);
  }

  /**
   * Renderiza los botones de paginación con elipsis dinámica
   */
  function renderControlesPaginacion(totalPaginas, totalArticulos, inicio, fin) {
    if (!paginationBar) return;

    if (totalPaginas <= 1) {
      paginationBar.innerHTML = `<span class="proy-pag-info">Mostrando ${totalArticulos} artículo${totalArticulos !== 1 ? 's' : ''}</span>`;
      return;
    }

    const itemsPaginacion = obtenerRangoPaginacion(totalPaginas, paginaActual);
    let botonesPaginas = '';

    itemsPaginacion.forEach(item => {
      if (item === '...') {
        botonesPaginas += `<span class="proy-pag-ellipsis" aria-hidden="true">&hellip;</span>`;
      } else {
        const activeClass = item === paginaActual ? 'active' : '';
        botonesPaginas += `<button type="button" class="proy-pag-btn proy-pag-num ${activeClass}" data-page="${item}" aria-label="Página ${item}">${item}</button>`;
      }
    });

    paginationBar.innerHTML = `
      <span class="proy-pag-info">Mostrando ${inicio + 1} - ${fin} de ${totalArticulos} artículos</span>
      <div class="proy-pag-controls">
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-prev" ${paginaActual === 1 ? 'disabled' : ''} aria-label="Página anterior">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="proy-pag-numbers">
          ${botonesPaginas}
        </div>
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-next" ${paginaActual === totalPaginas ? 'disabled' : ''} aria-label="Página siguiente">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    `;

    // Listeners de paginación
    paginationBar.querySelector('.proy-pag-prev')?.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderArticulos();
        desplazarHaciaLista();
      }
    });

    paginationBar.querySelector('.proy-pag-next')?.addEventListener('click', () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        renderArticulos();
        desplazarHaciaLista();
      }
    });

    paginationBar.querySelectorAll('.proy-pag-num').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p && p !== paginaActual) {
          paginaActual = p;
          renderArticulos();
          desplazarHaciaLista();
        }
      });
    });
  }

  /**
   * Scroll suave al inicio de la lista
   */
  function desplazarHaciaLista() {
    const contenedor = document.querySelector('.articulos-card-container');
    if (contenedor) {
      contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Genera el rango de números con elipsis para la paginación
   */
  function obtenerRangoPaginacion(totalPaginas, actual) {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }
    if (actual <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPaginas];
    }
    if (actual >= totalPaginas - 3) {
      return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }
    return [1, '...', actual - 1, actual, actual + 1, '...', totalPaginas];
  }

  /**
   * Sanitización básica para evitar inyecciones XSS
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    if (!str) return '#';
    return String(str).replace(/"/g, '&quot;');
  }

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticulos);
  } else {
    initArticulos();
  }
})();

