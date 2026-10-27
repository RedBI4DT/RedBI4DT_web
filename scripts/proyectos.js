/**
 * scripts/proyectos.js
 * Catálogo completo de proyectos con buscador en tiempo real, filtros avanzados multifactoriales
 * (6 Líneas de Investigación, Países, Instituciones, Estado) y footer con instituciones participantes.
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
  pais: 'todos',
  institucion: 'todos',
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

    // Poblar dinámicamente el selector de instituciones
    poblarInstituciones();

    // Detectar filtros iniciales desde la URL (ej. ?filtro=ia-salud o ?area=ia-salud o ?pais=Ecuador)
    const params = new URLSearchParams(window.location.search);
    const areaParam = params.get('filtro') || params.get('area');
    if (areaParam && AREA_LABELS[areaParam]) {
      estadoFiltros.area = areaParam;
      const selectArea = document.getElementById('filtro-select-area');
      if (selectArea) selectArea.value = areaParam;
      abrirPanelFiltros();
    }

    const paisParam = params.get('pais');
    if (paisParam && (paisParam === 'Perú' || paisParam === 'Ecuador' || paisParam === 'Estados Unidos')) {
      estadoFiltros.pais = paisParam;
      const selectPais = document.getElementById('filtro-select-pais');
      if (selectPais) selectPais.value = paisParam;
      abrirPanelFiltros();
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

function poblarInstituciones() {
  const selectInst = document.getElementById('filtro-select-institucion');
  if (!selectInst) return;

  const setInst = new Set();
  todosProyectos.forEach(p => {
    (p.instituciones || []).forEach(inst => setInst.add(inst));
  });

  const ordenadas = Array.from(setInst).sort((a, b) => a.localeCompare(b, 'es'));
  ordenadas.forEach(inst => {
    const opt = document.createElement('option');
    opt.value = inst;
    opt.textContent = inst;
    selectInst.appendChild(opt);
  });
}

function abrirPanelFiltros() {
  const panel = document.getElementById('proyectos-filtros-panel');
  const btnToggle = document.getElementById('btn-toggle-filtros');
  if (panel && btnToggle) {
    panel.removeAttribute('hidden');
    btnToggle.classList.add('open');
    btnToggle.setAttribute('aria-expanded', 'true');
  }
}

function initEventosToolbar() {
  const inputSearch = document.getElementById('proyectos-search-input');
  const btnClearSearch = document.getElementById('proyectos-search-clear');
  const btnToggleFiltros = document.getElementById('btn-toggle-filtros');
  const panelFiltros = document.getElementById('proyectos-filtros-panel');
  const btnResetAll = document.getElementById('btn-reset-all');
  const btnEmptyReset = document.getElementById('proyectos-empty-reset');

  const selectArea = document.getElementById('filtro-select-area');
  const selectPais = document.getElementById('filtro-select-pais');
  const selectInst = document.getElementById('filtro-select-institucion');
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

  // Toggle de panel de filtros avanzados
  if (btnToggleFiltros && panelFiltros) {
    btnToggleFiltros.addEventListener('click', () => {
      const isOpen = !panelFiltros.hasAttribute('hidden');
      if (isOpen) {
        panelFiltros.setAttribute('hidden', '');
        btnToggleFiltros.classList.remove('open');
        btnToggleFiltros.setAttribute('aria-expanded', 'false');
      } else {
        panelFiltros.removeAttribute('hidden');
        btnToggleFiltros.classList.add('open');
        btnToggleFiltros.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Cambios en los selects
  if (selectArea) {
    selectArea.addEventListener('change', (e) => {
      estadoFiltros.area = e.target.value;
      aplicarFiltros();
    });
  }

  if (selectPais) {
    selectPais.addEventListener('change', (e) => {
      estadoFiltros.pais = e.target.value;
      aplicarFiltros();
    });
  }

  if (selectInst) {
    selectInst.addEventListener('change', (e) => {
      estadoFiltros.institucion = e.target.value;
      aplicarFiltros();
    });
  }

  if (selectEstado) {
    selectEstado.addEventListener('change', (e) => {
      estadoFiltros.estado = e.target.value;
      aplicarFiltros();
    });
  }

  // Botón limpiar todos los filtros
  if (btnResetAll) {
    btnResetAll.addEventListener('click', resetearFiltros);
  }

  if (btnEmptyReset) {
    btnEmptyReset.addEventListener('click', resetearFiltros);
  }
}

function resetearFiltros() {
  estadoFiltros.busqueda = '';
  estadoFiltros.area = 'todos';
  estadoFiltros.pais = 'todos';
  estadoFiltros.institucion = 'todos';
  estadoFiltros.estado = 'todos';

  const inputSearch = document.getElementById('proyectos-search-input');
  if (inputSearch) inputSearch.value = '';

  const btnClearSearch = document.getElementById('proyectos-search-clear');
  if (btnClearSearch) btnClearSearch.hidden = true;

  const selectArea = document.getElementById('filtro-select-area');
  if (selectArea) selectArea.value = 'todos';

  const selectPais = document.getElementById('filtro-select-pais');
  if (selectPais) selectPais.value = 'todos';

  const selectInst = document.getElementById('filtro-select-institucion');
  if (selectInst) selectInst.value = 'todos';

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

    // 2. Línea de Investigación (evalúa área principal o líneas secundarias)
    if (estadoFiltros.area !== 'todos') {
      const matchArea = p.area_id === estadoFiltros.area || (p.lineas && p.lineas.includes(estadoFiltros.area));
      if (!matchArea) {
        return false;
      }
    }

    // 3. País
    if (estadoFiltros.pais !== 'todos') {
      if (!p.paises || !p.paises.includes(estadoFiltros.pais)) {
        return false;
      }
    }

    // 4. Institución
    if (estadoFiltros.institucion !== 'todos') {
      if (!p.instituciones || !p.instituciones.includes(estadoFiltros.institucion)) {
        return false;
      }
    }

    // 5. Estado
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
  const badgeCount = document.getElementById('filtros-badge-count');
  const btnResetAll = document.getElementById('btn-reset-all');

  let filtrosContador = 0;
  const chips = [];

  if (estadoFiltros.busqueda) {
    filtrosContador++;
    chips.push({
      tipo: 'busqueda',
      label: `"${estadoFiltros.busqueda}"`,
      icono: 'fa-magnifying-glass'
    });
  }

  if (estadoFiltros.area !== 'todos') {
    filtrosContador++;
    chips.push({
      tipo: 'area',
      label: AREA_LABELS[estadoFiltros.area] || estadoFiltros.area,
      icono: 'fa-layer-group'
    });
  }

  if (estadoFiltros.pais !== 'todos') {
    filtrosContador++;
    chips.push({
      tipo: 'pais',
      label: estadoFiltros.pais,
      icono: 'fa-location-dot'
    });
  }

  if (estadoFiltros.institucion !== 'todos') {
    filtrosContador++;
    chips.push({
      tipo: 'institucion',
      label: estadoFiltros.institucion,
      icono: 'fa-building-columns'
    });
  }

  if (estadoFiltros.estado !== 'todos') {
    filtrosContador++;
    chips.push({
      tipo: 'estado',
      label: estadoFiltros.estado,
      icono: 'fa-clock-rotate-left'
    });
  }

  // Actualizar Badge en el botón de filtros
  if (badgeCount) {
    const filtrosEnPanel = (estadoFiltros.area !== 'todos' ? 1 : 0) +
      (estadoFiltros.pais !== 'todos' ? 1 : 0) +
      (estadoFiltros.institucion !== 'todos' ? 1 : 0) +
      (estadoFiltros.estado !== 'todos' ? 1 : 0);

    if (filtrosEnPanel > 0) {
      badgeCount.textContent = filtrosEnPanel;
      badgeCount.removeAttribute('hidden');
    } else {
      badgeCount.setAttribute('hidden', '');
    }
  }

  // Botón Limpiar general
  if (btnResetAll) {
    if (filtrosContador > 0) {
      btnResetAll.removeAttribute('hidden');
    } else {
      btnResetAll.setAttribute('hidden', '');
    }
  }

  // Renderizar chips
  if (chipsContainer) {
    if (chips.length === 0) {
      chipsContainer.setAttribute('hidden', '');
      chipsContainer.innerHTML = '';
    } else {
      chipsContainer.removeAttribute('hidden');
      chipsContainer.innerHTML = `
        <span style="font-size:0.75rem; color:#64748b; font-weight:600;">Filtros activos:</span>
        ${chips.map(chip => `
          <span class="proy-chip">
            <i class="fa-solid ${chip.icono}" style="font-size:0.7rem; color:#64748b;"></i>
            <span>${chip.label}</span>
            <button type="button" class="proy-chip-btn" data-tipo="${chip.tipo}" aria-label="Eliminar filtro">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </span>
        `).join('')}
        <button type="button" class="proy-chip-clear-all" id="btn-clear-all-chips">Limpiar todo</button>
      `;

      // Eventos para eliminar chips individuales
      chipsContainer.querySelectorAll('.proy-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tipo = btn.dataset.tipo;
          eliminarFiltro(tipo);
        });
      });

      const btnClearAllChips = document.getElementById('btn-clear-all-chips');
      if (btnClearAllChips) {
        btnClearAllChips.addEventListener('click', resetearFiltros);
      }
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
  } else if (tipo === 'pais') {
    estadoFiltros.pais = 'todos';
    const selectPais = document.getElementById('filtro-select-pais');
    if (selectPais) selectPais.value = 'todos';
  } else if (tipo === 'institucion') {
    estadoFiltros.institucion = 'todos';
    const selectInst = document.getElementById('filtro-select-institucion');
    if (selectInst) selectInst.value = 'todos';
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
    if (emptyEl) emptyEl.removeAttribute('hidden');
    return;
  }

  if (emptyEl) emptyEl.setAttribute('hidden', '');

  grid.innerHTML = proyectos.map((p, index) => {
    const color = COLOR_MAP[p.area_id] || 'gold';
    const estadoClass = p.estado === 'Concluido'
      ? 'proy-estado--concluido'
      : 'proy-estado--activo';
    const estadoLabel = p.estado || 'En curso';

    // Insignias de países limpias con icono
    const badgesPaises = (p.paises || []).map(pais => {
      return `<span class="proy-pais-badge"><i class="fa-solid fa-location-dot"></i> ${pais}</span>`;
    }).join('');

    const tags = (p.tags || []).slice(0, 4).map(t =>
      `<span class="proy-tag">${t}</span>`
    ).join('');

    const institucionesTexto = (p.instituciones || []).join(' · ');
    const delay = (index % 9) * 40;

    return `
      <article class="proy-card" data-area="${p.area_id}" style="animation-delay:${delay}ms;">
        <div class="proy-meta">
          <span class="proy-anio">${p.anio || ''}</span>
          <span class="proy-estado ${estadoClass}">${estadoLabel}</span>
          ${badgesPaises}
          <a href="area.html?id=${p.area_id}" class="proy-area-badge proy-area-badge--${color}" title="Ver eje científico">
            ${p.area_nombre || ''}
          </a>
        </div>
        <h3 class="proy-titulo">${p.titulo}</h3>
        <p class="proy-desc">${p.descripcion}</p>
        ${tags ? `<div class="proy-tags">${tags}</div>` : ''}
        <a href="area.html?id=${p.area_id}" class="proy-area-link">
          Ver línea de investigación <i class="fa-solid fa-arrow-right" style="font-size:0.7rem;"></i>
        </a>
        <div class="proy-footer">
          <i class="fa-solid fa-building-columns proy-footer-icon" title="Institución participante"></i>
          <span class="proy-footer-institucion">${institucionesTexto}</span>
        </div>
      </article>`;
  }).join('');
}
