/**
 * scripts/proyectos.js
 * Catálogo completo de proyectos con trazabilidad hacia investigadores y líneas de investigación
 */

const COLOR_MAP = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald'
};

let todosProyectos = [];
let filtroActivo = 'todos';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const response = await fetch(`${base}assets/data/proyectos.json`);
    if (!response.ok) throw new Error('No se pudo cargar proyectos.json');
    const data = await response.json();
    todosProyectos = data.proyectos || [];

    // Actualizar stat total
    const statEl = document.getElementById('stat-total');
    if (statEl) statEl.textContent = todosProyectos.length;

    // Detectar filtro inicial desde la URL (ej. ?filtro=ia-salud)
    const params = new URLSearchParams(window.location.search);
    const filtroParam = params.get('filtro');
    if (filtroParam && (filtroParam === 'informatica-biomedica' || filtroParam === 'ia-salud' || filtroParam === 'interoperabilidad')) {
      filtroActivo = filtroParam;
    }

    initFiltros();

    const iniciales = filtroActivo === 'todos'
      ? todosProyectos
      : todosProyectos.filter(p => p.area_id === filtroActivo);

    renderProyectos(iniciales);

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

function initFiltros() {
  const botones = document.querySelectorAll('.proyectos-filtro-btn');
  botones.forEach(btn => {
    const filtro = btn.dataset.filtro;
    if (filtro === filtroActivo) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }

    btn.addEventListener('click', () => {
      const nuevoFiltro = btn.dataset.filtro;
      if (nuevoFiltro === filtroActivo) return;

      filtroActivo = nuevoFiltro;

      botones.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filtrados = filtroActivo === 'todos'
        ? todosProyectos
        : todosProyectos.filter(p => p.area_id === filtroActivo);

      renderProyectos(filtrados);
    });
  });

  // Botón "Ver todos" del estado vacío
  const resetBtn = document.getElementById('proyectos-empty-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const todosBtn = document.querySelector('[data-filtro="todos"]');
      if (todosBtn) todosBtn.click();
    });
  }
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
    const tags = (p.tags || []).slice(0, 4).map(t =>
      `<span class="proy-tag">${t}</span>`
    ).join('');
    const instituciones = (p.instituciones || []).slice(0, 2).join('<br>');
    const delay = (index % 9) * 40;

    const linkInvestigador = p.investigador_principal
      ? `<a href="investigacion.html?id=${p.investigador_principal}&cat=${p.categoria_miembro || 'investigadores'}" class="proy-investigador-link" title="Ver perfil de ${p.investigador_nombre}">
          ${p.investigador_nombre || ''}
        </a>`
      : `<span class="proy-investigador-nombre">${p.investigador_nombre || ''}</span>`;

    return `
      <article class="proy-card" data-area="${p.area_id}" style="animation-delay:${delay}ms;">
        <div class="proy-meta">
          <span class="proy-anio">${p.anio || ''}</span>
          <span class="proy-estado ${estadoClass}">${estadoLabel}</span>
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
          <i class="fa-solid fa-user-tie proy-footer-icon"></i>
          <div class="proy-footer-info">
            ${linkInvestigador}
            <span class="proy-instituciones">${instituciones}</span>
          </div>
        </div>
      </article>`;
  }).join('');
}
