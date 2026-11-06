/**
 * scripts/estudiante.js
 * Carga dinámica del perfil de estudiante / colaborador desde miembros.json y proyectos.json.
 * Muestra información del estudiante, áreas de interés derivadas de sus proyectos vinculados,
 * y la lista de proyectos relacionados con paginación interactiva.
 */

const MAPA_LINEAS_A_AREAS = {
  'informática biomédica': 'informatica-biomedica',
  'informatica biomedica': 'informatica-biomedica',
  'inteligencia artificial en salud': 'ia-salud',
  'ia en salud': 'ia-salud',
  'inteligencia artificial': 'ia-salud',
  'interoperabilidad y gobernanza de datos': 'interoperabilidad',
  'interoperabilidad': 'interoperabilidad',
  'visualización y analítica de datos': 'analitica-datos',
  'visualizacion y analitica de datos': 'analitica-datos',
  'analítica de datos': 'analitica-datos',
  'evaluación sociotécnica y adopción': 'sociotecnica-adopcion',
  'evaluacion sociotecnica y adopcion': 'sociotecnica-adopcion',
  'salud digital': 'salud-digital'
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
  'ia en salud': 'Artificial Intelligence in Health',
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

const NOMBRES_AREAS = {
  'informatica-biomedica': 'Informática Biomédica',
  'ia-salud': 'Inteligencia Artificial en Salud',
  'interoperabilidad': 'Interoperabilidad y Gobernanza de Datos',
  'analitica-datos': 'Visualización y Analítica de Datos',
  'sociotecnica-adopcion': 'Evaluación Sociotécnica y Adopción',
  'salud-digital': 'Salud Digital'
};

let estudianteActualGlobal = null;
let proyectosActualesGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarError('No se especificó un perfil.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const [miembrosRes, proyectosRes] = await Promise.all([
      fetch(`${base}assets/data/miembros.json`, { cache: 'no-store' }),
      fetch(`${base}assets/data/proyectos.json`, { cache: 'no-store' })
    ]);

    if (!miembrosRes.ok) throw new Error('No se pudo cargar miembros.json');
    const datosMiembros = await miembrosRes.json();
    const datosProyectos = proyectosRes.ok ? await proyectosRes.json() : { proyectos: [] };

    // Buscar en la categoría de estudiantes, o fallback a otras categorías
    let miembro = (datosMiembros.estudiantes || []).find(m => m.id === id);
    if (!miembro) {
      miembro = [...(datosMiembros.investigadores || []), ...(datosMiembros.gestion || [])].find(m => m.id === id);
    }

    if (!miembro) {
      mostrarError('Perfil no encontrado.');
      return;
    }

    // Obtener proyectos asociados al estudiante
    const todosProyectos = datosProyectos.proyectos || [];
    const idsAsociados = Array.isArray(miembro.proyectos) ? miembro.proyectos : [];
    const proyectosDelEstudiante = todosProyectos.filter(p => {
      if (idsAsociados.includes(p.id)) return true;
      if (Array.isArray(p.integrantes) && p.integrantes.includes(miembro.id)) return true;
      return false;
    });

    estudianteActualGlobal = miembro;
    proyectosActualesGlobal = proyectosDelEstudiante;

    renderPerfil(miembro, proyectosDelEstudiante);

  } catch (err) {
    console.error('Error cargando perfil de estudiante:', err);
    mostrarError('Ocurrió un error al cargar el perfil.');
  }
});

const onI18nChangeEst = () => {
  if (estudianteActualGlobal) {
    renderPerfil(estudianteActualGlobal, proyectosActualesGlobal);
  }
};
document.addEventListener('i18n:changed', onI18nChangeEst);
window.addEventListener('i18n:changed', onI18nChangeEst);

