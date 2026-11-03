/**
 * scripts/quienes.js
 * Fase 3 - Mapa de la Red BI4DT
 * - Capa plana monocromática neutral con OpenStreetMap + filtro CSS
 * - Nodos y cartillas agrupados estrictamente por PAÍS (Perú, Ecuador, Estados Unidos)
 * - Color único celeste institucional (--color-celeste-network: #38bdf8)
 * - Conexión de red entre nodos con polilíneas estilo red de datos
 * - Panel lateral sin íconos decorativos
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initNetworkMap();
});

async function initNetworkMap() {
  const mapElement = document.getElementById('map-opentopo');
  const sidebarElement = document.getElementById('map-sidebar');
  const resetBtn = document.getElementById('btn-reset-map');

  if (!mapElement || typeof L === 'undefined') return;

  const COLOR_CELESTE = '#38bdf8';
  const COLOR_HALO = 'rgba(56, 189, 248, 0.32)';

  // 1. Cargar dinámicamente instituciones desde assets/data/instituciones.json
  const base = window.location.pathname.includes('/pages/') ? '../' : './';
  let institucionesData = [];
  try {
    const res = await fetch(`${base}assets/data/instituciones.json`);
    if (res.ok) {
      const data = await res.json();
      institucionesData = data.instituciones || [];
    }
  } catch (err) {
    console.warn('Usando configuración fallback de instituciones para mapa:', err);
  }

  const PAISES_RED = {
    peru: {
      id: 'peru',
      pais: 'Perú',
      puntos: [
        { nombre: 'Lima (Sede Principal)', coords: [-12.0464, -77.0428], isMain: true },
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'peru').map(i => i.nombre_completo || i.nombre)
    },
    ecuador: {
      id: 'ecuador',
      pais: 'Ecuador',
      bandera: '🇪🇨',
      rol: 'Nodo Internacional',
      puntos: [
        { nombre: 'Quito', coords: [-0.1807, -78.4678], isMain: false }
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'ecuador').map(i => i.nombre_completo || i.nombre)
    },
    usa: {
      id: 'usa',
      pais: 'Estados Unidos',
      bandera: '🇺🇸',
      rol: 'Nodo Internacional',
      puntos: [
        { nombre: 'Tucson, Arizona', coords: [32.2226, -110.9747], isMain: false }
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'usa').map(i => i.nombre_completo || i.nombre)
    }
  };

  // Fallback de contingencia si no se pudo cargar el JSON
  if (PAISES_RED.peru.instituciones.length === 0) {
    PAISES_RED.peru.instituciones = [
      'Universidad Científica del Sur (UCSUR)',
      'Universidad Nacional Mayor de San Marcos (UNMSM)',
      'Instituto Nacional de Salud (INS)',
      'Universidad Católica San Pablo (UCSP)',
      'Procesa Lab S.A.C.',
      'Universidad Ricardo Palma (URP)'
    ];
  }
  if (PAISES_RED.ecuador.instituciones.length === 0) {
    PAISES_RED.ecuador.instituciones = ['Universidad San Francisco de Quito (USFQ)'];
  }
  if (PAISES_RED.usa.instituciones.length === 0) {
    PAISES_RED.usa.instituciones = ['The University of Arizona'];
  };

  // 2. Inicialización de Leaflet
  const map = L.map('map-opentopo', {
    scrollWheelZoom: true,
    zoomControl: true,
    minZoom: 2,
    maxZoom: 18
  });

  map.zoomControl.setPosition('topleft');

  // 3. Capa de teselas OpenStreetMap (estilizada monocromática con CSS en styles/quienes.css)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  // 4. Marcadores celestes en el mapa
  const allCoords = [];
  const coordsMap = {
    lima: [-12.0464, -77.0428],
    arequipa: [-16.4090, -71.5375],
    quito: [-0.1807, -78.4678],
    tucson: [32.2226, -110.9747]
  };

  Object.keys(PAISES_RED).forEach((paisKey) => {
    const paisData = PAISES_RED[paisKey];

    paisData.puntos.forEach((punto) => {
      allCoords.push(punto.coords);

      const wrapperSize = punto.isMain ? 34 : 26;
      const coreSize = punto.isMain ? 14 : 10;
      const beaconSize = punto.isMain ? 36 : 28;

      const pointIcon = L.divIcon({
        className: 'topo-marker-clean',
        html: `
          <div class="topo-dot-wrapper ${punto.isMain ? 'topo-dot--large' : 'topo-dot--regular'}" data-pais="${paisData.id}" style="width: ${wrapperSize}px; height: ${wrapperSize}px;">
            <div class="topo-dot-beacon" style="width: ${beaconSize}px; height: ${beaconSize}px; margin-top: -${beaconSize / 2}px; margin-left: -${beaconSize / 2}px; border-color: ${COLOR_CELESTE}; background: ${COLOR_HALO};"></div>
            <div class="topo-dot-core" style="width: ${coreSize}px; height: ${coreSize}px; background: ${COLOR_CELESTE};"></div>
          </div>
        `,
        iconSize: [wrapperSize, wrapperSize],
        iconAnchor: [wrapperSize / 2, wrapperSize / 2]
      });

      const marker = L.marker(punto.coords, { icon: pointIcon }).addTo(map);

      // Al hacer clic en cualquier punto del país, se despliega la cartilla de ese país
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        activarCartillaPais(paisData.id);
      });
    });
  });

  // 5. Conexiones de Red entre los nodos (Líneas celestes continuas / punteadas)
  const networkLines = [
    [coordsMap.lima], // Red Nacional Perú
    [coordsMap.lima, coordsMap.quito],    // Conexión Perú - Ecuador
    [coordsMap.lima, coordsMap.tucson]    // Conexión Perú - Estados Unidos
  ];

  networkLines.forEach((lineCoords) => {
    L.polyline(lineCoords, {
      color: COLOR_CELESTE,
      weight: 2,
      opacity: 0.7,
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

  // 7. Lógica de la Cartilla Lateral agrupada por PAÍS
  function activarCartillaPais(paisId) {
    const pais = PAISES_RED[paisId];
    if (!pais || !sidebarElement) return;

    // Resaltar visualmente todos los puntos pertenecientes a este país
    document.querySelectorAll('.topo-dot-wrapper').forEach(el => {
      if (el.getAttribute('data-pais') === paisId) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });

    // Inyectar cartilla agrupada por PAÍS con acento celeste uniforme
    sidebarElement.innerHTML = `
      <div class="map-sidebar-inner">
        <button class="map-sidebar-close" id="btn-close-sidebar" aria-label="Cerrar panel institucional">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="map-sidebar-header" style="border-left: 3px solid ${COLOR_CELESTE};">
          <h3 class="map-sidebar-title">${pais.pais}</h3>
        </div>

        <div class="map-sidebar-body">
          <span class="map-sidebar-section-title">
            Instituciones de la Red en ${pais.pais} (${pais.instituciones.length})
          </span>
          <ul class="map-sidebar-institutions">
            ${pais.instituciones.map(inst => `
              <li>
                <span class="institution-name">${inst}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    sidebarElement.classList.add('is-open');

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

  map.on('click', () => {
    cerrarPanelLateral();
  });

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
