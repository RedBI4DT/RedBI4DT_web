/**
 * ============================================================================
 * Red BI4DT - Módulo de Publicaciones / Noticias de LinkedIn
 * ============================================================================
 * 
 * GUÍA PARA AGREGAR O EDITAR PUBLICACIONES:
 * 1. Abre el archivo `data/publicaciones.json`.
 * 2. Para modificar una publicación existente, edita sus campos (titulo, autor,
 *    fecha, area, areaLabel, linkedinEmbed, linkedinUrl, altoEmbed).
 * 3. Para agregar una nueva, añade un nuevo objeto al arreglo JSON manteniendo
 *    la misma estructura.
 * 4. Si dejas algún campo como "TODO" o vacío (""), el sistema lo ocultará
 *    automáticamente para mantener una presentación limpia.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarPublicaciones();
});

/**
 * Función principal que orquesta la carga y renderizado de publicaciones
 */
async function inicializarPublicaciones() {
  const contenedorGrid = document.getElementById('publicaciones-grid');
  const contenedorError = document.getElementById('publicaciones-error');

  if (!contenedorGrid) {
    return;
  }

  if (contenedorError) {
    contenedorError.hidden = true;
  }

  try {
    const publicaciones = await cargarPublicacionesDesdeJson();
    renderizarPublicaciones(publicaciones, contenedorGrid);
  } catch (error) {
    console.error('Error al cargar publicaciones de LinkedIn:', error);
    if (contenedorError) {
      contenedorError.hidden = false;
    }
  }
}

/**
 * Realiza la petición fetch hacia el archivo JSON de datos
 * Intenta cargar desde 'data/publicaciones.json' o 'assets/data/publicaciones.json'
 */
async function cargarPublicacionesDesdeJson() {
  const rutasPosibles = [
    'data/publicaciones.json',
    'assets/data/publicaciones.json'
  ];

  for (const ruta of rutasPosibles) {
    try {
      const respuesta = await fetch(ruta);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        return datos;
      }
    } catch (e) {
      // Continuar con la siguiente ruta si falla
    }
  }

  throw new Error('No se pudo encontrar el archivo de publicaciones.json en las rutas especificadas.');
}

/**
 * Valida si un campo tiene valor útil (es decir, no es nulo, no está vacío y no es un marcador "TODO")
 */
function esCampoValido(valor) {
  if (valor === null || valor === undefined) {
    return false;
  }

  if (typeof valor === 'string') {
    const valorLimpio = valor.trim();
    if (valorLimpio === '' || valorLimpio.toUpperCase().startsWith('TODO') || valorLimpio.includes('|')) {
      return false;
    }
  }

  return true;
}

/**
 * Formatea una fecha en formato YYYY-MM-DD al español (ejemplo: "12 mar 2026")
 */
function formatearFechaEspanol(fechaStr) {
  if (!esCampoValido(fechaStr)) {
    return '';
  }

  // Parsear formato YYYY-MM-DD evitando desfases de huso horario
  const partes = fechaStr.split('-');
  if (partes.length === 3) {
    const anio = parseInt(partes[0], 10);
    const mesIndex = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);

    const nombresMeses = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    if (mesIndex >= 0 && mesIndex < 12 && !isNaN(dia) && !isNaN(anio)) {
      return `${dia} ${nombresMeses[mesIndex]} ${anio}`;
    }
  }

  // Fallback para fechas con otros formatos estándar
  const fechaObj = new Date(fechaStr);
  if (!isNaN(fechaObj.getTime())) {
    const dia = fechaObj.getDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[fechaObj.getMonth()];
    const anio = fechaObj.getFullYear();
    return `${dia} ${mes} ${anio}`;
  }

  return fechaStr;
}

/**
 * Determina el nombre de clase CSS normalizado según el área indicada
 */
function normalizarClaseArea(area) {
  if (!esCampoValido(area)) {
    return 'dorado';
  }

  const areaNormalizada = area.toLowerCase().trim();

  if (areaNormalizada.includes('indigo') || areaNormalizada.includes('índigo')) {
    return 'indigo';
  }
  if (areaNormalizada.includes('esmeralda') || areaNormalizada.includes('emerald')) {
    return 'esmeralda';
  }
  return 'dorado';
}

