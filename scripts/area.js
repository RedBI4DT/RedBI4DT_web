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
  'interoperabilidad': 'emerald'
};

const MAPA_LINEAS_A_AREAS = {
  'informática biomédica': 'informatica-biomedica',
  'informatica biomedica': 'informatica-biomedica',
  'sistemas de información en salud': 'informatica-biomedica',
  'sistemas de informacion en salud': 'informatica-biomedica',
  'estándares clínicos': 'informatica-biomedica',
  'estandares clinicos': 'informatica-biomedica',
  'telemedicina': 'informatica-biomedica',
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
  'bioinformatica': 'ia-salud',
  'bioinformática clínica': 'ia-salud',
  'bioinformatica clinica': 'ia-salud',
  'epidemiología digital': 'ia-salud',
  'epidemiologia digital': 'ia-salud',
  'informática epidemiológica': 'ia-salud',
  'informatica epidemiologica': 'ia-salud',
  'interoperabilidad clínica (hl7 fhir)': 'interoperabilidad',
  'interoperabilidad': 'interoperabilidad',
  'gobernanza': 'interoperabilidad',
  'políticas de salud digital': 'interoperabilidad',
  'politicas de salud digital': 'interoperabilidad',
  'salud pública digital': 'interoperabilidad',
  'salud publica digital': 'interoperabilidad',
  'gestión de proyectos de i+d': 'interoperabilidad',
  'gestion de proyectos de i+d': 'interoperabilidad'
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

    // Obtener todos los investigadores/gestores vinculados
    const todosMiembros = [
      ...(miembrosData.investigadores || []).map(m => ({ ...m, categoria: 'investigadores' })),
      ...(miembrosData.gestion || []).map(m => ({ ...m, categoria: 'gestion' }))
    ];

    const idsInvestigadoresEnProyectos = new Set(proyectosRelacionados.map(p => p.investigador_principal).filter(Boolean));

    const investigadoresDelArea = todosMiembros.filter(m => {
      // 1. Si lidera un proyecto de esta área
      if (idsInvestigadoresEnProyectos.has(m.id)) return true;

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

  // Número y Nombre
  setHtml('area-hero-numero', area.numero);
  setHtml('area-hero-nombre', area.nombre);
  setHtml('area-hero-desc', area.descripcion_larga);

  // Temas / Badges en el Hero
  const temasEl = document.getElementById('area-hero-temas');
  if (temasEl && area.temas) {
    temasEl.innerHTML = area.temas.map(tema =>
      `<span class="area-tema-badge" data-color="${color}">
        <i class="fa-solid fa-circle" style="font-size:0.4rem;opacity:0.7;"></i>
        ${tema}
      </span>`
    ).join('');
  }

  // Ícono decorativo
  const iconEl = document.getElementById('area-hero-icon');
  if (iconEl) {
    iconEl.className = `fa-solid ${area.icono} area-hero-icon`;
  }

  // Colores de acento para etiquetas de sección
  const lineProy = document.getElementById('area-section-line');
  const labelProy = document.getElementById('area-proyectos-label');
  if (lineProy && labelProy) {
    lineProy.style.background = area.color_acento;
    labelProy.style.color = area.color_acento;
  }

  const lineInv = document.getElementById('area-investigadores-line');
  const labelInv = document.getElementById('area-investigadores-label');
  if (lineInv && labelInv) {
    lineInv.style.background = area.color_acento;
    labelInv.style.color = area.color_acento;
  }

  // 1. Renderizar Investigadores del Área
  renderInvestigadores(investigadores, color);

  // 2. Renderizar Proyectos del Área
  renderProyectos(proyectos, color);
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
    const linkPerfil = `investigacion.html?id=${m.id}&cat=${m.categoria || 'investigadores'}`;

    return `
      <article class="area-investigador-card area-investigador-card--${color}">
        <div class="area-inv-foto-container">
          <img src="${foto}" class="area-inv-img">
          <div class="area-inv-img-overlay"></div>
        </div>
        <div class="area-inv-info">
          <a href="${linkPerfil}" class="area-inv-nombre" title="Ver perfil de ${m.nombre}">
            ${m.nombre}
          </a>
          <span class="area-inv-cargo">${m.cargo}</span>
          <span class="area-inv-institucion">${m.institucion}</span>
          <a href="${linkPerfil}" class="area-inv-link-perfil">
            <span>Ver perfil completo</span>
            <i class="fa-solid fa-arrow-right" style="font-size:0.7rem;"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function renderProyectos(proyectos, color) {
  const grid = document.getElementById('area-proyectos-grid');
  if (!grid) return;

  if (!proyectos || proyectos.length === 0) {
    grid.innerHTML = `
      <div class="area-proyectos-vacio">
        <i class="fa-solid fa-folder-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:1rem;display:block;"></i>
        <p>Actualmente no hay proyectos registrados en este eje científico.</p>
        <a href="proyectos.html" class="btn-banner btn-gold" style="display:inline-flex;margin-top:1rem;">
          Ver todos los proyectos
        </a>
      </div>`;
    return;
  }

  grid.innerHTML = proyectos.map((p, index) => {
    const estadoClass = p.estado === 'Concluido' ? 'proy-estado--concluido' : 'proy-estado--activo';
    const tagsHtml = (p.tags || []).slice(0, 3).map(t => `<span class="area-proy-tag">${t}</span>`).join('');
    const instituciones = (p.instituciones || []).slice(0, 2).join(' • ');

    const linkInvestigador = p.investigador_principal
      ? `<a href="investigacion.html?id=${p.investigador_principal}&cat=${p.categoria_miembro || 'investigadores'}" class="area-proy-inv-link" title="Ver perfil del investigador">
          ${p.investigador_nombre || ''}
        </a>`
      : `<span class="area-proy-inv-nombre">${p.investigador_nombre || ''}</span>`;

    return `
      <article class="area-proy-card area-proy-card--${color}" style="animation-delay:${index * 50}ms;">
        <div class="area-proy-top">
          <span class="area-proy-anio">${p.anio || ''}</span>
          <span class="proy-estado ${estadoClass}">${p.estado || 'En curso'}</span>
        </div>
        <h3 class="area-proy-titulo">${p.titulo}</h3>
        <p class="area-proy-desc">${p.descripcion}</p>
        ${tagsHtml ? `<div class="area-proy-tags">${tagsHtml}</div>` : ''}
        <div class="area-proy-footer">
          <i class="fa-solid fa-user-tie area-proy-icon"></i>
          <div class="area-proy-footer-info">
            ${linkInvestigador}
            <span class="area-proy-instituciones">${instituciones}</span>
          </div>
        </div>
      </article>`;
  }).join('');
}

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
