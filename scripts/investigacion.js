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

const DICCIONARIO_LINEAS_EN = {
  'informática biomédica y salud digital': 'Biomedical Informatics and Digital Health',
  'informática biomédica': 'Biomedical Informatics',
  'informatica biomedica': 'Biomedical Informatics',
  'sistemas de información en salud': 'Health Information Systems',
  'sistemas de informacion en salud': 'Health Information Systems',
  'estándares clínicos': 'Clinical Standards',
  'estandares clinicos': 'Clinical Standards',
  'telemedicina': 'Telemedicine',
  'ontologías biomédicas': 'Biomedical Ontologies',
  'ontologias biomedicas': 'Biomedical Ontologies',
  'inteligencia artificial en salud': 'Artificial Intelligence in Health',
  'inteligencia artificial': 'Artificial Intelligence',
  'procesamiento de lenguaje natural': 'Natural Language Processing',
  'visión computacional': 'Computer Vision',
  'vision computacional': 'Computer Vision',
  'bioinformática': 'Bioinformatics',
  'bioinformática clínica': 'Clinical Bioinformatics',
  'bioinformática computacional': 'Computational Bioinformatics',
  'interoperabilidad y gobernanza de datos': 'Interoperability and Data Governance',
  'interoperabilidad clínica (hl7 fhir)': 'Clinical Interoperability (HL7 FHIR)',
  'interoperabilidad': 'Interoperability',
  'gobernanza': 'Data Governance',
  'visualización y analítica de datos': 'Data Visualization and Analytics',
  'visualizacion y analitica de datos': 'Data Visualization and Analytics',
  'analítica de datos': 'Data Analytics',
  'analítica de datos y bioinformática': 'Data Analytics and Bioinformatics',
  'bioestadística': 'Biostatistics',
  'epidemiología matemática': 'Mathematical Epidemiology',
  'evaluación sociotécnica y adopción': 'Sociotechnical Evaluation and Adoption',
  'evaluacion sociotecnica y adopcion': 'Sociotechnical Evaluation and Adoption',
  'evaluación sociotécnica y adopción digital': 'Sociotechnical Evaluation and Digital Adoption',
  'políticas de salud digital': 'Digital Health Policies',
  'salud digital': 'Digital Health',
  'salud global y epidemiología digital': 'Global Health and Digital Epidemiology',
  'epidemiología digital': 'Digital Epidemiology'
};

function esIdiomaIngles() {
  if (window.i18n) {
    if (typeof window.i18n.getLanguage === 'function') return window.i18n.getLanguage() === 'en';
    if (typeof window.i18n.getCurrentLang === 'function') return window.i18n.getCurrentLang() === 'en';
  }
  try {
    return localStorage.getItem('i18n_lang') === 'en';
  } catch (e) {
    return false;
  }
}

function getNombreLinea(nombreEs) {
  const isEn = esIdiomaIngles();
  if (!isEn) return nombreEs;
  const key = (nombreEs || '').toLowerCase().trim();
  return DICCIONARIO_LINEAS_EN[key] || nombreEs;
}

let miembroActualGlobal = null;
let categoriaActualGlobal = 'investigadores';
let proyectosActualesGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const categoria = params.get('cat') || 'investigadores'; // 'investigadores' o 'gestion'
  categoriaActualGlobal = categoria;

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

    // Obtener proyectos vinculados mediante el campo integrantes de proyectos.json
    const todosProyectos = datosProyectos.proyectos || [];
    const proyectosDelInvestigador = todosProyectos.filter(p => {
      return Array.isArray(p.integrantes) && p.integrantes.includes(miembro.id);
    });

    miembroActualGlobal = miembro;
    proyectosActualesGlobal = proyectosDelInvestigador;

    renderPerfil(miembro, categoria, proyectosDelInvestigador);

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError('Ocurrió un error al cargar el perfil del investigador.');
  }
});

const onI18nChangeInv = () => {
  if (miembroActualGlobal) {
    renderPerfil(miembroActualGlobal, categoriaActualGlobal, proyectosActualesGlobal);
  }
};
document.addEventListener('i18n:changed', onI18nChangeInv);
window.addEventListener('i18n:changed', onI18nChangeInv);

