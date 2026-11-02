/**
 * scripts/estudiante.js
 * Carga dinámica del perfil de estudiante/colaborador desde miembros.json
 * Aplica para: Estudiantes y Colaboradores (sin sección de proyectos)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarError('No se especificó un perfil.');
    return;
  }

  try {
    const base = window.location.pathname.includes('/pages/') ? '../' : './';
    const response = await fetch(`${base}assets/data/miembros.json`);
    if (!response.ok) throw new Error('No se pudo cargar el archivo de datos.');
    const datos = await response.json();

    const miembro = (datos.estudiantes || []).find(m => m.id === id);

    if (!miembro) {
      mostrarError('Perfil no encontrado.');
      return;
    }

    renderPerfil(miembro);

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError('Ocurrió un error al cargar el perfil.');
  }
});

function renderPerfil(m) {
  // Validación de longitud estricta de descripción (≤ 150 caracteres)
  if (m.descripcion && m.descripcion.length > 150) {
    console.warn(`[Red BI4DT] Advertencia: La descripción de "${m.nombre}" supera los 150 caracteres (${m.descripcion.length} caracteres).`);
  }

  // Foto
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

  // Líneas de interés (Columna 3 - List Bullet)
  const lineasEl = document.getElementById('perfil-lineas');
  if (lineasEl && Array.isArray(m.lineas) && m.lineas.length > 0) {
    lineasEl.innerHTML = m.lineas.map(l =>
      `<li><span class="perfil-linea-link-text">${l}</span></li>`
    ).join('');
  } else if (lineasEl) {
    lineasEl.innerHTML = '';
  }

  // Contacto (Solo logos/íconos, tamaño uniforme 36px, sin texto visible)
  const contactoEl = document.getElementById('perfil-contacto');
  if (contactoEl && m.contacto) {
    let links = '';
    if (m.contacto.email) {
      links += `<a href="mailto:${m.contacto.email}" class="perfil-contacto-btn" aria-label="Correo electrónico de ${m.nombre}">
        <i class="fa-solid fa-envelope"></i>
      </a>`;
    }
    if (m.contacto.linkedin) {
      links += `<a href="${m.contacto.linkedin}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" aria-label="LinkedIn de ${m.nombre}">
        <i class="fa-brands fa-linkedin"></i>
      </a>`;
    }
    if (m.contacto.orcid) {
      links += `<a href="${m.contacto.orcid}" target="_blank" rel="noopener noreferrer" class="perfil-contacto-btn" aria-label="ORCID de ${m.nombre}">
        <i class="fa-brands fa-orcid"></i>
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
