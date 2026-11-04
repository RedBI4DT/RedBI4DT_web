/**
 * scripts/area.js
 * Carga dinámica del detalle de Eje Científico (Área)
 * Trazabilidad completa con:
 * - Investigadores relacionados (assets/data/miembros.json)
 * - Proyectos relacionados (assets/data/proyectos.json)
 */

const COLORES = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald',
  'analitica-datos': 'violet',
  'sociotecnica-adopcion': 'rose',
  'salud-digital': 'sky'
};

const MAPA_LINEAS_A_AREAS = {
  'informática biomédica y salud digital': 'informatica-biomedica',
  'informática biomédica': 'informatica-biomedica',
  'informatica biomedica': 'informatica-biomedica',
  'sistemas de información en salud': 'informatica-biomedica',
  'sistemas de informacion en salud': 'informatica-biomedica',
  'estándares clínicos': 'informatica-biomedica',
  'estandares clinicos': 'informatica-biomedica',
  'telemedicina': 'salud-digital',
  'ontologías biomédicas': 'informatica-biomedica',
  'ontologias biomedicas': 'informatica-biomedica',
  'software biomédico': 'informatica-biomedica',
  'software biomedico': 'informatica-biomedica',
  'inteligencia artificial en salud': 'ia-salud',
  'inteligencia artificial': 'ia-salud',
  'procesamiento de lenguaje natural': 'ia-salud',
  'visión computacional': 'ia-salud',
  'vision computacional': 'ia-salud',
  'bioinformática': 'ia-salud',
  'bioinformática clínica': 'analitica-datos',
  'bioinformática computacional': 'ia-salud',
  'genómica computacional': 'ia-salud',
  'interoperabilidad y gobernanza de datos': 'interoperabilidad',
  'interoperabilidad clínica (hl7 fhir)': 'interoperabilidad',
  'interoperabilidad': 'interoperabilidad',
  'gobernanza': 'interoperabilidad',
  'visualización y analítica de datos': 'analitica-datos',
  'visualizacion y analitica de datos': 'analitica-datos',
  'analítica de datos': 'analitica-datos',
  'bioestadística': 'analitica-datos',
  'epidemiología matemática': 'analitica-datos',
  'evaluación sociotécnica y adopción': 'sociotecnica-adopcion',
  'evaluacion sociotecnica y adopcion': 'sociotecnica-adopcion',
  'gestión de proyectos de i+d': 'sociotecnica-adopcion',
  'sector productivo': 'sociotecnica-adopcion',
  'políticas de salud digital': 'sociotecnica-adopcion',
  'salud digital': 'salud-digital',
  'salud global y epidemiología digital': 'salud-digital',
  'epidemiología digital': 'salud-digital'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarError('No se especificó un eje científico.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';

    const [areasRes, proyectosRes, miembrosRes] = await Promise.all([
      fetch(`${base}assets/data/areas.json`),
      fetch(`${base}assets/data/proyectos.json`),
      fetch(`${base}assets/data/miembros.json`)
    ]);

    if (!areasRes.ok) throw new Error('Error al cargar areas.json');

    const areasData = await areasRes.json();
    const proyectosData = proyectosRes.ok ? await proyectosRes.json() : { proyectos: [] };
    const miembrosData = miembrosRes.ok ? await miembrosRes.json() : { investigadores: [], gestion: [] };

    const area = areasData.areas.find(a => a.id === id);
    if (!area) {
      mostrarError('Eje científico no encontrado.');
      return;
    }

    const todosProyectos = proyectosData.proyectos || [];
    const proyectosRelacionados = todosProyectos.filter(p =>
      p.area_id === area.id || (area.proyectos_ids && area.proyectos_ids.includes(p.id))
    );

    // Obtener todos los integrantes vinculados
    const todosMiembros = [
      ...(miembrosData.investigadores || []).map(m => ({ ...m, categoria: 'investigadores' })),
      ...(miembrosData.gestion || []).map(m => ({ ...m, categoria: 'gestion' })),
      ...(miembrosData.estudiantes || []).map(m => ({ ...m, categoria: 'estudiantes' }))
    ];

    const idsParticipantesEnProyectos = new Set();
    proyectosRelacionados.forEach(p => {
      if (Array.isArray(p.integrantes)) {
        p.integrantes.forEach(id => idsParticipantesEnProyectos.add(id));
      }
    });

    const investigadoresDelArea = todosMiembros.filter(m => {
      // 1. Si lidera o participa en un proyecto de esta área
      if (idsParticipantesEnProyectos.has(m.id)) return true;

      // 2. Si alguna de sus líneas de investigación mapea a esta área
      if (m.lineas && Array.isArray(m.lineas)) {
        return m.lineas.some(l => {
          const lNorm = (l || '').toLowerCase().trim();
          return MAPA_LINEAS_A_AREAS[lNorm] === area.id;
        });
      }

      return false;
    });

    renderArea(area, proyectosRelacionados, investigadoresDelArea);

  } catch (err) {
    console.error('Error cargando área:', err);
    mostrarError('Ocurrió un error al cargar la información del eje científico.');
  }
});

