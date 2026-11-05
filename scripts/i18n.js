/**
 * scripts/i18n.js
 * Motor de traducción e internacionalización para Red BI4DT
 * 
 * Idiomas soportados: ES (Español - Default) | EN (English)
 * Archivos de recursos: assets/language/{lang}.json
 */

(function () {
  const SUPPORTED_LANGS = ['es', 'en'];
  const DEFAULT_LANG    = 'es';

  function getLocalesBase() {
    const isSubdir = window.location.pathname.includes('/pages/');
    return isSubdir ? '../assets/language' : './assets/language';
  }

  let currentLang  = DEFAULT_LANG;
  let translations = {};

  function detectLang() {
    try {
      const saved = localStorage.getItem('i18n_lang');
      if (saved && SUPPORTED_LANGS.includes(saved.toLowerCase())) {
        return saved.toLowerCase();
      }
    } catch (e) {
      console.warn('[i18n] Error accediendo a localStorage:', e);
    }
    return DEFAULT_LANG;
  }

  async function loadTranslations(lang) {
    const base = getLocalesBase();
    const url = `${base}/${lang}.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn(`[i18n] No se pudo cargar ${lang}.json desde ${url}, usando idioma por defecto.`, e);
      if (lang !== DEFAULT_LANG) {
        try {
          const fallback = await fetch(`${base}/${DEFAULT_LANG}.json`);
          if (fallback.ok) return await fallback.json();
        } catch (err) {
          console.error('[i18n] Falló también la carga del idioma por defecto:', err);
        }
      }
      return {};
    }
  }

  function resolve(key, depth = 0) {
    if (!key || depth > 10) return key;

    // Buscar la clave directamente
    if (translations[key] !== undefined) {
      const val = translations[key];
      if (typeof val === 'string' && val.includes('.') && !val.includes(' ')) {
        const resolved = resolve(val, depth + 1);
        if (resolved !== val) return resolved;
      }
      return val;
    }

    // Navegar la estructura de objetos por notación de punto (ej: "nav.inicio")
    const nested = key.split('.').reduce((obj, k) => obj?.[k], translations);
    if (nested !== undefined && nested !== null) {
      if (typeof nested === 'string' && nested.includes('.') && !nested.includes(' ')) {
        const resolved = resolve(nested, depth + 1);
        if (resolved !== val) return resolved;
      }
      return nested;
    }

    return null;
  }

  function applyTranslations() {
    // 1. Textos directos
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = resolve(key);
      if (val !== null && val !== undefined) {
        if (el.children.length === 0) {
          el.textContent = val;
        } else {
          // Si tiene hijos (como iconos <i> o badges), actualizar solo el nodo de texto
          const textNode = [...el.childNodes].find(
            n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
          );
          if (textNode) {
            textNode.textContent = val;
          } else {
            el.textContent = val;
          }
        }
      }
    });

    // 2. Atributos especiales
    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach(el => {
        const key = el.getAttribute(`data-i18n-${attr}`);
        const val = resolve(key);
        if (val !== null && val !== undefined) {
          el.setAttribute(attr, val);
        }
      });
    });

    // 3. Actualizar elementos de la interfaz de idiomas (Navbar)
    const labelIndicator = document.getElementById('current-lang-text');
    if (labelIndicator) {
      labelIndicator.textContent = currentLang.toUpperCase();
    }

    document.querySelectorAll('[data-lang]').forEach(btn => {
      const langAttr = (btn.getAttribute('data-lang') || '').toLowerCase();
      const isActive = langAttr === currentLang;
      btn.classList.toggle('i18n-active', isActive);
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.documentElement.lang = currentLang;
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang } }));
  }

  async function setLang(lang) {
    if (!lang) return;
    const target = lang.toLowerCase();
    if (!SUPPORTED_LANGS.includes(target)) {
      console.warn(`[i18n] Idioma no soportado: ${lang}`);
      return;
    }
    currentLang = target;
    try {
      localStorage.setItem('i18n_lang', target);
    } catch (e) {
      console.warn('[i18n] Error guardando preferencia en localStorage:', e);
    }
    translations = await loadTranslations(target);
    applyTranslations();
  }

  async function init() {
    currentLang = detectLang();
    translations = await loadTranslations(currentLang);
    applyTranslations();

    // Event delegation para botones de cambio de idioma
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      if (btn) {
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang) {
          setLang(targetLang);
        }
      }
    });
  }

  window.i18n = {
    setLang,
    reapply: applyTranslations,
    getCurrentLang: () => currentLang,
    t: resolve
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

