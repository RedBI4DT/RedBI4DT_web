/**
 * scripts/investigacion.js
 * Carga dinámica del perfil de investigador/gestor con trazabilidad real hacia:
 * - Proyectos (assets/data/proyectos.json)
 * - Líneas / Ejes científicos (assets/data/areas.json / area.html)
 */

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
  'inteligencia artificial en salud': 'ia-salud',
  'inteligencia artificial': 'ia-salud',
  'procesamiento de lenguaje natural': 'ia-salud',
  'visión computacional': 'ia-salud',
  'vision computacional': 'ia-salud',
  'bioinformática': 'ia-salud',
  'bioinformática clínica': 'analitica-datos',
  'bioinformática computacional': 'ia-salud',
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
  'políticas de salud digital': 'sociotecnica-adopcion',
  'salud digital': 'salud-digital',
  'salud global y epidemiología digital': 'salud-digital',
  'epidemiología digital': 'salud-digital'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const categoria = params.get('cat') || 'investigadores'; // 'investigadores' o 'gestion'

  if (!id) {
    mostrarError('No se especificó un investigador.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const [miembrosRes, proyectosRes] = await Promise.all([
      fetch(`${base}assets/data/miembros.json`),
      fetch(`${base}assets/data/proyectos.json`)
    ]);

    if (!miembrosRes.ok) throw new Error('No se pudo cargar miembros.json');
    const datosMiembros = await miembrosRes.json();
    const datosProyectos = proyectosRes.ok ? await proyectosRes.json() : { proyectos: [] };

    // Buscar en la categoría indicada o en ambas
    let miembro = null;
    if (datosMiembros[categoria]) {
      miembro = datosMiembros[categoria].find(m => m.id === id);
    }
    if (!miembro) {
      miembro = [...(datosMiembros.investigadores || []), ...(datosMiembros.gestion || [])].find(m => m.id === id);
    }

    if (!miembro) {
      mostrarError('Investigador no encontrado.');
      return;
    }

    // Obtener proyectos asociados por ID o por integración directa
    const todosProyectos = datosProyectos.proyectos || [];
    const idsAsociados = Array.isArray(miembro.proyectos) ? miembro.proyectos : [];
    const proyectosDelInvestigador = todosProyectos.filter(p => {
      if (idsAsociados.includes(p.id)) return true;
      if (Array.isArray(p.integrantes) && p.integrantes.includes(miembro.id)) return true;
      return false;
    });

    renderPerfil(miembro, categoria, proyectosDelInvestigador);

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError('Ocurrió un error al cargar el perfil del investigador.');
  }
});

function renderPerfil(m, categoria, proyectosReales) {
  // Actualizar título del navegador
  document.title = `${m.nombre} - Perfil de Investigación | Red BI4DT`;

  // Etiqueta de categoría
  const labelEl = document.getElementById('perfil-categoria');
  if (labelEl) {
    labelEl.textContent = categoria === 'gestion'
      ? 'GESTIÓN Y ARTICULACIÓN PRODUCTIVA'
      : 'EQUIPO DE INVESTIGACIÓN';
  }

  // Foto (Regla 9)
  const fotoEl = document.getElementById('perfil-foto');
  if (fotoEl && m.foto) {
    fotoEl.src = m.foto;
    fotoEl.removeAttribute('alt');
  }

  // Validación de longitud estricta de descripción (≤ 150 caracteres)
  if (m.descripcion && m.descripcion.length > 150) {
    console.warn(`[Red BI4DT] Advertencia: La descripción de "${m.nombre}" supera los 150 caracteres (${m.descripcion.length} caracteres).`);
  }

  // Datos básicos
  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-cargo', m.cargo);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', m.descripcion);

  // Líneas de investigación (Columna 3 - Un solo color, discretas, sin puntos)
  const chipsEl = document.getElementById('perfil-chips');
  if (chipsEl) {
    const lineasMap = new Map();
    if (Array.isArray(m.lineas)) {
      m.lineas.forEach(lin => {
        if (lin) lineasMap.set(lin, { id: '', nombre: lin });
      });
    }
    (proyectosReales || []).forEach(p => {
      if (p.area_id && p.area_nombre && !lineasMap.has(p.area_id)) {
        lineasMap.set(p.area_id, { id: p.area_id, nombre: p.area_nombre });
      }
    });
    const lineasUnicas = Array.from(lineasMap.values());
    if (lineasUnicas.length > 0) {
      chipsEl.innerHTML = lineasUnicas.map(l => {
        const areaId = l.id || MAPA_LINEAS_A_AREAS[(l.nombre || '').toLowerCase().trim()];
        const href = areaId ? `area.html?id=${areaId}` : '../index.html#lineas-investigacion';
        return `
          <li>
            <a href="${href}" class="perfil-linea-link-text" title="${l.nombre}">
              ${l.nombre}
            </a>
          </li>
        `;
      }).join('');
    } else {
      chipsEl.innerHTML = '';
    }
  }

  // Inicializar Paginación de Proyectos en Vista de Lista
  inicializarPaginacionProyectos(proyectosReales);

  // Contacto (Solo logos/íconos, tamaño uniforme 36px, sin texto visible)
  const contactoEl = document.getElementById('perfil-contacto');
  if (contactoEl && m.contacto) {
    const redes = m.redes || { correo: true, linkedin: true, orcid: true, scholar: true };
    let links = '';

    if (redes.correo && m.contacto.email) {
      links += `<a href="mailto:${m.contacto.email}" class="perfil-contacto-btn" data-tooltip="Correo electrónico" aria-label="Correo electrónico de ${m.nombre}">
        <i class="fa-solid fa-envelope"></i>
      </a>`;
    }
    if (redes.linkedin && m.contacto.linkedin) {
      links += `<a href="${m.contacto.linkedin}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="Perfil de LinkedIn" aria-label="LinkedIn de ${m.nombre}">
        <i class="fa-brands fa-linkedin"></i>
      </a>`;
    }
    if (redes.orcid && m.contacto.orcid) {
      links += `<a href="${m.contacto.orcid}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="Identificador ORCID" aria-label="ORCID de ${m.nombre}">
        <i class="fa-brands fa-orcid"></i>
      </a>`;
    }
    if (redes.scholar && m.contacto.scholar) {
      links += `<a href="${m.contacto.scholar}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="Perfil de Google Scholar" aria-label="Google Scholar de ${m.nombre}">
        <i class="fa-brands fa-google-scholar"></i>
      </a>`;
    }
    contactoEl.innerHTML = links;
  }
}

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor || '';
}

