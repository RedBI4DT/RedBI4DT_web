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
  initMomentosCarousel();
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
      pais_en: 'Peru',
      puntos: [
        { nombre: 'Lima (Sede Principal)', coords: [-12.0464, -77.0428], isMain: true },
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'peru').map(i => i.nombre_completo || i.nombre)
    },
    ecuador: {
      id: 'ecuador',
      pais: 'Ecuador',
      pais_en: 'Ecuador',
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
      pais_en: 'United States',
      bandera: '🇺🇸',
      rol: 'Nodo Internacional',
      puntos: [
        { nombre: 'Tucson, Arizona', coords: [32.2226, -110.9747], isMain: false }
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'usa').map(i => i.nombre_completo || i.nombre)
    },
    japon: {
      id: 'japon',
      pais: 'Japón',
      pais_en: 'Japan',
      bandera: '🇯🇵',
      rol: 'Nodo Internacional',
      puntos: [
        { nombre: 'Kioto', coords: [34.9856, -224.2416], isMain: false }
      ],
      instituciones: institucionesData.filter(i => i.pais_id === 'japon').map(i => i.nombre_completo || i.nombre)
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
      'Universidad Ricardo Palma (URP)',
      'Universidad San Ignacio de Loyola (USIL)',
      'Digital Health'
    ];
  }
  if (PAISES_RED.ecuador.instituciones.length === 0) {
    PAISES_RED.ecuador.instituciones = ['Universidad San Francisco de Quito (USFQ)'];
  }
  if (PAISES_RED.usa.instituciones.length === 0) {
    PAISES_RED.usa.instituciones = ['The University of Arizona'];
  }
  if (PAISES_RED.japon.instituciones.length === 0) {
    PAISES_RED.japon.instituciones = [
      'The Kyoto College of Graduate Studies for Informatics (KCGI)',
      'Niigata University'
    ];
  };

  // 2. Inicialización de Leaflet
  const map = L.map('map-opentopo', {
    scrollWheelZoom: true,
    zoomControl: true,
    minZoom: 1,
    zoomSnap: 0.1,
    maxZoom: 18
  });

  map.zoomControl.setPosition('topleft');

  // 3. Capa de teselas OpenStreetMap Standard limpia sin filtros
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
    tucson: [32.2226, -110.9747],
    kioto: [34.9856, -224.2416]
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
    [coordsMap.lima],                     // Red Nacional Perú
    [coordsMap.lima, coordsMap.quito],     // Conexión Perú - Ecuador
    [coordsMap.lima, coordsMap.tucson],    // Conexión Perú - Estados Unidos
    [coordsMap.lima, coordsMap.kioto]      // Conexión Transpacífica Perú - Japón
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

  // 6. Encuadre inicial del mapa (Responsivo: transpacífico para móvil y desktop)
  const DESKTOP_CENTER = [12, -148];
  const DESKTOP_ZOOM = 2.5;

  function aplicarVistaInicial() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      map.setMinZoom(1);
      // Límites que encuadran Kioto (-224.24), Tucson (-110.97), Quito (-78.47) y Lima (-77.04)
      const mobileBounds = L.latLngBounds([
        [-20, -238], // SW: sur de Lima y oeste de Kioto
        [42, -66]    // NE: norte de Kioto/Tucson y este de Lima
      ]);
      map.fitBounds(mobileBounds, {
        padding: [12, 12],
        maxZoom: 2
      });
    } else {
      map.setMinZoom(2.2);
      map.setView(DESKTOP_CENTER, DESKTOP_ZOOM);
    }
  }

  aplicarVistaInicial();
  setTimeout(() => {
    map.invalidateSize();
    aplicarVistaInicial();
  }, 150);

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

    const isEn = (window.i18n && typeof window.i18n.getLanguage === 'function' ? window.i18n.getLanguage() === 'en' : localStorage.getItem('i18n_lang') === 'en');
    const displayCountry = isEn ? (pais.pais_en || pais.pais) : pais.pais;
    const sectionTitle = isEn
      ? `Network Institutions in ${displayCountry} (${pais.instituciones.length})`
      : `Instituciones de la Red en ${displayCountry} (${pais.instituciones.length})`;
    const closeAria = isEn ? 'Close institutional panel' : 'Cerrar panel institucional';

    // Inyectar cartilla agrupada por PAÍS con acento celeste uniforme
    sidebarElement.innerHTML = `
      <div class="map-sidebar-inner">
        <button class="map-sidebar-close" id="btn-close-sidebar" aria-label="${closeAria}">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="map-sidebar-header" style="border-left: 3px solid ${COLOR_CELESTE};">
          <h3 class="map-sidebar-title">${displayCountry}</h3>
        </div>

        <div class="map-sidebar-body">
          <span class="map-sidebar-section-title">
            ${sectionTitle}
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
      aplicarVistaInicial();
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      map.invalidateSize();
      aplicarVistaInicial();
    }, 200);
  });
}


/* ==========================================================================
   CARRUSEL MOMENTOS BI4DT (Vanilla JS)
   ========================================================================== */

function initMomentosCarousel() {
  const AUTOPLAY_MS = 5000;
  const slides   = document.querySelectorAll('.carousel-slide');
  const dots     = document.querySelectorAll('.carousel-dot');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const progress = document.getElementById('carousel-progress');
  const section  = document.getElementById('contacto-carousel');

  if (!slides.length) return;

  let current   = 0;
  let timer     = null;
  let progTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active', 'prev');
    slides[current].classList.add('prev');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].classList.remove('prev');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');

    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(timer);
    clearInterval(progTimer);
    timer = null;
  }

  function resetProgress() {
    if (!progress) return;
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        progress.style.width = '100%';
      });
    });
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide, 10));
      startAutoplay();
    });
  });

  if (section) {
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', () => { startAutoplay(); resetProgress(); });
  }

  let touchStartX = 0;
  if (section) {
    section.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    section.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAutoplay(); }
    });
  }

  startAutoplay();
  resetProgress();
}