function renderArea(area, proyectos, investigadores) {
  const color = COLORES[area.id] || 'gold';

  // Título de la pestaña
  document.title = `${area.nombre} - Eje Científico | Red BI4DT`;

  // Número, Nombre y Descripción
  setHtml('area-hero-numero', area.numero);
  setHtml('area-hero-nombre', area.nombre);
  setHtml('area-hero-desc', area.descripcion_larga);

  // 1. Renderizar Investigadores del Área
  renderInvestigadores(investigadores, color);

  // 2. Inicializar Paginación y Renderizado de Proyectos Relacionados (Vista en Lista Limpia)
  inicializarPaginacionProyectos(proyectos, area.id);
}

function renderInvestigadores(investigadores, color) {
  const grid = document.getElementById('area-investigadores-grid');
  if (!grid) return;

  if (!investigadores || investigadores.length === 0) {
    grid.innerHTML = '<p style="color:#64748b; font-style:italic; grid-column:1/-1;">No hay investigadores registrados directamente en esta línea.</p>';
    return;
  }

  grid.innerHTML = investigadores.map(m => {
    const foto = m.foto || '../assets/images/Imagen_1.jpg';
    const linkPerfil = m.categoria === 'estudiantes'
      ? `estudiante.html?id=${m.id}`
      : `investigacion.html?id=${m.id}&cat=${m.categoria || 'investigadores'}`;
    return `
      <article class="area-investigador-card">
        <div class="area-inv-foto-container">
          <img src="${foto}" class="area-inv-img">
          <div class="area-inv-img-overlay"></div>
        </div>
        <div class="area-inv-info">
          <a href="${linkPerfil}" class="area-inv-nombre" title="Ver perfil de ${m.nombre}">
            ${m.nombre}
          </a>
          <span class="area-inv-institucion">${m.institucion || ''}</span>
          <a href="${linkPerfil}" class="area-inv-link-perfil">
            <span>Ver perfil completo</span>
            <i class="fa-solid fa-arrow-right" style="font-size:0.7rem;"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/* ==========================================================================
   SISTEMA DE PAGINACIÓN DINÁMICA - LISTA DE PROYECTOS EN ÁREA
   ========================================================================== */

let proyectosAreaActual = [];
let paginaActualProy = 1;
let itemsPorPaginaProy = 5;

function inicializarPaginacionProyectos(proyectos, areaId) {
  proyectosAreaActual = proyectos || [];
  paginaActualProy = 1;

  const selectPerPage = document.getElementById('area-proy-per-page');
  if (selectPerPage) {
    itemsPorPaginaProy = parseInt(selectPerPage.value, 10) || 5;
    selectPerPage.onchange = (e) => {
      itemsPorPaginaProy = parseInt(e.target.value, 10) || 5;
      paginaActualProy = 1;
      renderizarListaProyectos();
    };
  }

  const badgeTotal = document.getElementById('area-proyectos-total-badge');
  if (badgeTotal) {
    badgeTotal.textContent = `(${proyectosAreaActual.length})`;
  }

  const verTodosLink = document.getElementById('area-ver-todos-proy-link');
  if (verTodosLink && areaId) {
    verTodosLink.href = `proyectos.html?linea=${areaId}`;
  }

  renderizarListaProyectos();
}

function renderizarListaProyectos() {
  const contenedor = document.getElementById('area-proyectos-list');
  const paginationBar = document.getElementById('area-proyectos-pagination');
  if (!contenedor) return;

  if (proyectosAreaActual.length === 0) {
    contenedor.innerHTML = '<p class="perfil-empty" style="padding: 2.5rem; text-align: center; color: #64748b; font-style: italic;">Sin proyectos registrados actualmente en este eje científico.</p>';
    if (paginationBar) paginationBar.innerHTML = '';
    return;
  }

  const totalProyectos = proyectosAreaActual.length;
  const totalPaginas = Math.ceil(totalProyectos / itemsPorPaginaProy);

  if (paginaActualProy > totalPaginas) paginaActualProy = totalPaginas;
  if (paginaActualProy < 1) paginaActualProy = 1;

  const inicio = (paginaActualProy - 1) * itemsPorPaginaProy;
  const fin = Math.min(inicio + itemsPorPaginaProy, totalProyectos);
  const proyectosPagina = proyectosAreaActual.slice(inicio, fin);

  // Renderizar filas limpias: Nombre - Año de inicio solamente - Estado - Flecha
  contenedor.innerHTML = proyectosPagina.map(p => {
    const anioInicio = p.anio_inicio || (p.anio ? p.anio.split('–')[0].split('-')[0].trim() : '—');
    const estadoClass = p.estado === 'Concluido' ? 'proy-estado--concluido' : 'proy-estado--activo';

    return `
      <a href="proyecto-detalle.html?id=${p.id}" class="perfil-proy-row">
        <span class="proy-row-title">${p.titulo}</span>
        <span class="proy-row-anio">${anioInicio}</span>
        <span class="proy-row-estado ${estadoClass}">${p.estado || 'En curso'}</span>
        <span class="proy-row-arrow"><i class="fa-solid fa-arrow-right"></i></span>
      </a>
    `;
  }).join('');

  // Renderizar controles de paginación
  if (paginationBar) {
    if (totalPaginas <= 1) {
      paginationBar.innerHTML = `<span class="proy-pag-info">Mostrando ${totalProyectos} proyecto${totalProyectos !== 1 ? 's' : ''}</span>`;
      return;
    }

    const itemsPaginacion = obtenerRangoPaginacion(totalPaginas, paginaActualProy);
    let botonesPaginas = '';
    itemsPaginacion.forEach(item => {
      if (item === '...') {
        botonesPaginas += `<span class="proy-pag-ellipsis" aria-hidden="true">&hellip;</span>`;
      } else {
        const activeClass = item === paginaActualProy ? 'active' : '';
        botonesPaginas += `<button type="button" class="proy-pag-btn proy-pag-num ${activeClass}" data-page="${item}" aria-label="Página ${item}">${item}</button>`;
      }
    });

    paginationBar.innerHTML = `
      <span class="proy-pag-info">Mostrando ${inicio + 1} - ${fin} de ${totalProyectos} proyectos</span>
      <div class="proy-pag-controls">
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-prev" ${paginaActualProy === 1 ? 'disabled' : ''} aria-label="Página anterior">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="proy-pag-numbers">
          ${botonesPaginas}
        </div>
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-next" ${paginaActualProy === totalPaginas ? 'disabled' : ''} aria-label="Página siguiente">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    `;

    // Event listeners
    paginationBar.querySelector('.proy-pag-prev')?.addEventListener('click', () => {
      if (paginaActualProy > 1) {
        paginaActualProy--;
        renderizarListaProyectos();
      }
    });

    paginationBar.querySelector('.proy-pag-next')?.addEventListener('click', () => {
      if (paginaActualProy < totalPaginas) {
        paginaActualProy++;
        renderizarListaProyectos();
      }
    });

    paginationBar.querySelectorAll('.proy-pag-num').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p && p !== paginaActualProy) {
          paginaActualProy = p;
          renderizarListaProyectos();
        }
      });
    });
  }
}

/**
 * Genera el rango de números y elipsis para la paginación dinámica adaptada a móvil.
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

  if (actual <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPaginas];
  }

  if (actual >= totalPaginas - 3) {
    return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
  }

  return [1, '...', actual - 1, actual, actual + 1, '...', totalPaginas];
}

let resizeTimerArea;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimerArea);
  resizeTimerArea = setTimeout(() => {
    if (typeof renderizarListaProyectos === 'function') {
      renderizarListaProyectos();
    }
  }, 150);
});

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html || '';
}

function mostrarError(mensaje) {
  const main = document.getElementById('area-main');
  if (main) {
    main.innerHTML = `
      <section style="text-align:center; padding: 6rem 2rem; color: #94a3b8; background: #0f172a; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1.5rem;"></i>
        <h1 style="font-size: 2rem; color: #ffffff; margin-bottom: 1rem;">${mensaje}</h1>
        <p style="margin-bottom: 2rem;">El eje científico solicitado no existe o no pudo cargarse.</p>
        <a href="../index.html#lineas-investigacion" class="btn-banner btn-gold" style="display:inline-flex;">
          <i class="fa-solid fa-arrow-left"></i> Volver a Líneas de Investigación
        </a>
      </section>
    `;
  }
}