function renderPerfil(m, proyectosReales) {
  const isEn = esIdiomaIngles();

  // Título de la pestaña
  document.title = isEn
    ? `${m.nombre} - Profile | BI4DT Network`
    : `${m.nombre} - Perfil | Red BI4DT`;

  // Foto
  const fotoEl = document.getElementById('perfil-foto');
  if (fotoEl && m.foto) {
    fotoEl.src = m.foto;
    fotoEl.removeAttribute('alt');
  }

  // Datos básicos con soporte bilingüe
  const descTexto = isEn ? (m.descripcion_en || m.descripcion) : m.descripcion;

  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', descTexto);

  // Áreas de interés derivadas dinámicamente de los proyectos vinculados
  const lineasEl = document.getElementById('perfil-lineas');
  if (lineasEl) {
    const lineasMap = new Map();

    // 1. Áreas de los proyectos vinculados
    (proyectosReales || []).forEach(p => {
      if (p.area_id && !lineasMap.has(p.area_id)) {
        lineasMap.set(p.area_id, {
          id: p.area_id,
          nombre: p.area_nombre || NOMBRES_AREAS[p.area_id] || p.area_id
        });
      }
      if (Array.isArray(p.lineas)) {
        p.lineas.forEach(lId => {
          if (lId && !lineasMap.has(lId)) {
            lineasMap.set(lId, {
              id: lId,
              nombre: NOMBRES_AREAS[lId] || lId
            });
          }
        });
      }
    });

    // 2. Líneas explícitas que tenga el miembro
    if (Array.isArray(m.lineas)) {
      m.lineas.forEach(lin => {
        if (lin) {
          const areaId = MAPA_LINEAS_A_AREAS[lin.toLowerCase().trim()] || '';
          const key = areaId || lin;
          if (!lineasMap.has(key)) {
            lineasMap.set(key, { id: areaId, nombre: lin });
          }
        }
      });
    }

    const lineasUnicas = Array.from(lineasMap.values());
    if (lineasUnicas.length > 0) {
      lineasEl.innerHTML = lineasUnicas.map(l => {
        const href = l.id ? `area.html?id=${l.id}` : '../index.html#lineas-investigacion';
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
      const msgVacio = isEn ? 'In process of assignment' : 'En proceso de asignación';
      lineasEl.innerHTML = `<li><span class="perfil-linea-link-text" style="color:#94a3b8; font-style:italic;">${msgVacio}</span></li>`;
    }
  }

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

  // Inicializar Paginación de Proyectos en Vista de Lista
  inicializarPaginacionProyectos(proyectosReales);
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
   SISTEMA DE PAGINACIÓN DINÁMICA - LISTA DE PROYECTOS (HOMOLOGADA)
   ========================================================================== */

let proyectosEstudianteActual = [];
let paginaActualProy = 1;
let itemsPorPaginaProy = 5;

function inicializarPaginacionProyectos(proyectos) {
  proyectosEstudianteActual = proyectos || [];
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
    badgeTotal.textContent = `(${proyectosEstudianteActual.length})`;
  }

  renderizarListaProyectos();
}

function renderizarListaProyectos() {
  const contenedor = document.getElementById('perfil-proyectos');
  const paginationBar = document.getElementById('proyectos-pagination');
  if (!contenedor) return;

  const isEn = esIdiomaIngles();

  if (proyectosEstudianteActual.length === 0) {
    contenedor.innerHTML = `<p class="perfil-empty">${isEn ? 'No projects currently registered.' : 'Sin proyectos registrados actualmente.'}</p>`;
    if (paginationBar) paginationBar.innerHTML = '';
    return;
  }

  const totalProyectos = proyectosEstudianteActual.length;
  const totalPaginas = Math.ceil(totalProyectos / itemsPorPaginaProy);

  if (paginaActualProy > totalPaginas) paginaActualProy = totalPaginas;
  if (paginaActualProy < 1) paginaActualProy = 1;

  const inicio = (paginaActualProy - 1) * itemsPorPaginaProy;
  const fin = Math.min(inicio + itemsPorPaginaProy, totalProyectos);
  const proyectosPagina = proyectosEstudianteActual.slice(inicio, fin);

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

    // Listeners de paginación
    paginationBar.querySelector('.proy-pag-prev')?.addEventListener('click', () => {
      if (paginaActualProy > 1) {
        paginaActualProy--;
        renderizarListaProyectos();
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    paginationBar.querySelector('.proy-pag-next')?.addEventListener('click', () => {
      if (paginaActualProy < totalPaginas) {
        paginaActualProy++;
        renderizarListaProyectos();
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    paginationBar.querySelectorAll('.proy-pag-num').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p && p !== paginaActualProy) {
          paginaActualProy = p;
          renderizarListaProyectos();
          contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

/**
 * Genera el rango de números y elipsis para la paginación dinámica.
 * En móvil se restringe a un máximo compacto con '...' para evitar desbordamientos.
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

let resizeTimerEst;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimerEst);
  resizeTimerEst = setTimeout(() => {
    if (typeof renderizarListaProyectos === 'function' && proyectosEstudianteActual.length > 0) {
      renderizarListaProyectos();
    }
  }, 150);
});
