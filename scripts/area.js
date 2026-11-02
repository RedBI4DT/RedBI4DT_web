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

  // Número, Nombre y Descripción
  setHtml('area-hero-numero', area.numero);
  setHtml('area-hero-nombre', area.nombre);
  setHtml('area-hero-desc', area.descripcion_larga);

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
    const cargoHtml = m.cargo ? `<span class="area-inv-cargo">${m.cargo}</span>` : '';

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
          ${cargoHtml}
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
    const badgeHtml = p.area_nombre ? `<span class="proy-area-badge">${p.area_nombre}</span>` : '';

    return `
      <a href="proyecto-detalle.html?id=${p.id}" class="area-proy-card" style="animation-delay:${index * 50}ms;">
        <div class="area-proy-top">
          <span class="area-proy-anio">${p.anio || ''}</span>
          <span class="proy-estado ${estadoClass}">${p.estado || 'En curso'}</span>
        </div>
        <h3 class="area-proy-titulo">${p.titulo}</h3>
        <p class="area-proy-desc">${p.descripcion || ''}</p>
        <div class="area-proy-action">
          ${badgeHtml}
          <span class="area-proy-flecha"><i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>`;
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
