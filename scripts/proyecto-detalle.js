/**
 * scripts/proyecto-detalle.js
 * Carga dinámica y renderizado de la plantilla única de Detalle de Proyecto (Nivel 4).
 * Conecta bidireccionalmente con integrantes (Nivel 2) y catálogo general filtrado (Nivel 3).
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const idProyecto = params.get('id');

  if (!idProyecto) {
    mostrarError('No se especificó un identificador de proyecto.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const [proyectosRes, miembrosRes] = await Promise.all([
      fetch(`${base}assets/data/proyectos.json`),
      fetch(`${base}assets/data/miembros.json`)
    ]);

    if (!proyectosRes.ok) throw new Error('No se pudo cargar proyectos.json');
    const datosProyectos = await proyectosRes.json();
    const datosMiembros = miembrosRes.ok ? await miembrosRes.json() : { investigadores: [], gestion: [] };

    const todosProyectos = datosProyectos.proyectos || [];
    const proyecto = todosProyectos.find(p => p.id === idProyecto);

    if (!proyecto) {
      mostrarError('Proyecto no encontrado.');
      return;
    }

    renderDetalleProyecto(proyecto, todosProyectos, datosMiembros, base);

  } catch (err) {
    console.error('Error cargando detalle del proyecto:', err);
    mostrarError('Ocurrió un error al cargar la información del proyecto.');
  }
});

function renderDetalleProyecto(p, todosProyectos, datosMiembros, base) {
  // Actualizar título en pestaña
  document.title = `${p.titulo} - Proyecto | BI4DT Network`;

  // 1. Hero Metadata y Ficha de Proyecto (soporte multilínea: formato lista sin punto, una encima de otra)
  const AREA_LABELS_DET = {
    'informatica-biomedica': 'Informática Biomédica',
    'ia-salud': 'Inteligencia Artificial en Salud',
    'interoperabilidad': 'Interoperabilidad y Gobernanza de Datos',
    'analitica-datos': 'Visualización y Analítica de Datos',
    'sociotecnica-adopcion': 'Evaluación Sociotécnica y Adopción',
    'salud-digital': 'Salud Digital'
  };

  const lineasContainer = document.getElementById('proy-lineas-container');
  const lineaBadge = document.getElementById('proy-linea-badge');
  const lineaLabel = document.getElementById('proy-linea-label');

  const lineasIds = Array.isArray(p.lineas) && p.lineas.length > 0
    ? p.lineas
    : (p.area_id ? [p.area_id] : []);

  if (lineaLabel) {
    lineaLabel.textContent = lineasIds.length > 1 ? 'Líneas de Investigación' : 'Línea de Investigación';
  }

  const itemsHtml = lineasIds.map(id => {
    const nombre = AREA_LABELS_DET[id] || (id === p.area_id ? p.area_nombre : id);
    return `<li><a href="area.html?id=${id}" class="ficha-valor-linea">${nombre}</a></li>`;
  }).join('');

  if (lineasContainer) {
    lineasContainer.innerHTML = `<ul class="ficha-lineas-list">${itemsHtml}</ul>`;
  } else if (lineaBadge) {
    lineaBadge.parentElement.innerHTML = `<ul class="ficha-lineas-list">${itemsHtml}</ul>`;
  }

  const estadoBadge = document.getElementById('proy-estado-badge');
  if (estadoBadge) {
    const esConcluido = p.estado === 'Concluido';
    estadoBadge.textContent = p.estado || 'En curso';
    estadoBadge.className = `proy-estado-badge ${esConcluido ? 'proy-estado-badge--concluido' : 'proy-estado-badge--activo'}`;
  }

  const paisText = document.getElementById('proy-pais-text');
  if (paisText) {
    paisText.textContent = Array.isArray(p.paises) ? p.paises.join(', ') : (p.pais || 'Perú');
  }

  setTexto('proy-titulo', p.titulo);
  setTexto('proy-periodo', p.anio || `${p.anio_inicio || ''}–${p.anio_fin || ''}`);

  // 2. Descripción completa
  const descEl = document.getElementById('proy-descripcion-larga');
  if (descEl) {
    const contenido = p.descripcion_larga || p.descripcion || p.resumen || 'Sin descripción disponible.';
    descEl.innerHTML = `<p>${contenido}</p>`;
  }

  // 3. Equipo participante (Búsqueda en miembros.json)
  const equipoGrid = document.getElementById('proy-equipo-grid');
  if (equipoGrid) {
    const todosMiembros = [
      ...(datosMiembros.investigadores || []).map(m => ({ ...m, categoria: 'investigadores' })),
      ...(datosMiembros.gestion || []).map(m => ({ ...m, categoria: 'gestion' })),
      ...(datosMiembros.estudiantes || []).map(m => ({ ...m, categoria: 'estudiantes' }))
    ];

    const idsEquipo = Array.isArray(p.integrantes) && p.integrantes.length > 0
      ? p.integrantes
      : (p.investigador_principal ? [p.investigador_principal] : []);

    const miembrosEncontrados = idsEquipo.map(id => todosMiembros.find(m => m.id === id)).filter(Boolean);

    if (miembrosEncontrados.length > 0) {
      equipoGrid.innerHTML = miembrosEncontrados.map(m => {
        const fotoSrc = m.foto || `${base}assets/images/Imagen_1.jpg`;
        const linkPerfil = m.categoria === 'estudiantes'
          ? `estudiante.html?id=${m.id}`
          : `investigacion.html?id=${m.id}&cat=${m.categoria}`;
        return `
          <a href="${linkPerfil}" class="proyecto-miembro-card" title="Ver perfil de ${m.nombre}">
            <div class="proyecto-miembro-img-wrapper">
              <img src="${fotoSrc}" class="proyecto-miembro-img">
              <div class="proyecto-miembro-img-overlay"></div>
            </div>
            <div class="proyecto-miembro-info">
              <span class="proyecto-miembro-nombre">${m.nombre}</span>
              <span class="proyecto-miembro-inst">${m.institucion || ''}</span>
            </div>
          </a>
        `;
      }).join('');
    } else if (p.investigador_nombre) {
      equipoGrid.innerHTML = `
        <div class="proyecto-miembro-card">
          <div class="proyecto-miembro-info">
            <span class="proyecto-miembro-nombre">${p.investigador_nombre}</span>
            <span class="proyecto-miembro-inst">${p.institucion_principal || p.institucion || ''}</span>
          </div>
        </div>
      `;
    } else {
      equipoGrid.innerHTML = '<p class="perfil-empty">Equipo en proceso de registro.</p>';
    }
  }

  // 4. Instituciones (sin iconos repetitivos)
  const instList = document.getElementById('proy-instituciones-list');
  if (instList) {
    const instituciones = p.instituciones || [];
    if (instituciones.length > 0) {
      instList.innerHTML = instituciones.map(inst => `
        <li class="proyecto-inst-item">
          <span>${inst}</span>
        </li>
      `).join('');
    } else {
      instList.innerHTML = '<li class="proyecto-inst-item"><span>Red BI4DT</span></li>';
    }
  }

  // 5. Enlace del único botón CTA "Ver proyectos similares"
  const filtroLink = document.getElementById('proy-filtro-linea-link');
  if (filtroLink) {
    const lineasIds = Array.isArray(p.lineas) && p.lineas.length > 0
      ? p.lineas
      : (p.area_id ? [p.area_id] : []);
    if (lineasIds.length > 0) {
      filtroLink.href = `proyectos.html?lineas=${lineasIds.join(',')}&combo=1`;
    } else if (p.area_id) {
      filtroLink.href = `proyectos.html?linea=${p.area_id}`;
    }
  }

  // 6. Publicaciones del Proyecto
  renderPublicaciones(p.publicaciones || []);
}

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor || '';
}

function mostrarError(mensaje) {
  const main = document.getElementById('main-content');
  if (main) {
    main.innerHTML = `
      <section style="text-align:center; padding: 6rem 2rem; color: #94a3b8; max-width: 800px; margin: 0 auto;">
        <i class="fa-solid fa-folder-open" style="font-size: 3.5rem; color: #f59e0b; margin-bottom: 1.5rem; display: block;"></i>
        <h1 style="font-size: 1.85rem; color: #ffffff; margin-bottom: 1rem;">${mensaje}</h1>
        <p style="margin-bottom: 2rem; line-height: 1.6;">No se encontró el proyecto solicitado o el enlace es incorrecto.</p>
        <a href="proyectos.html" class="btn-banner btn-gold" style="display:inline-flex;">
          <i class="fa-solid fa-arrow-left"></i> Volver al Catálogo de Proyectos
        </a>
      </section>
    `;
  }
}


function renderPublicaciones(publicaciones) {
  const container = document.getElementById('proy-publicaciones-container');
  const countEl = document.getElementById('proy-pub-count');

  const pubs = Array.isArray(publicaciones) ? [...publicaciones] : [];

  if (countEl) {
    countEl.textContent = `(${pubs.length})`;
  }

  if (!container) return;

  if (pubs.length === 0) {
    container.innerHTML = '<p class="proy-pub-empty">Este proyecto aún no tiene publicaciones registradas.</p>';
    return;
  }

  // Orden: año descendente. Las que no tengan año van al final.
  pubs.sort((a, b) => {
    const anioA = a.anio ? Number(a.anio) : -Infinity;
    const anioB = b.anio ? Number(b.anio) : -Infinity;
    return anioB - anioA;
  });

  const hasScrollClass = pubs.length > 8 ? ' has-scroll' : '';

  container.innerHTML = `
    <ul class="proy-pub-list${hasScrollClass}">
      ${pubs.map(pub => {
        const metaParts = [];
        if (pub.anio) metaParts.push(pub.anio);
        if (pub.revista) metaParts.push(pub.revista);
        const metaString = metaParts.join(' - ');

        return `
          <li class="proy-pub-item">
            <span class="proy-pub-bullet" aria-hidden="true">
              <i class="fa-solid fa-chevron-right"></i>
            </span>
            <div class="proy-pub-content">
              <a href="${pub.url}" target="_blank" rel="noopener noreferrer" class="proy-pub-link">
                <span>${pub.titulo}</span>
                <span class="proy-pub-ext-icon" aria-hidden="true">↗</span>
                <span class="sr-only">(se abre en una pestaña nueva)</span>
              </a>
              ${metaString ? `<span class="proy-pub-meta">${metaString}</span>` : ''}
            </div>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}