/**
 * scripts/proyecto-detalle.js
 * Carga dinámica y renderizado de la plantilla única de Detalle de Proyecto (Nivel 4).
 * Conecta bidireccionalmente con integrantes (Nivel 2) y catálogo general filtrado (Nivel 3).
 */

const COLOR_MAP = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald',
  'analitica-datos': 'violet',
  'sociotecnica-adopcion': 'rose',
  'salud-digital': 'sky'
};

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

  const color = COLOR_MAP[p.area_id] || 'gold';

  // 1. Hero Metadata
  const lineaBadge = document.getElementById('proy-linea-badge');
  if (lineaBadge) {
    lineaBadge.textContent = p.area_nombre || 'Línea Científica';
    lineaBadge.className = `ficha-valor-linea ficha-valor-linea--${color}`;
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

  // 3. Palabras clave / Tags
  const tagsEl = document.getElementById('proy-tags');
  if (tagsEl) {
    const tags = p.tags || [];
    if (tags.length > 0) {
      tagsEl.innerHTML = tags.map(t => `<span class="proyecto-tag-item">${t}</span>`).join('');
    } else {
      tagsEl.innerHTML = '<span class="proyecto-tag-item">General</span>';
    }
  }

  // 4. Equipo participante (Búsqueda en miembros.json)
  const equipoGrid = document.getElementById('proy-equipo-grid');
  if (equipoGrid) {
    const todosMiembros = [
      ...(datosMiembros.investigadores || []).map(m => ({ ...m, categoria: 'investigadores' })),
      ...(datosMiembros.gestion || []).map(m => ({ ...m, categoria: 'gestion' }))
    ];

    const idsEquipo = Array.isArray(p.integrantes) && p.integrantes.length > 0
      ? p.integrantes
      : (p.investigador_principal ? [p.investigador_principal] : []);

    const miembrosEncontrados = idsEquipo.map(id => todosMiembros.find(m => m.id === id)).filter(Boolean);

    if (miembrosEncontrados.length > 0) {
      equipoGrid.innerHTML = miembrosEncontrados.map(m => {
        const fotoSrc = m.foto || `${base}assets/images/Imagen_1.jpg`;
        return `
          <a href="investigacion.html?id=${m.id}&cat=${m.categoria}" class="proyecto-miembro-card" title="Ver perfil de ${m.nombre}">
            <div class="proyecto-miembro-img-wrapper">
              <img src="${fotoSrc}" class="proyecto-miembro-img">
              <div class="proyecto-miembro-img-overlay"></div>
            </div>
            <div class="proyecto-miembro-info">
              <span class="proyecto-miembro-nombre">${m.nombre}</span>
              <span class="proyecto-miembro-cargo">${m.cargo}</span>
              <span class="proyecto-miembro-inst">${m.institucion}</span>
            </div>
          </a>
        `;
      }).join('');
    } else if (p.investigador_nombre) {
      equipoGrid.innerHTML = `
        <div class="proyecto-miembro-card">
          <div class="proyecto-miembro-info">
            <span class="proyecto-miembro-nombre">${p.investigador_nombre}</span>
            <span class="proyecto-miembro-cargo">Investigador Principal</span>
          </div>
        </div>
      `;
    } else {
      equipoGrid.innerHTML = '<p class="perfil-empty">Equipo en proceso de registro.</p>';
    }
  }

  // 5. Instituciones
  const instList = document.getElementById('proy-instituciones-list');
  if (instList) {
    const instituciones = p.instituciones || [];
    if (instituciones.length > 0) {
      instList.innerHTML = instituciones.map(inst => `
        <li class="proyecto-inst-item">
          <i class="fa-solid fa-landmark"></i>
          <span>${inst}</span>
        </li>
      `).join('');
    } else {
      instList.innerHTML = '<li class="proyecto-inst-item"><span>Red BI4DT</span></li>';
    }
  }

  // 6. Enlace en sidebar a proyectos de la misma línea
  const filtroLink = document.getElementById('proy-filtro-linea-link');
  if (filtroLink && p.area_id) {
    filtroLink.href = `proyectos.html?linea=${p.area_id}`;
  }

  // 7. Proyectos Relacionados (misma línea, excluyendo el actual)
  const relGrid = document.getElementById('proy-relacionados-grid');
  if (relGrid) {
    const relacionados = todosProyectos
      .filter(item => item.id !== p.id && item.area_id === p.area_id)
      .slice(0, 3);

    if (relacionados.length > 0) {
      relGrid.innerHTML = relacionados.map(rel => {
        const relColor = COLOR_MAP[rel.area_id] || 'gold';
        const estadoClass = rel.estado === 'Concluido' ? 'proy-estado-badge--concluido' : 'proy-estado-badge--activo';

        return `
          <a href="proyecto-detalle.html?id=${rel.id}" class="proy-relacionado-card proy-relacionado-card--${relColor}">
            <div class="proy-relacionado-top">
              <span class="proy-relacionado-anio">${rel.anio || ''}</span>
              <span class="proy-estado-badge ${estadoClass}">${rel.estado || 'En curso'}</span>
            </div>
            <h3 class="proy-relacionado-titulo">${rel.titulo}</h3>
            <div class="proy-relacionado-footer">
              <span class="proy-relacionado-link-text">Ver detalle</span>
              <span class="proy-relacionado-flecha"><i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        `;
      }).join('');
    } else {
      const relSection = document.querySelector('.proyectos-relacionados-section');
      if (relSection) relSection.style.display = 'none';
    }
  }
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
