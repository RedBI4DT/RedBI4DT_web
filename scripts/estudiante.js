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

const NOMBRES_AREAS = {
  'informatica-biomedica': 'Informática Biomédica',
  'ia-salud': 'Inteligencia Artificial en Salud',
  'interoperabilidad': 'Interoperabilidad y Gobernanza de Datos',
  'analitica-datos': 'Visualización y Analítica de Datos',
  'sociotecnica-adopcion': 'Evaluación Sociotécnica y Adopción',
  'salud-digital': 'Salud Digital'
};

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

    renderPerfil(miembro, proyectosDelEstudiante);

  } catch (err) {
    console.error('Error cargando perfil de estudiante:', err);
    mostrarError('Ocurrió un error al cargar el perfil.');
  }
});

function renderPerfil(m, proyectosReales) {
  // Título de la pestaña
  document.title = `${m.nombre} - Perfil | Red BI4DT`;

  // Foto
  const fotoEl = document.getElementById('perfil-foto');
  if (fotoEl && m.foto) {
    fotoEl.src = m.foto;
    fotoEl.removeAttribute('alt');
  }

  // Datos básicos
  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', m.descripcion);

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
        return `
          <li>
            <a href="${href}" class="perfil-linea-link-text" title="${l.nombre}">
              ${l.nombre}
            </a>
          </li>
        `;
      }).join('');
    } else {
      lineasEl.innerHTML = '<li><span class="perfil-linea-link-text" style="color:#94a3b8; font-style:italic;">En proceso de asignación</span></li>';
    }
  }

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

  if (proyectosEstudianteActual.length === 0) {
    contenedor.innerHTML = '<p class="perfil-empty">Sin proyectos registrados actualmente.</p>';
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
