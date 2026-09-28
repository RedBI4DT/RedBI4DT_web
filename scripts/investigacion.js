/**
 * scripts/investigacion.js
 * Carga dinámica del perfil de investigador/gestor desde miembros.json
 * Aplica para: Equipo de Investigación y Gestión y Articulación Productiva
 */

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
    const response = await fetch(`${base}assets/data/miembros.json`);
    if (!response.ok) throw new Error('No se pudo cargar el archivo de datos.');
    const datos = await response.json();

    // Buscar en la categoría indicada o en ambas
    let miembro = null;
    if (datos[categoria]) {
      miembro = datos[categoria].find(m => m.id === id);
    }
    // Fallback: buscar en investigadores y gestion
    if (!miembro) {
      miembro = [...(datos.investigadores || []), ...(datos.gestion || [])].find(m => m.id === id);
    }

    if (!miembro) {
      mostrarError('Investigador no encontrado.');
      return;
    }

    renderPerfil(miembro, categoria);

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError('Ocurrió un error al cargar el perfil.');
  }
});

function renderPerfil(m, categoria) {
  // Etiqueta de categoría
  const labelEl = document.getElementById('perfil-categoria');
  if (labelEl) {
    labelEl.textContent = categoria === 'gestion'
      ? 'GESTIÓN Y ARTICULACIÓN PRODUCTIVA'
      : 'EQUIPO DE INVESTIGACIÓN';
  }

  // Foto
  const fotoEl = document.getElementById('perfil-foto');
  if (fotoEl && m.foto) fotoEl.src = m.foto;

  // Datos básicos
  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-cargo', m.cargo);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', m.descripcion);

  // Líneas de investigación
  const lineasEl = document.getElementById('perfil-lineas');
  if (lineasEl && m.lineas) {
    lineasEl.innerHTML = m.lineas.map(l =>
      `<li class="perfil-linea-item"><i class="fa-solid fa-chevron-right"></i> ${l}</li>`
    ).join('');
  }

  // Proyectos
  const proyectosEl = document.getElementById('perfil-proyectos');
  if (proyectosEl && m.proyectos && m.proyectos.length > 0) {
    proyectosEl.innerHTML = m.proyectos.map(p => `
      <div class="perfil-proyecto-card">
        <div class="perfil-proyecto-anio">${p.anio || ''}</div>
        <h3 class="perfil-proyecto-titulo">${p.titulo}</h3>
        <p class="perfil-proyecto-desc">${p.descripcion}</p>
      </div>
    `).join('');
  } else if (proyectosEl) {
    proyectosEl.innerHTML = '<p class="perfil-empty">Sin proyectos registrados.</p>';
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
      links += `<a href="${m.contacto.linkedin}" target="_blank" rel="noopener" class="perfil-contacto-btn" id="btn-linkedin">
        <i class="fa-brands fa-linkedin"></i> LinkedIn
      </a>`;
    }
    if (m.contacto.orcid) {
      links += `<a href="${m.contacto.orcid}" target="_blank" rel="noopener" class="perfil-contacto-btn" id="btn-orcid">
        <i class="fa-brands fa-orcid"></i> ORCID
      </a>`;
    }
    contactoEl.innerHTML = links;
  }

  // Actualizar título de pestaña
  document.title = `${m.nombre} - Red BI4DT`;
}

function setTexto(id, texto) {
  const el = document.getElementById(id);
  if (el && texto) el.textContent = texto;
}

function mostrarError(msg) {
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `<div class="perfil-error"><i class="fa-solid fa-circle-exclamation"></i><p>${msg}</p><a href="equipo.html" class="perfil-contacto-btn">Volver al equipo</a></div>`;
  }
}
