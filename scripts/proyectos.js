/**
 * scripts/proyectos.js
 * Catálogo completo de proyectos con buscador en tiempo real, filtros compactos
 * (Línea de Investigación múltiple y Estado), soporte sin tag fijo y paginación (6, 9, 12).
 */

const COLOR_MAP = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald',
  'analitica-datos': 'violet',
  'sociotecnica-adopcion': 'rose',
  'salud-digital': 'sky'
};

const AREA_LABELS = {
  'informatica-biomedica': 'Informática Biomédica',
  'ia-salud': 'Inteligencia Artificial en Salud',
  'interoperabilidad': 'Interoperabilidad y Gobernanza',
  'analitica-datos': 'Visualización y Analítica de Datos',
  'sociotecnica-adopcion': 'Evaluación Sociotécnica y Adopción',
  'salud-digital': 'Salud Digital'
};

let todosProyectos = [];
let proyectosFiltrados = [];
let paginaActual = 1;
let itemsPorPagina = 6; // Opciones: 6, 9, 12

const estadoFiltros = {
  busqueda: '',
  areas: [],
  estado: 'todos',
  comboExacto: false
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const response = await fetch(`${base}assets/data/proyectos.json`);
    if (!response.ok) throw new Error('No se pudo cargar proyectos.json');
    const data = await response.json();
    todosProyectos = data.proyectos || [];

    // Actualizar stats del hero (Total y En curso)
    const statEl = document.getElementById('stat-total');
    if (statEl) statEl.textContent = todosProyectos.length;

    const enCursoCount = todosProyectos.filter(p => (p.estado || '').toLowerCase().trim() === 'en curso').length;
    const statEnCursoEl = document.getElementById('stat-en-curso');
    if (statEnCursoEl) statEnCursoEl.textContent = enCursoCount;

    // Renderizar gráfico de barras de distribución por línea
    renderGraficoDistribucion(todosProyectos);

    // Detectar filtro inicial desde la URL (soporte multilínea y proyectos similares)
    const params = new URLSearchParams(window.location.search);
    const lineasParam = params.get('lineas');
    const areaParam = params.get('linea') || params.get('filtro') || params.get('area');
    const comboParam = params.get('combo');

    if (comboParam === '1' || comboParam === 'true') {
      estadoFiltros.comboExacto = true;
    }

    if (lineasParam) {
      const arr = lineasParam.split(',').map(s => s.trim()).filter(s => AREA_LABELS[s]);
      if (arr.length > 0) {
        estadoFiltros.areas = arr;
      }
    } else if (areaParam && AREA_LABELS[areaParam]) {
      estadoFiltros.areas = [areaParam];
    }

    const selectArea = document.getElementById('filtro-select-area');
    if (selectArea && estadoFiltros.areas.length > 0) {
      selectArea.value = estadoFiltros.areas[estadoFiltros.areas.length - 1];
    }

    const estadoParam = params.get('estado');
    if (estadoParam && (estadoParam === 'En curso' || estadoParam === 'Concluido')) {
      estadoFiltros.estado = estadoParam;
      const selectEstado = document.getElementById('filtro-select-estado');
      if (selectEstado) selectEstado.value = estadoParam;
    }

    initEventosToolbar();
    aplicarFiltros();

  } catch (err) {
    console.error('Error cargando proyectos:', err);
    const grid = document.getElementById('proyectos-grid');
    if (grid) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#94a3b8;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;display:block;margin-bottom:1rem;color:#f59e0b;"></i>
        <p>Error al cargar los proyectos. Asegúrese de visualizar el sitio a través de un servidor HTTP local.</p>
      </div>`;
    }
  }
});

function initEventosToolbar() {
  const inputSearch = document.getElementById('proyectos-search-input');
  const btnClearSearch = document.getElementById('proyectos-search-clear');
  const btnResetAll = document.getElementById('btn-reset-all');
  const btnEmptyReset = document.getElementById('proyectos-empty-reset');

  const selectArea = document.getElementById('filtro-select-area');
  const selectEstado = document.getElementById('filtro-select-estado');
  const selectPerPage = document.getElementById('proy-per-page');

  // Selector de cantidad por página (6, 9, 12)
  if (selectPerPage) {
    itemsPorPagina = parseInt(selectPerPage.value, 10) || 6;
    selectPerPage.addEventListener('change', (e) => {
      itemsPorPagina = parseInt(e.target.value, 10) || 6;
      paginaActual = 1;
      renderProyectosPaginados();
    });
  }

  // Input de búsqueda
  if (inputSearch) {
    inputSearch.addEventListener('input', (e) => {
      estadoFiltros.busqueda = e.target.value.trim();
      if (btnClearSearch) {
        btnClearSearch.hidden = !e.target.value;
      }
      aplicarFiltros();
    });
  }

  // Botón limpiar texto de búsqueda
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (inputSearch) {
        inputSearch.value = '';
        inputSearch.focus();
      }
      estadoFiltros.busqueda = '';
      btnClearSearch.hidden = true;
      aplicarFiltros();
    });
  }

  // Cambios en los selects compactos (soporte multilínea acumulativo)
  if (selectArea) {
    selectArea.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'todos') {
        estadoFiltros.areas = [];
        estadoFiltros.comboExacto = false;
      } else {
        if (!estadoFiltros.areas.includes(val)) {
          estadoFiltros.areas.push(val);
        }
        if (estadoFiltros.areas.length > 1) {
          estadoFiltros.comboExacto = true;
        }
      }
      if (selectArea) {
        selectArea.value = estadoFiltros.areas.length > 0
          ? estadoFiltros.areas[estadoFiltros.areas.length - 1]
          : 'todos';
      }
      aplicarFiltros();
    });
  }

  if (selectEstado) {
    selectEstado.addEventListener('change', (e) => {
      estadoFiltros.estado = e.target.value;
      aplicarFiltros();
    });
  }

  // Botón limpiar filtros (tacho)
  if (btnResetAll) {
    btnResetAll.addEventListener('click', resetearFiltros);
  }

  // Botón en mensaje de resultados vacíos
  if (btnEmptyReset) {
    btnEmptyReset.addEventListener('click', resetearFiltros);
  }
}

function resetearFiltros() {
  estadoFiltros.busqueda = '';
  estadoFiltros.areas = [];
  estadoFiltros.estado = 'todos';
  estadoFiltros.comboExacto = false;

  const inputSearch = document.getElementById('proyectos-search-input');
  if (inputSearch) inputSearch.value = '';

  const btnClearSearch = document.getElementById('proyectos-search-clear');
  if (btnClearSearch) btnClearSearch.hidden = true;

  const selectArea = document.getElementById('filtro-select-area');
  if (selectArea) selectArea.value = 'todos';

  const selectEstado = document.getElementById('filtro-select-estado');
  if (selectEstado) selectEstado.value = 'todos';

  aplicarFiltros();
}

function aplicarFiltros() {
  const q = estadoFiltros.busqueda.toLowerCase();

  proyectosFiltrados = todosProyectos.filter(p => {
    // 1. Búsqueda de texto libre
    if (q) {
      const inTitulo = (p.titulo || '').toLowerCase().includes(q);
      const inDesc = (p.resumen || p.descripcion_larga || '').toLowerCase().includes(q);
      const inInst = (p.instituciones || []).some(inst => inst.toLowerCase().includes(q));
      if (!inTitulo && !inDesc && !inInst) {
        return false;
      }
    }

    // 2. Líneas de Investigación (soporte multilínea y combinación exacta)
    if (estadoFiltros.areas.length > 0) {
      const lineasProyecto = Array.isArray(p.lineas) && p.lineas.length > 0
        ? p.lineas
        : (p.area_id ? [p.area_id] : []);

      if (estadoFiltros.comboExacto && estadoFiltros.areas.length > 1) {
        // Misma combinación de líneas (debe coincidir con la combinación de líneas del proyecto)
        const coincideExacto = lineasProyecto.length === estadoFiltros.areas.length &&
          estadoFiltros.areas.every(a => lineasProyecto.includes(a));
        if (!coincideExacto) return false;
      } else {
        // Contiene todas las líneas seleccionadas
        const coincideTodas = estadoFiltros.areas.every(a => lineasProyecto.includes(a));
        if (!coincideTodas) return false;
      }
    }

    // 3. Estado
    if (estadoFiltros.estado !== 'todos' && p.estado !== estadoFiltros.estado) {
      return false;
    }

    return true;
  });

  paginaActual = 1; // Reinicia a página 1 al cambiar filtros o búsqueda
  renderProyectosPaginados();
  actualizarChipsYBadges();
}

function actualizarChipsYBadges() {
  const chipsContainer = document.getElementById('proyectos-active-chips');
  const btnResetAll = document.getElementById('btn-reset-all');
  const selectArea = document.getElementById('filtro-select-area');
  const selectEstado = document.getElementById('filtro-select-estado');

  if (selectArea) {
    selectArea.classList.toggle('is-active', estadoFiltros.areas.length > 0);
  }
  if (selectEstado) {
    selectEstado.classList.toggle('is-active', estadoFiltros.estado !== 'todos');
  }

  const chips = [];

  if (estadoFiltros.busqueda) {
    chips.push({
      tipo: 'busqueda',
      label: `"${estadoFiltros.busqueda}"`,
      icono: 'fa-magnifying-glass'
    });
  }

  if (estadoFiltros.areas.length > 0) {
    estadoFiltros.areas.forEach(areaId => {
      chips.push({
        tipo: 'area',
        id: areaId,
        label: AREA_LABELS[areaId] || areaId,
        icono: 'fa-layer-group'
      });
    });
  }

  if (estadoFiltros.estado !== 'todos') {
    chips.push({
      tipo: 'estado',
      label: estadoFiltros.estado,
      icono: 'fa-clock-rotate-left'
    });
  }

  if (btnResetAll) {
    btnResetAll.disabled = (chips.length === 0);
  }

  if (chipsContainer) {
    if (chips.length === 0) {
      chipsContainer.setAttribute('hidden', '');
      chipsContainer.innerHTML = '';
    } else {
      chipsContainer.removeAttribute('hidden');
      chipsContainer.innerHTML = chips.map(chip => `
        <span class="proy-chip">
          <i class="fa-solid ${chip.icono}" style="font-size:0.7rem; color:#64748b;"></i>
          <span>${chip.label}</span>
          <button type="button" class="proy-chip-btn" data-tipo="${chip.tipo}" ${chip.id ? `data-id="${chip.id}"` : ''} aria-label="Eliminar filtro ${chip.label}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `).join('');

      chipsContainer.querySelectorAll('.proy-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          eliminarFiltro(btn.dataset.tipo, btn.dataset.id);
        });
      });
    }
  }
}