function renderPerfil(m, categoria, proyectosReales) {
  const isEn = esIdiomaIngles();

  // Actualizar título del navegador
  document.title = isEn
    ? `${m.nombre} | BI4DT Network`
    : `${m.nombre} | BI4DT Network`;

  // Etiqueta de categoría
  const labelEl = document.getElementById('perfil-categoria');
  if (labelEl) {
    if (categoria === 'gestion') {
      labelEl.textContent = isEn ? 'MANAGEMENT AND PRODUCTIVE ARTICULATION' : 'GESTIÓN Y ARTICULACIÓN PRODUCTIVA';
    } else {
      labelEl.textContent = isEn ? 'RESEARCH TEAM' : 'EQUIPO DE INVESTIGACIÓN';
    }
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

  // Datos básicos con soporte bilingüe
  const descTexto = isEn ? (m.descripcion_en || m.descripcion) : m.descripcion;

  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', descTexto);

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
        const nombreDisplay = getNombreLinea(l.nombre);
        return `
          <li>
            <a href="${href}" class="perfil-linea-link-text" title="${nombreDisplay}">
              ${nombreDisplay}
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

    const tooltipEmail = isEn ? 'Email' : 'Correo electrónico';
    const tooltipLinkedin = isEn ? 'LinkedIn profile' : 'Perfil de LinkedIn';
    const tooltipOrcid = isEn ? 'ORCID identifier' : 'Identificador ORCID';
    const tooltipScholar = isEn ? 'Google Scholar profile' : 'Perfil de Google Scholar';

    if (redes.correo && m.contacto.email) {
      links += `<a href="mailto:${m.contacto.email}" class="perfil-contacto-btn" data-tooltip="${tooltipEmail}" aria-label="${tooltipEmail} - ${m.nombre}">
        <i class="fa-solid fa-envelope"></i>
      </a>`;
    }
    if (redes.linkedin && m.contacto.linkedin) {
      links += `<a href="${m.contacto.linkedin}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="${tooltipLinkedin}" aria-label="${tooltipLinkedin} - ${m.nombre}">
        <i class="fa-brands fa-linkedin"></i>
      </a>`;
    }
    if (redes.orcid && m.contacto.orcid) {
      links += `<a href="${m.contacto.orcid}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="${tooltipOrcid}" aria-label="${tooltipOrcid} - ${m.nombre}">
        <i class="fa-brands fa-orcid"></i>
      </a>`;
    }
    if (redes.scholar && m.contacto.scholar) {
      links += `<a href="${m.contacto.scholar}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" data-tooltip="${tooltipScholar}" aria-label="${tooltipScholar} - ${m.nombre}">
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

  const isEn = esIdiomaIngles();

  if (proyectosInvestigadorActual.length === 0) {
    contenedor.innerHTML = `<p class="perfil-empty">${isEn ? 'No projects currently registered.' : 'Sin proyectos registrados actualmente.'}</p>`;
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
    const esConcluido = p.estado === 'Concluido';
    const estadoClass = esConcluido ? 'proy-estado--concluido' : 'proy-estado--activo';
    const estadoLabel = isEn ? (esConcluido ? 'Completed' : 'In progress') : (p.estado || 'En curso');
    const tituloDisplay = (isEn && p.titulo_en) ? p.titulo_en : p.titulo;

    return `
      <a href="proyecto-detalle.html?id=${p.id}" class="perfil-proy-row">
        <span class="proy-row-title">${tituloDisplay}</span>
        <span class="proy-row-anio">${anioInicio}</span>
        <span class="proy-row-estado ${estadoClass}">${estadoLabel}</span>
        <span class="proy-row-arrow"><i class="fa-solid fa-arrow-right"></i></span>
      </a>
    `;
  }).join('');

  // Renderizar controles de paginación
  if (paginationBar) {
    if (totalPaginas <= 1) {
      const textoSingle = isEn
        ? `Showing ${totalProyectos} project${totalProyectos !== 1 ? 's' : ''}`
        : `Mostrando ${totalProyectos} proyecto${totalProyectos !== 1 ? 's' : ''}`;
      paginationBar.innerHTML = `<span class="proy-pag-info">${textoSingle}</span>`;
      return;
    }

    const itemsPaginacion = obtenerRangoPaginacion(totalPaginas, paginaActualProy);
    let botonesPaginas = '';
    itemsPaginacion.forEach(item => {
      if (item === '...') {
        botonesPaginas += `<span class="proy-pag-ellipsis" aria-hidden="true">&hellip;</span>`;
      } else {
        const activeClass = item === paginaActualProy ? 'active' : '';
        const ariaLabel = isEn ? `Page ${item}` : `Página ${item}`;
        botonesPaginas += `<button type="button" class="proy-pag-btn proy-pag-num ${activeClass}" data-page="${item}" aria-label="${ariaLabel}">${item}</button>`;
      }
    });

    const infoPaginacion = isEn
      ? `Showing ${inicio + 1} - ${fin} of ${totalProyectos} projects`
      : `Mostrando ${inicio + 1} - ${fin} de ${totalProyectos} proyectos`;

    const prevAria = isEn ? 'Previous page' : 'Página anterior';
    const nextAria = isEn ? 'Next page' : 'Página siguiente';

    paginationBar.innerHTML = `
      <span class="proy-pag-info">${infoPaginacion}</span>
      <div class="proy-pag-controls">
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-prev" ${paginaActualProy === 1 ? 'disabled' : ''} aria-label="${prevAria}">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="proy-pag-numbers">
          ${botonesPaginas}
        </div>
        <button type="button" class="proy-pag-btn proy-pag-nav proy-pag-next" ${paginaActualProy === totalPaginas ? 'disabled' : ''} aria-label="${nextAria}">
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
