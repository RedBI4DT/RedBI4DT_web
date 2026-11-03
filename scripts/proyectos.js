/**
 * scripts/proyectos.js
 * Catálogo completo de proyectos con buscador en tiempo real, filtros compactos
 * (Línea de Investigación y Estado) y footer con instituciones participantes.
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
  'informatica-biomedica': 'Informática Biomédica y Salud Digital',
  'ia-salud': 'Inteligencia Artificial en Salud',
  'interoperabilidad': 'Interoperabilidad y Gobernanza',
  'analitica-datos': 'Visualización y Analítica de Datos',
  'sociotecnica-adopcion': 'Evaluación Sociotécnica y Adopción',
  'salud-digital': 'Salud Digital'
};

let todosProyectos = [];

const estadoFiltros = {
  busqueda: '',
  area: 'todos',
  estado: 'todos'
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const response = await fetch(`${base}assets/data/proyectos.json`);
    if (!response.ok) throw new Error('No se pudo cargar proyectos.json');
    const data = await response.json();
    todosProyectos = data.proyectos || [];

    // Actualizar stat total del hero
    const statEl = document.getElementById('stat-total');
    if (statEl) statEl.textContent = todosProyectos.length;

    // Detectar filtro inicial desde la URL (ej. ?linea=ia-salud o ?filtro=ia-salud o ?area=ia-salud)
    const params = new URLSearchParams(window.location.search);
    const areaParam = params.get('linea') || params.get('filtro') || params.get('area');
    if (areaParam && AREA_LABELS[areaParam]) {
      estadoFiltros.area = areaParam;
      const selectArea = document.getElementById('filtro-select-area');
      if (selectArea) selectArea.value = areaParam;
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

  // Cambios en los selects compactos
  if (selectArea) {
    selectArea.addEventListener('change', (e) => {
      estadoFiltros.area = e.target.value;
      aplicarFiltros();
    });
  }

  if (selectEstado) {
    selectEstado.addEventListener('change', (e) => {
      estadoFiltros.estado = e.target.value;
      aplicarFiltros();
    });
  }

  // Botón limpiar filtros (tacho 36x36)
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
  estadoFiltros.area = 'todos';
  estadoFiltros.estado = 'todos';

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

  const filtrados = todosProyectos.filter(p => {
    // 1. Búsqueda de texto libre
    if (q) {
      const inTitulo = (p.titulo || '').toLowerCase().includes(q);
      const inDesc = (p.descripcion || '').toLowerCase().includes(q);
      const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
      const inInst = (p.instituciones || []).some(inst => inst.toLowerCase().includes(q));
      const inPaises = (p.paises || []).some(pais => pais.toLowerCase().includes(q));
      if (!inTitulo && !inDesc && !inTags && !inInst && !inPaises) {
        return false;
      }
    }

    // 2. Línea de Investigación
    if (estadoFiltros.area !== 'todos') {
      if (p.area_id !== estadoFiltros.area) {
        return false;
      }
    }

    // 3. Estado
    if (estadoFiltros.estado !== 'todos' && p.estado !== estadoFiltros.estado) {
      return false;
    }

    return true;
  });

  renderProyectos(filtrados);
  actualizarChipsYBadges();
}

function actualizarChipsYBadges() {
  const chipsContainer = document.getElementById('proyectos-active-chips');
  const btnResetAll = document.getElementById('btn-reset-all');
  const selectArea = document.getElementById('filtro-select-area');
  const selectEstado = document.getElementById('filtro-select-estado');

  // Resaltar borde del select con valor activo
  if (selectArea) {
    selectArea.classList.toggle('is-active', estadoFiltros.area !== 'todos');
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

  if (estadoFiltros.area !== 'todos') {
    chips.push({
      tipo: 'area',
      label: AREA_LABELS[estadoFiltros.area] || estadoFiltros.area,
      icono: 'fa-layer-group'
    });
  }

  if (estadoFiltros.estado !== 'todos') {
    chips.push({
      tipo: 'estado',
      label: estadoFiltros.estado,
      icono: 'fa-clock-rotate-left'
    });
  }

  // El botón tacho se deshabilita cuando no hay nada que limpiar
  if (btnResetAll) {
    btnResetAll.disabled = (chips.length === 0);
  }

  // Renderizar chips de filtros activos
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
          <button type="button" class="proy-chip-btn" data-tipo="${chip.tipo}" aria-label="Eliminar filtro ${chip.label}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `).join('');

      // Eventos para eliminar chips individuales
      chipsContainer.querySelectorAll('.proy-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          eliminarFiltro(btn.dataset.tipo);
        });
      });
    }
  }
}

function eliminarFiltro(tipo) {
  if (tipo === 'busqueda') {
    estadoFiltros.busqueda = '';
    const inputSearch = document.getElementById('proyectos-search-input');
    if (inputSearch) inputSearch.value = '';
    const btnClearSearch = document.getElementById('proyectos-search-clear');
    if (btnClearSearch) btnClearSearch.hidden = true;
  } else if (tipo === 'area') {
    estadoFiltros.area = 'todos';
    const selectArea = document.getElementById('filtro-select-area');
    if (selectArea) selectArea.value = 'todos';
  } else if (tipo === 'estado') {
    estadoFiltros.estado = 'todos';
    const selectEstado = document.getElementById('filtro-select-estado');
    if (selectEstado) selectEstado.value = 'todos';
  }

  aplicarFiltros();
}

function renderProyectos(proyectos) {
  const grid = document.getElementById('proyectos-grid');
  const emptyEl = document.getElementById('proyectos-empty');
  const countEl = document.getElementById('proyectos-count');

  if (!grid) return;

  if (countEl) countEl.textContent = proyectos.length;

  if (proyectos.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) {
      emptyEl.removeAttribute('hidden');
      emptyEl.style.display = 'flex';
    }
    return;
  }

  if (emptyEl) {
    emptyEl.setAttribute('hidden', '');
    emptyEl.style.display = 'none';
  }

  grid.innerHTML = proyectos.map((p, index) => {
    const estadoClass = p.estado === 'Concluido'
      ? 'proy-estado--concluido'
      : 'proy-estado--activo';
    const estadoLabel = p.estado || 'En curso';
    const delay = (index % 9) * 40;
    const textoResumen = p.resumen || p.descripcion || '';

    return `
      <a href="proyecto-detalle.html?id=${p.id}" class="proy-card" style="animation-delay:${delay}ms;">
        <div class="proy-meta">
          <span class="proy-anio">${p.anio || ''}</span>
          <span class="proy-estado ${estadoClass}">${estadoLabel}</span>
        </div>
        <h3 class="proy-titulo">${p.titulo}</h3>
        <p class="proy-desc">${textoResumen}</p>
        <div class="proy-footer-linea">
          <span class="proy-area-badge">${p.area_nombre || ''}</span>
        </div>
      </a>`;
  }).join('');
}
