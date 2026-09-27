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
  // Foto
  const fotoEl = document.getElementById('perfil-foto');
  if (fotoEl && m.foto) fotoEl.src = m.foto;

  // Datos básicos
  setTexto('perfil-nombre', m.nombre);
  setTexto('perfil-cargo', m.cargo);
  setTexto('perfil-institucion', m.institucion);
  setTexto('perfil-descripcion', m.descripcion);

  // Líneas de interés
  const lineasEl = document.getElementById('perfil-lineas');
  if (lineasEl && m.lineas) {
    lineasEl.innerHTML = m.lineas.map(l =>
      `<li class="perfil-linea-item"><i class="fa-solid fa-chevron-right"></i> ${l}</li>`
    ).join('');
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
