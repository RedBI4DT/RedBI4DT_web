/**
 * scripts/quienes.js
 * Integración de OpenTopoMap con Panel Lateral Desplegable
 * Puntos limpios en el mapa, rueda de zoom activa y botón de reinicio de vista.
 */

document.addEventListener('DOMContentLoaded', () => {
  initOpenTopoMap();
});

function initOpenTopoMap() {
  const mapElement = document.getElementById('map-opentopo');
  const sidebarElement = document.getElementById('map-sidebar');
  const resetBtn = document.getElementById('btn-reset-map');

  if (!mapElement || typeof L === 'undefined') return;

  // 1. Datos de los 4 Nodos: Instituciones exclusivas (Sin nombres de personas)
  const NODOS = {
    lima: {
      id: 'lima',
      ciudad: 'Lima',
      pais: 'Perú',
      bandera: '🇵🇪',
      coords: [-12.0464, -77.0428],
      color: '#f59e0b',
      rol: 'Sede Principal',
      instituciones: [
        'Universidad Científica del Sur',
        'Universidad Nacional Mayor de San Marcos (UNMSM)',
        'Instituto Nacional de Salud (INS)',
        'Procesa Lab S.A.C.',
        'Universidad Ricardo Palma (URP)'
      ]
    },
    arequipa: {
      id: 'arequipa',
      ciudad: 'Arequipa',
      pais: 'Perú',
      bandera: '🇵🇪',
      coords: [-16.4090, -71.5375],
      color: '#10b981',
      rol: 'Nodo Sur',
      instituciones: [
        'Universidad Católica San Pablo (UCSP)'
      ]
    },
    quito: {
      id: 'quito',
      ciudad: 'Quito',
      pais: 'Ecuador',
      bandera: '🇪🇨',
      coords: [-0.1807, -78.4678],
      color: '#0284c7',
      rol: 'Nodo Internacional',
      instituciones: [
        'Universidad San Francisco de Quito (USFQ)'
      ]
    },
    tucson: {
      id: 'tucson',
      ciudad: 'Tucson, Arizona',
      pais: 'Estados Unidos',
      bandera: '🇺🇸',
      coords: [32.2226, -110.9747],
      color: '#6366f1',
      rol: 'Nodo Internacional',
      instituciones: [
        'The University of Arizona'
      ]
    }
  };

  // 2. Inicialización de Leaflet con zoom por rueda habilitado y controles de zoom (+ / -)
  const map = L.map('map-opentopo', {
    scrollWheelZoom: true, // Rueda del mouse habilitada
    zoomControl: true,     // Botones de zoom visibles
    minZoom: 2,
    maxZoom: 17
  });

  // Mover el control de zoom para que quede ordenado en la esquina superior izquierda
  map.zoomControl.setPosition('topleft');

  // 3. Capa de teselas oficial de OpenTopoMap
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org" target="_blank" rel="noopener">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC-BY-SA</a>)'
  }).addTo(map);

  // 4. Marcadores tipo Punto (Sin etiquetas de texto sobre el mapa)
  const markers = {};
  const allCoords = [];

  Object.keys(NODOS).forEach((key) => {
    const nodo = NODOS[key];
    allCoords.push(nodo.coords);

    const pointIcon = L.divIcon({
      className: 'topo-marker-clean',
      html: `
        <div class="topo-dot-wrapper" data-node="${nodo.id}">
          <div class="topo-dot-beacon" style="border-color: ${nodo.color}; background: ${nodo.color}33;"></div>
          <div class="topo-dot-core" style="background: ${nodo.color};"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(nodo.coords, { icon: pointIcon }).addTo(map);

    // Al hacer clic: levantar el panel lateral al costado sin zoom brusco
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      activarNodo(nodo.id);
    });

    markers[key] = marker;
  });

  // 5. Arcos de cooperación en red (Polylines sutiles entre Lima y los demás nodos)
  const redConnections = [
    [NODOS.lima.coords, NODOS.tucson.coords],
    [NODOS.lima.coords, NODOS.quito.coords],
    [NODOS.lima.coords, NODOS.arequipa.coords]
  ];

  redConnections.forEach(lineCoords => {
    L.polyline(lineCoords, {
      color: '#0284c7',
      weight: 2,
      opacity: 0.6,
      dashArray: '6, 8',
      lineCap: 'round'
    }).addTo(map);
  });

  // 6. Encuadre inicial del mapa
  const initialBounds = L.latLngBounds(allCoords);
  map.fitBounds(initialBounds, {
    padding: [60, 60],
    maxZoom: 4
  });

  // 7. Lógica del Panel Lateral
  function activarNodo(nodoId) {
    const nodo = NODOS[nodoId];
    if (!nodo || !sidebarElement) return;

    // Resaltar visualmente el punto activo
    document.querySelectorAll('.topo-dot-wrapper').forEach(el => {
      if (el.getAttribute('data-node') === nodoId) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });

    // Inyectar el menú lateral con las instituciones
    sidebarElement.innerHTML = `
      <div class="map-sidebar-inner">
        <button class="map-sidebar-close" id="btn-close-sidebar" aria-label="Cerrar menú lateral">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="map-sidebar-header" style="border-left: 4px solid ${nodo.color};">
          <div class="map-sidebar-flag-row">
            <span class="map-sidebar-flag">${nodo.bandera}</span>
            <span class="map-sidebar-badge">${nodo.rol}</span>
          </div>
          <h3 class="map-sidebar-title">${nodo.ciudad}, ${nodo.pais}</h3>
        </div>

        <div class="map-sidebar-body">
          <span class="map-sidebar-section-title">
            <i class="fa-solid fa-building-columns"></i> Instituciones Afiliadas (${nodo.instituciones.length})
          </span>
          <ul class="map-sidebar-institutions">
            ${nodo.instituciones.map(inst => `
              <li>
                <i class="fa-solid fa-shield-halved"></i>
                <span>${inst}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    sidebarElement.classList.add('is-open');

    // Botón de cerrar del panel
    const closeBtn = document.getElementById('btn-close-sidebar');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cerrarPanelLateral();
      });
    }
  }

  function cerrarPanelLateral() {
    if (sidebarElement) {
      sidebarElement.classList.remove('is-open');
    }
    document.querySelectorAll('.topo-dot-wrapper').forEach(el => {
      el.classList.remove('is-active');
    });
  }

  // Cerrar panel lateral al hacer clic en un área vacía del mapa
  map.on('click', () => {
    cerrarPanelLateral();
  });

  // 8. Botón de Reiniciar Vista del Mapa
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cerrarPanelLateral();
      map.fitBounds(initialBounds, {
        padding: [60, 60],
        maxZoom: 4
      });
    });
  }
}