function eliminarFiltro(tipo, id) {
  if (tipo === 'busqueda') {
    estadoFiltros.busqueda = '';
    const inputSearch = document.getElementById('proyectos-search-input');
    if (inputSearch) inputSearch.value = '';
    const btnClearSearch = document.getElementById('proyectos-search-clear');
    if (btnClearSearch) btnClearSearch.hidden = true;
  } else if (tipo === 'area') {
    if (id) {
      estadoFiltros.areas = estadoFiltros.areas.filter(a => a !== id);
    } else {
      estadoFiltros.areas = [];
    }
    estadoFiltros.comboExacto = false;
    const selectArea = document.getElementById('filtro-select-area');
    if (selectArea) {
      selectArea.value = estadoFiltros.areas.length > 0
        ? estadoFiltros.areas[estadoFiltros.areas.length - 1]
        : 'todos';
    }
  } else if (tipo === 'estado') {
    estadoFiltros.estado = 'todos';
    const selectEstado = document.getElementById('filtro-select-estado');
    if (selectEstado) selectEstado.value = 'todos';
  }

  aplicarFiltros();
}

function renderProyectosPaginados() {
  const grid = document.getElementById('proyectos-grid');
  const emptyEl = document.getElementById('proyectos-empty');
  const countEl = document.getElementById('proyectos-count');
  const paginationBar = document.getElementById('proyectos-pagination');

  if (!grid) return;

  const totalProyectos = proyectosFiltrados.length;
  if (countEl) countEl.textContent = totalProyectos;

  if (totalProyectos === 0) {
    grid.innerHTML = '';
    if (emptyEl) {
      emptyEl.removeAttribute('hidden');
      emptyEl.style.display = 'flex';
    }
    if (paginationBar) paginationBar.innerHTML = '';
    return;
  }

  if (emptyEl) {
    emptyEl.setAttribute('hidden', '');
    emptyEl.style.display = 'none';
  }

  const totalPaginas = Math.ceil(totalProyectos / itemsPorPagina);
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  if (paginaActual < 1) paginaActual = 1;

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = Math.min(inicio + itemsPorPagina, totalProyectos);
  const proyectosPagina = proyectosFiltrados.slice(inicio, fin);

  // Renderizar tarjetas de proyectos (limpias, sin tags de línea)
  grid.innerHTML = proyectosPagina.map((p, index) => {
    const estadoClass = p.estado === 'Concluido'
      ? 'proy-estado--concluido'
      : 'proy-estado--activo';
    const estadoLabel = p.estado || 'En curso';
    const delay = (index % itemsPorPagina) * 35;
    const textoResumen = p.resumen || '';
    const anioInicio = p.anio_inicio || (p.anio ? String(p.anio).split(/[-–—]/)[0].trim() : '');

    return `
      <a href="proyecto-detalle.html?id=${p.id}" class="proy-card" style="animation-delay:${delay}ms;">
        <div class="proy-meta">
          <span class="proy-anio">${anioInicio}</span>
          <span class="proy-estado ${estadoClass}">${estadoLabel}</span>
        </div>
        <h3 class="proy-titulo">${p.titulo}</h3>
        <p class="proy-desc">${textoResumen}</p>
      </a>`;
  }).join('');

  // Renderizar controles de paginación
  if (paginationBar) {
    if (totalPaginas <= 1) {
      paginationBar.innerHTML = `<span class="proy-pag-info">Mostrando ${totalProyectos} proyecto${totalProyectos !== 1 ? 's' : ''}</span>`;
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
      <span class="proy-pag-info">Mostrando ${inicio + 1} - ${fin} de ${totalProyectos} proyectos</span>
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

    // Event listeners en botones de paginación
    paginationBar.querySelector('.proy-pag-prev')?.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderProyectosPaginados();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    paginationBar.querySelector('.proy-pag-next')?.addEventListener('click', () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        renderProyectosPaginados();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    paginationBar.querySelectorAll('.proy-pag-num').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p && p !== paginaActual) {
          paginaActual = p;
          renderProyectosPaginados();
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}


/**
 * Genera el rango de números y elipsis para la paginación dinámica.
 */
function obtenerRangoPaginacion(totalPaginas, actual) {
  const esMovil = typeof window !== 'undefined' && window.innerWidth <= 640;

  if (esMovil) {
    if (totalPaginas <= 4) {
      const paginas = [];
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }
    if (actual <= 2) {
      return [1, 2, '...', totalPaginas];
    }
    if (actual >= totalPaginas - 1) {
      return [1, '...', totalPaginas - 1, totalPaginas];
    }
    return [1, '...', actual, '...', totalPaginas];
  }

  if (totalPaginas <= 7) {
    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    return paginas;
  }

  if (actual <= 3) {
    return [1, 2, 3, 4, '...', totalPaginas];
  }

  if (actual >= totalPaginas - 2) {
    return [1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
  }

  return [1, '...', actual - 1, actual, actual + 1, '...', totalPaginas];
}


/**
 * Renderiza el gráfico de barras horizontales de distribución por línea de investigación.
 * Color: Azul bien oscuro (#0a192f), sin efectos de hover (estático e informativo).
 */
function renderGraficoDistribucion(proyectos) {
  const chartContainer = document.getElementById('proyectos-hero-chart');
  if (!chartContainer) return;

  const AREA_DATA = [
    { id: 'analitica-datos', nombre: 'Visualización y Analítica de Datos' },
    { id: 'ia-salud', nombre: 'Inteligencia Artificial en Salud' },
    { id: 'salud-digital', nombre: 'Salud Digital' },
    { id: 'interoperabilidad', nombre: 'Interoperabilidad y Gobernanza' },
    { id: 'informatica-biomedica', nombre: 'Informática Biomédica' },
    { id: 'sociotecnica-adopcion', nombre: 'Evaluación Sociotécnica y Adopción' }
  ];

  const conteos = {};
  AREA_DATA.forEach(a => { conteos[a.id] = 0; });

  proyectos.forEach(p => {
    const lineas = Array.isArray(p.lineas) && p.lineas.length > 0
      ? p.lineas
      : (p.area_id ? [p.area_id] : []);
    lineas.forEach(id => {
      if (conteos[id] !== undefined) {
        conteos[id]++;
      }
    });
  });

  // Ordenar descendentemente por cantidad de proyectos
  const lineasOrdenadas = [...AREA_DATA].sort((a, b) => conteos[b.id] - conteos[a.id]);
  const maxConteo = Math.max(...Object.values(conteos), 1);

  chartContainer.innerHTML = lineasOrdenadas.map(area => {
    const total = conteos[area.id] || 0;
    const pct = Math.round((total / maxConteo) * 100);

    return `
      <div class="proy-chart-row">
        <div class="proy-chart-info">
          <span class="proy-chart-label">${area.nombre}</span>
          <span class="proy-chart-val">${total}</span>
        </div>
        <div class="proy-chart-track">
          <div class="proy-chart-bar" data-pct="${pct}" style="width: 0%;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Animación de aparición progresiva en escalera al acceder a la página
  setTimeout(() => {
    const bars = chartContainer.querySelectorAll('.proy-chart-bar');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = `${bar.dataset.pct}%`;
      }, index * 70);
    });
  }, 100);
}


let resizeTimerProy;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimerProy);
  resizeTimerProy = setTimeout(() => {
    if (typeof renderProyectosPaginados === 'function') {
      renderProyectosPaginados();
    }
  }, 150);
});
