/**
 * scripts/area.js
 * Carga dinamica de la pagina de detalle de un Eje Cientifico (Area)
 * Parametro de URL: ?id=<area_id>  (ej: ?id=informatica-biomedica)
 */

const COLORES = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarError('No se especifico un eje cientifico.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';

    const [areasRes, proyectosRes] = await Promise.all([
      fetch(`${base}assets/data/areas.json`),
      fetch(`${base}assets/data/proyectos.json`)
    ]);

    if (!areasRes.ok || !proyectosRes.ok) {
      throw new Error('Error al cargar los datos.');
    }

    const areasData = await areasRes.json();
    const proyectosData = await proyectosRes.json();

    const area = areasData.areas.find(a => a.id === id);
    if (!area) {
      mostrarError('Eje cientifico no encontrado.');
      return;
    }

    const proyectosRelacionados = proyectosData.proyectos.filter(p =>
      area.proyectos_ids.includes(p.id)
    );

    renderArea(area, proyectosRelacionados);

  } catch (err) {
    console.error('Error cargando area:', err);
    mostrarError('Ocurrio un error al cargar la informacion.');
  }
});

function renderArea(area, proyectos) {
  const color = COLORES[area.id] || 'gold';

  // Actualizar titulo de pestana
  document.title = `${area.nombre} - Red BI4DT`;

  // Numero
  setHtml('area-hero-numero', area.numero);

  // Nombre
  setHtml('area-hero-nombre', area.nombre);

  // Descripcion
  setHtml('area-hero-desc', area.descripcion_larga);

  // Temas / Badges
  const temasEl = document.getElementById('area-hero-temas');
  if (temasEl && area.temas) {
    temasEl.innerHTML = area.temas.map(tema =>
      `<span class="area-tema-badge" data-color="${color}">
        <i class="fa-solid fa-circle" style="font-size:0.4rem;opacity:0.7;"></i>
        ${tema}
      </span>`
    ).join('');
  }

  // Icono decorativo
  const iconEl = document.getElementById('area-hero-icon');
  if (iconEl) {
    iconEl.className = `fa-solid ${area.icono} area-hero-icon`;
  }

  // Color del label de proyectos
  const labelEl = document.getElementById('area-proyectos-label');
  const lineEl = document.getElementById('area-section-line');
  if (labelEl && lineEl) {
    const colorHex = area.color_acento;
    lineEl.style.background = colorHex;
    labelEl.style.color = colorHex;
  }

  // Link "ver todos" con color acento
  const verTodosLink = document.querySelector('.area-ver-todos-link');
  if (verTodosLink) {
    verTodosLink.style.color = area.color_acento;
  }

  // Proyectos
  const gridEl = document.getElementById('area-proyectos-grid');
  if (gridEl) {
    if (proyectos.length === 0) {
      gridEl.innerHTML = `
        <div class="area-proyectos-empty">
          <i class="fa-solid fa-folder-open"></i>
          <p>No hay proyectos registrados para esta area aun.</p>
        </div>`;
    } else {
      gridEl.innerHTML = proyectos.map(p => {
        const estadoClass = p.estado === 'Concluido'
          ? 'area-proyecto-estado--concluido'
          : 'area-proyecto-estado--activo';
        const estadoLabel = p.estado || 'En curso';
        const tags = (p.tags || []).slice(0, 4).map(t =>
          `<span class="area-proyecto-tag">${t}</span>`
        ).join('');
        const instituciones = (p.instituciones || []).join(', ');

        return `
          <article class="area-proyecto-card" data-color="${color}">
            <div class="area-proyecto-meta">
              <span class="area-proyecto-anio">${p.anio || ''}</span>
              <span class="area-proyecto-estado ${estadoClass}">${estadoLabel}</span>
            </div>
            <h3 class="area-proyecto-titulo">${p.titulo}</h3>
            <p class="area-proyecto-desc">${p.descripcion}</p>
            ${tags ? `<div class="area-proyecto-tags">${tags}</div>` : ''}
            <div class="area-proyecto-footer">
              <span class="area-proyecto-investigador-name">
                <i class="fa-solid fa-user-tie" style="font-size:0.75rem;opacity:0.6;margin-right:0.3rem;"></i>
                ${p.investigador_nombre || ''}
              </span>
            </div>
          </article>`;
      }).join('');
    }
  }
}

function setHtml(id, content) {
  const el = document.getElementById(id);
  if (el && content) el.textContent = content;
}

function mostrarError(msg) {
  const main = document.getElementById('area-main');
  if (main) {
    main.innerHTML = `
      <div class="area-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h2>Eje no encontrado</h2>
        <p>${msg}</p>
        <a href="../index.html#lineas-investigacion" class="area-error-btn">
          <i class="fa-solid fa-arrow-left"></i> Volver al inicio
        </a>
      </div>`;
  }
}