/**
 * Construye el elemento HTML de una tarjeta individual de publicación
 */
function crearElementoTarjetaPublicacion(publicacion, indice) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'publicacion-card';

  // Asignar clase de color del área para el borde izquierdo
  const claseColorArea = normalizarClaseArea(publicacion.area);
  tarjeta.classList.add(`publicacion-card--${claseColorArea}`);

  // 1. Badge de área (si tiene etiqueta válida)
  let badgeHtml = '';
  if (esCampoValido(publicacion.areaLabel)) {
    badgeHtml = `
      <div class="publicacion-badge-wrapper">
        <span class="publicacion-badge publicacion-badge--${claseColorArea}">
          ${publicacion.areaLabel}
        </span>
      </div>
    `;
  }

  // 2. Título de la publicación (h3 por tarjeta)
  let tituloHtml = '';
  if (esCampoValido(publicacion.titulo)) {
    tituloHtml = `<h3 class="publicacion-card-titulo">${publicacion.titulo}</h3>`;
  }

  // 3. Metadatos: Autor y Fecha
  const autorValido = esCampoValido(publicacion.autor);
  const fechaValida = esCampoValido(publicacion.fecha);
  const fechaFormateada = formatearFechaEspanol(publicacion.fecha);

  let metaHtml = '';
  if (autorValido || fechaValida) {
    metaHtml = '<div class="publicacion-meta">';
    
    if (autorValido) {
      metaHtml += `
        <span class="publicacion-autor">
          <i class="fa-solid fa-user-pen" aria-hidden="true"></i>
          <span>${publicacion.autor}</span>
        </span>
      `;
    }

    if (autorValido && fechaValida && fechaFormateada) {
      metaHtml += '<span class="publicacion-meta-separador">•</span>';
    }

    if (fechaValida && fechaFormateada) {
      metaHtml += `
        <time class="publicacion-fecha" datetime="${publicacion.fecha}">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>
          <span>${fechaFormateada}</span>
        </time>
      `;
    }

    metaHtml += '</div>';
  }

  // 4. Iframe de LinkedIn Embed
  let iframeHtml = '';
  if (esCampoValido(publicacion.linkedinEmbed)) {
    const alto = publicacion.altoEmbed && Number(publicacion.altoEmbed) > 0 
      ? Number(publicacion.altoEmbed) 
      : 550;
    
    const tituloIframe = esCampoValido(publicacion.titulo) 
      ? `Publicación de LinkedIn: ${publicacion.titulo}` 
      : `Publicación de LinkedIn #${indice + 1}`;

    iframeHtml = `
      <div class="publicacion-embed-container" style="min-height: ${Math.min(alto, 400)}px;">
        <iframe 
          src="${publicacion.linkedinEmbed}" 
          height="${alto}" 
          width="100%" 
          frameborder="0" 
          allowfullscreen="" 
          title="${tituloIframe}"
          loading="lazy"
          class="publicacion-iframe">
        </iframe>
      </div>
    `;
  }

  // 5. Enlace "Leer más →" hacia la publicación original
  let linkHtml = '';
  if (esCampoValido(publicacion.linkedinUrl)) {
    linkHtml = `
      <div class="publicacion-footer">
        <a 
          href="${publicacion.linkedinUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="publicacion-link-mas"
          aria-label="Leer publicación completa en LinkedIn">
          <span>Leer más</span>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    `;
  }

  // Ensamblaje de la tarjeta
  tarjeta.innerHTML = `
    <div class="publicacion-card-header">
      ${badgeHtml}
      ${tituloHtml}
      ${metaHtml}
    </div>
    ${iframeHtml}
    ${linkHtml}
  `;

  return tarjeta;
}

/**
 * Renderiza el conjunto de publicaciones en el contenedor grid
 */
function renderizarPublicaciones(publicaciones, contenedor) {
  contenedor.innerHTML = '';

  if (!Array.isArray(publicaciones) || publicaciones.length === 0) {
    contenedor.innerHTML = '<p class="publicaciones-vacio">No hay publicaciones disponibles en este momento.</p>';
    return;
  }

  publicaciones.forEach((publicacion, indice) => {
    const elementoTarjeta = crearElementoTarjetaPublicacion(publicacion, indice);
    contenedor.appendChild(elementoTarjeta);
  });
}