function mostrarError(mensaje) {
  const main = document.querySelector('main.page-content');
  if (main) {
    main.innerHTML = `
      <section style="text-align:center; padding: 6rem 2rem; color: #94a3b8;">
        <i class="fa-solid fa-user-xmark" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1.5rem; display: block;"></i>
        <h1 style="font-size: 1.8rem; color: #ffffff; margin-bottom: 1rem;">${mensaje}</h1>
        <p style="margin-bottom: 2rem;">No se encontró la información del integrante solicitado.</p>
        <a href="equipo.html" class="btn-banner btn-gold" style="display:inline-flex;">
          <i class="fa-solid fa-arrow-left"></i> Volver al Equipo
        </a>
      </section>
    `;
  }
}


/* ==========================================================================
   SISTEMA DE PAGINACIÓN DINÁMICA - LISTA DE PROYECTOS (SIN ÍCONOS)
   ========================================================================== */

let proyectosInvestigadorActual = [];
let paginaActualProy = 1;
let itemsPorPaginaProy = 5;

function inicializarPaginacionProyectos(proyectos) {
  proyectosInvestigadorActual = proyectos || [];
  paginaActualProy = 1;

  const selectPerPage = document.getElementById('proy-per-page');
  if (selectPerPage) {
    itemsPorPaginaProy = parseInt(selectPerPage.value, 10) || 5;
    selectPerPage.onchange = (e) => {
      itemsPorPaginaProy = parseInt(e.target.value, 10) || 5;
      paginaActualProy = 1;
      renderizarListaProyectos();
    };
  }

  const badgeTotal = document.getElementById('proyectos-total-badge');
  if (badgeTotal) {
    badgeTotal.textContent = `(${proyectosInvestigadorActual.length})`;
  }

  renderizarListaProyectos();
}

function renderizarListaProyectos() {
  const contenedor = document.getElementById('perfil-proyectos');
  const paginationBar = document.getElementById('proyectos-pagination');
  if (!contenedor) return;

  if (proyectosInvestigadorActual.length === 0) {
    contenedor.innerHTML = '<p class="perfil-empty">Sin proyectos registrados actualmente.</p>';
    if (paginationBar) paginationBar.innerHTML = '';
    return;
  }

  const totalProyectos = proyectosInvestigadorActual.length;
  const totalPaginas = Math.ceil(totalProyectos / itemsPorPaginaProy);

  if (paginaActualProy > totalPaginas) paginaActualProy = totalPaginas;
  if (paginaActualProy < 1) paginaActualProy = 1;

  const inicio = (paginaActualProy - 1) * itemsPorPaginaProy;
  const fin = Math.min(inicio + itemsPorPaginaProy, totalProyectos);
  const proyectosPagina = proyectosInvestigadorActual.slice(inicio, fin);

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


let resizeTimerInv;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimerInv);
  resizeTimerInv = setTimeout(() => {
    if (typeof renderizarListaProyectos === 'function' && proyectosInvestigadorActual.length > 0) {
      renderizarListaProyectos();
    }
  }, 150);
});
