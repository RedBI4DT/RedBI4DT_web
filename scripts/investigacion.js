/**
 * scripts/investigacion.js
 * Carga dinámica del perfil de investigador/gestor con trazabilidad real hacia:
 * - Proyectos (assets/data/proyectos.json)
 * - Líneas / Ejes científicos (assets/data/areas.json / area.html)
 */

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
      if (p.investigador_principal === miembro.id) return true;
      if (Array.isArray(p.integrantes) && p.integrantes.includes(miembro.id)) return true;
      if (p.investigador_nombre && p.investigador_nombre.toLowerCase() === miembro.nombre.toLowerCase()) return true;
      return false;
    });

    renderPerfil(miembro, categoria, proyectosDelInvestigador);

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError('Ocurrió un error al cargar el perfil del investigador.');
  }
});

function normalizarTexto(texto) {
  return (texto || '').toLowerCase().trim();
}

const COLOR_MAP = {
  'informatica-biomedica': 'gold',
  'ia-salud': 'indigo',
  'interoperabilidad': 'emerald',
  'analitica-datos': 'violet',
  'sociotecnica-adopcion': 'rose',
  'salud-digital': 'sky'
};

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

  // Datos básicos
  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-cargo', m.cargo);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', m.descripcion);

  // Chips temáticos en el hero derivados de sus proyectos asociados
  const chipsEl = document.getElementById('perfil-chips');
  if (chipsEl) {
    const lineasMap = new Map();
    (proyectosReales || []).forEach(p => {
      if (p.area_id && p.area_nombre && !lineasMap.has(p.area_id)) {
        lineasMap.set(p.area_id, { id: p.area_id, nombre: p.area_nombre });
      }
    });
    const lineasUnicas = Array.from(lineasMap.values()).slice(0, 3);
    if (lineasUnicas.length > 0) {
      chipsEl.innerHTML = lineasUnicas.map(l => {
        const color = COLOR_MAP[l.id] || 'gold';
        return `
          <a href="proyectos.html?linea=${l.id}" class="perfil-hero-chip perfil-hero-chip--${color}" title="Ver proyectos en: ${l.nombre}">
            <span class="chip-dot"></span>${l.nombre}
          </a>
        `;
      }).join('');
    } else {
      chipsEl.innerHTML = '';
    }
  }

  // Proyectos Relacionados (Cards mínimas según arquitectura: año, estado, 1 tag línea, título, flecha -> detalle)
  const proyectosEl = document.getElementById('perfil-proyectos');
  if (proyectosEl) {
    if (proyectosReales && proyectosReales.length > 0) {
      proyectosEl.innerHTML = proyectosReales.map(p => {
        const color = COLOR_MAP[p.area_id] || 'gold';
        const estadoClass = p.estado === 'Concluido' ? 'proy-estado--concluido' : 'proy-estado--activo';

        return `
          <a href="proyecto-detalle.html?id=${p.id}" class="perfil-proyecto-card perfil-proyecto-card--${color}">
            <div class="perfil-proyecto-top">
              <span class="perfil-proyecto-anio">${p.anio || ''}</span>
              <span class="proy-estado ${estadoClass}">${p.estado || 'En curso'}</span>
            </div>
            <div class="perfil-proyecto-linea-row">
              <span class="perfil-proy-linea-tag perfil-proy-linea-tag--${color}">
                <span class="linea-dot"></span>${p.area_nombre || 'Línea de Investigación'}
              </span>
            </div>
            <h3 class="perfil-proyecto-titulo">${p.titulo}</h3>
            <div class="perfil-proyecto-action">
              <span class="perfil-proyecto-flecha"><i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        `;
      }).join('');
    } else {
      proyectosEl.innerHTML = '<p class="perfil-empty">Sin proyectos registrados actualmente.</p>';
    }
  }

  // Contacto
  const contactoEl = document.getElementById('perfil-contacto');
  if (contactoEl && m.contacto) {
    let links = '';
    if (m.contacto.email) {
      links += `<a href="mailto:${m.contacto.email}" class="perfil-contacto-btn" id="btn-email">
        <i class="fa-solid fa-envelope"></i> ${m.contacto.email}
      </a>`;
    }
    if (m.contacto.linkedin) {
      links += `<a href="${m.contacto.linkedin}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" id="btn-linkedin">
        <i class="fa-brands fa-linkedin"></i> LinkedIn
      </a>`;
    }
    if (m.contacto.orcid) {
      links += `<a href="${m.contacto.orcid}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" id="btn-orcid">
        <i class="fa-solid fa-graduation-cap"></i> ORCID
      </a>`;
    }
    contactoEl.innerHTML = links || '<p class="perfil-empty">Información de contacto no disponible.</p>';
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
