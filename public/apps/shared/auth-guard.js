// Ramón Menor - Client-side Access Guard, App Permissions & Mobile Navigation System
(function() {
  const STORAGE_KEY = 'rm_private_access_session';
  const PIN_HASH_KEY = 'rm_master_pin_hash';
  const PERMISSIONS_KEY = 'rm_apps_permissions_override';

  // Default master PIN is '1234' (SHA-256: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4)
  const DEFAULT_PIN_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

  const DEFAULT_APPS = [
    {
      id: "json-formatter",
      title: "Formateador & Validador JSON",
      path: "/apps/json-formatter/",
      icon: "{ }",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      desc: "Valida la sintaxis, embellece con sangría configurable y compacta (minifica) datos JSON en tiempo real sin salir del navegador.",
      tags: ["JSON", "Formateador", "Validador", "Minify"],
      isPrivate: false,
      visible: true
    },
    {
      id: "sql-formatter",
      title: "Formateador SQL",
      path: "/apps/sql-formatter/",
      icon: "SQL",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      desc: "Convierte consultas SQL complejas o desordenadas en código limpio, formateado y con palabras clave en mayúsculas estándar.",
      tags: ["SQL", "Consultas", "Bases de datos", "Limpieza"],
      isPrivate: false,
      visible: true
    },
    {
      id: "hash-uuid",
      title: "Generador de Hashes & UUIDs",
      path: "/apps/hash-uuid/",
      icon: "#",
      color: "bg-purple-50 text-purple-600 border-purple-100",
      desc: "Genera UUIDs v4 en lote, passwords criptográficamente seguros y calcula hashes SHA-256, SHA-512 y SHA-1 al vuelo.",
      tags: ["UUID v4", "SHA-256", "Contraseñas", "WebCrypto"],
      isPrivate: false,
      visible: true
    },
    {
      id: "color-converter",
      title: "Convertidor de Colores & Contraste",
      path: "/apps/color-converter/",
      icon: "🎨",
      color: "bg-pink-50 text-pink-600 border-pink-100",
      desc: "Conversión bidireccional entre HEX, RGB y HSL con calculadora en vivo de ratios de contraste WCAG (AA/AAA).",
      tags: ["HEX", "RGB", "HSL", "WCAG Contrast"],
      isPrivate: false,
      visible: true
    },
    {
      id: "base64-converter",
      title: "Codificador Base64 & URL",
      path: "/apps/base64-converter/",
      icon: "64",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      desc: "Codifica y decodifica texto con soporte UTF-8 completo, además de utilidades directas para URL encoding.",
      tags: ["Base64", "URL Encode", "UTF-8", "String Tools"],
      isPrivate: false,
      visible: true
    },
    {
      id: "notas-privadas",
      title: "Bloc de Notas Privado",
      path: "/apps/notas-privadas/",
      icon: "📝",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      desc: "Bloc de notas rápido y persistente en almacenamiento local. Ideal para borradores, snippets temporales y listas de tareas.",
      tags: ["Privada", "Notas", "LocalStorage", "Borradores"],
      isPrivate: true,
      visible: true
    },
    {
      id: "mis-servidores",
      title: "Mis Servidores & Accesos",
      path: "/apps/mis-servidores/",
      icon: "⚡",
      color: "bg-rose-50 text-rose-600 border-rose-100",
      desc: "Fichero privado de servidores, IPs, accesos SSH habituales y gestor del PIN maestro de acceso.",
      tags: ["Privada", "DevOps", "Servidores", "Seguridad"],
      isPrivate: true,
      visible: true
    },
    {
      id: "dividir-cuenta",
      title: "Dividir Cuenta & Ticket",
      path: "/apps/dividir-cuenta/",
      icon: "🧾",
      color: "bg-teal-50 text-teal-600 border-teal-100",
      desc: "Calcula qué tiene que pagar cada persona en un restaurante según lo que ha pedido o compartido. Genera desglose para WhatsApp y Bizum.",
      tags: ["Restaurante", "Bizum", "Finanzas", "Calculadora"],
      isPrivate: false,
      visible: true
    },
    {
      id: "pomodoro",
      title: "Temporizador Pomodoro",
      path: "/apps/pomodoro/",
      icon: "⏱️",
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
      desc: "Temporizador de enfoque y descansos con bloques personalizables, contador de ciclos y avisos sonoros.",
      tags: ["Productividad", "Pomodoro", "Enfoque", "Tiempo"],
      isPrivate: false,
      visible: true
    },
    {
      id: "habitos",
      title: "Hábitos & Rutinas",
      path: "/apps/habitos/",
      icon: "🎯",
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
      desc: "Seguimiento diario de hábitos y rachas semanales para mantener la constancia en tus rutinas.",
      tags: ["Hábitos", "Rutinas", "Productividad", "Objetivos"],
      isPrivate: false,
      visible: true
    }
  ];

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isUnlocked() {
    return sessionStorage.getItem(STORAGE_KEY) === 'unlocked' || localStorage.getItem(STORAGE_KEY) === 'unlocked';
  }

  function getSavedHash() {
    return localStorage.getItem(PIN_HASH_KEY) || DEFAULT_PIN_HASH;
  }

  function unlockSession(remember) {
    sessionStorage.setItem(STORAGE_KEY, 'unlocked');
    if (remember) {
      localStorage.setItem(STORAGE_KEY, 'unlocked');
    }
  }

  function getOverrides() {
    try {
      const data = localStorage.getItem(PERMISSIONS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveOverrides(overrides) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('rm_apps_config_changed', { detail: overrides }));
  }

  // App Permissions API
  window.RMApps = {
    DEFAULT_APPS,
    getAll: function() {
      const overrides = getOverrides();
      return DEFAULT_APPS.map(app => {
        const custom = overrides[app.id] || {};
        return {
          ...app,
          isPrivate: typeof custom.isPrivate === 'boolean' ? custom.isPrivate : app.isPrivate,
          visible: typeof custom.visible === 'boolean' ? custom.visible : app.visible
        };
      });
    },
    getAppById: function(id) {
      return this.getAll().find(a => a.id === id);
    },
    getCurrentAppId: function() {
      const path = window.location.pathname;
      const match = path.match(/\/apps\/([^\/]+)/);
      return match ? match[1] : null;
    },
    isCurrentAppPrivate: function() {
      const id = this.getCurrentAppId();
      if (!id || id === 'shared') return false;
      if (id === 'panel-control') return true; // Control Panel is ALWAYS protected
      const app = this.getAppById(id);
      return app ? app.isPrivate : false;
    },
    setAppPermission: function(id, isPrivate) {
      const overrides = getOverrides();
      if (!overrides[id]) overrides[id] = {};
      overrides[id].isPrivate = isPrivate;
      saveOverrides(overrides);
    },
    setAppVisibility: function(id, visible) {
      const overrides = getOverrides();
      if (!overrides[id]) overrides[id] = {};
      overrides[id].visible = visible;
      saveOverrides(overrides);
    },
    resetPermissions: function() {
      localStorage.removeItem(PERMISSIONS_KEY);
      window.dispatchEvent(new CustomEvent('rm_apps_config_changed', { detail: {} }));
    },
    exportConfig: function() {
      return JSON.stringify(this.getAll(), null, 2);
    },
    importConfig: function(jsonStr) {
      try {
        const list = JSON.parse(jsonStr);
        const overrides = {};
        if (Array.isArray(list)) {
          list.forEach(item => {
            if (item.id) {
              overrides[item.id] = {
                isPrivate: item.isPrivate,
                visible: item.visible
              };
            }
          });
        } else if (typeof list === 'object') {
          Object.assign(overrides, list);
        }
        saveOverrides(overrides);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  // Access Control API
  window.RMAccess = {
    isUnlocked,
    lock: function() {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    },
    unlockSession,
    sha256,
    changePin: async function(oldPin, newPin) {
      const oldHash = await sha256(oldPin);
      if (oldHash !== getSavedHash()) {
        return { success: false, message: 'El PIN actual es incorrecto.' };
      }
      if (!newPin || newPin.length < 4) {
        return { success: false, message: 'El nuevo PIN debe tener al menos 4 caracteres.' };
      }
      const newHash = await sha256(newPin);
      localStorage.setItem(PIN_HASH_KEY, newHash);
      return { success: true, message: 'PIN maestro actualizado correctamente.' };
    }
  };

  // Setup Mobile-First Header & Navigation Drawer
  function setupMobileNav() {
    const currentId = window.RMApps.getCurrentAppId();
    if (!currentId || currentId === 'shared') return;

    // Ensure app-nav.css is loaded
    if (!document.getElementById('rm-nav-css')) {
      const link = document.createElement('link');
      link.id = 'rm-nav-css';
      link.rel = 'stylesheet';
      link.href = '/apps/shared/app-nav.css';
      document.head.appendChild(link);
    }

    const app = currentId === 'panel-control'
      ? { title: 'Panel de Control', icon: '⚙️', isPrivate: true }
      : window.RMApps.getAppById(currentId) || { title: document.title.split('—')[0].trim(), icon: '⚡', isPrivate: false };

    const isPrivate = currentId === 'panel-control' ? true : window.RMApps.isCurrentAppPrivate();
    const badgeClass = isPrivate ? 'rm-badge-private' : 'rm-badge-public';
    const badgeText = isPrivate ? '🔒 Privada' : 'Pública';

    // Find existing <header> or create one
    let header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      document.body.insertBefore(header, document.body.firstChild);
    }

    header.className = 'rm-app-header';
    header.innerHTML = `
      <div class="rm-header-inner">
        <a href="/" class="rm-back-btn" aria-label="Volver a Inicio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="rm-back-text">Inicio</span>
        </a>

        <div class="rm-title-wrap">
          <span style="font-size: 16px; margin-right: 2px;">${app.icon}</span>
          <h1 class="rm-app-title">${app.title}</h1>
          <span class="rm-app-badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="rm-header-actions">
          <button type="button" class="rm-menu-btn" id="rm-drawer-toggle" aria-label="Menú de aplicaciones">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Apps</span>
          </button>
        </div>
      </div>
    `;

    // Create Drawer Modal if not already present
    if (!document.getElementById('rm-drawer-modal')) {
      const allApps = window.RMApps.getAll();
      const drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'rm-drawer-modal';
      drawerOverlay.className = 'rm-drawer-overlay';

      let appsHtml = '';
      allApps.forEach(item => {
        const isActive = item.id === currentId;
        appsHtml += `
          <a href="${item.path}" class="rm-nav-item ${isActive ? 'active' : ''}">
            <div class="rm-nav-item-left">
              <div class="rm-nav-item-icon">${item.icon}</div>
              <div>
                <div>${item.title}</div>
                <div style="font-size: 11px; font-weight: normal; color: #64748b;">${item.path}</div>
              </div>
            </div>
            <span class="rm-app-badge ${item.isPrivate ? 'rm-badge-private' : 'rm-badge-public'}" style="display: inline-block;">
              ${item.isPrivate ? '🔒 Privada' : 'Pública'}
            </span>
          </a>
        `;
      });

      const unlocked = window.RMAccess.isUnlocked();

      drawerOverlay.innerHTML = `
        <div class="rm-drawer">
          <div class="rm-drawer-handle"></div>
          <div class="rm-drawer-header">
            <div class="rm-drawer-title">Aplicaciones & Utilidades</div>
            <button type="button" class="rm-drawer-close" id="rm-drawer-close-btn" aria-label="Cerrar">✕</button>
          </div>

          <div class="rm-drawer-content">
            <div class="rm-drawer-section-title">Navegación</div>
            <div class="rm-nav-list" style="margin-bottom: 8px;">
              <a href="/" class="rm-nav-item">
                <div class="rm-nav-item-left">
                  <div class="rm-nav-item-icon">🏠</div>
                  <div>Inicio (ramonmenor.es)</div>
                </div>
                <span style="font-size: 12px; color: #64748b;">→</span>
              </a>
              <a href="/apps/panel-control/" class="rm-nav-item ${currentId === 'panel-control' ? 'active' : ''}">
                <div class="rm-nav-item-left">
                  <div class="rm-nav-item-icon">⚙️</div>
                  <div>Panel de Control</div>
                </div>
                <span class="rm-app-badge rm-badge-private" style="display: inline-block;">🔒 Admin</span>
              </a>
              <button type="button" id="rm-drawer-install-btn" class="rm-nav-item" style="width: 100%; border: none; text-align: left; cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8;">
                <div class="rm-nav-item-left">
                  <div class="rm-nav-item-icon" style="background: #dbeafe; border-color: #bfdbfe;">📲</div>
                  <div>Instalar como App</div>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: #2563eb;">Instalar</span>
              </button>
            </div>

            <div class="rm-drawer-section-title">Cambiar de Aplicación</div>
            <div class="rm-nav-list">
              ${appsHtml}
            </div>

            ${unlocked ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
                <button type="button" id="rm-drawer-lock-btn" style="width: 100%; padding: 12px; border-radius: 12px; background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; touch-action: manipulation;">
                  🔒 Bloquear Sesión Privada
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      document.body.appendChild(drawerOverlay);

      const toggleBtn = document.getElementById('rm-drawer-toggle');
      const closeBtn = document.getElementById('rm-drawer-close-btn');
      const lockBtn = document.getElementById('rm-drawer-lock-btn');
      const drawerInstallBtn = document.getElementById('rm-drawer-install-btn');

      function openDrawer() {
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeDrawer() {
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeDrawer();
      });

      if (drawerInstallBtn) {
        drawerInstallBtn.addEventListener('click', async () => {
          if (window.rmPwaPrompt) {
            window.rmPwaPrompt.prompt();
            const { outcome } = await window.rmPwaPrompt.userChoice;
            if (outcome === 'accepted') {
              drawerInstallBtn.style.display = 'none';
            }
            window.rmPwaPrompt = null;
          } else {
            alert('Para instalar esta aplicación en tu dispositivo:\n\n• En iPhone/iPad (Safari): Pulsa el botón "Compartir" y selecciona "Añadir a pantalla de inicio".\n• En Android/Chrome: Pulsa en los tres puntos ⋮ y luego "Instalar aplicación".');
          }
        });
      }

      // Hide install button if already standalone
      if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
        if (drawerInstallBtn) drawerInstallBtn.style.display = 'none';
      }

      if (lockBtn) {
        lockBtn.addEventListener('click', () => {
          window.RMAccess.lock();
        });
      }
    }
  }

  // Determine if the current page should be locked
  const currentAppId = window.RMApps.getCurrentAppId();
  if (!currentAppId) {
    // Not an /apps/ page (e.g. homepage or /cv) - do not lock
    return;
  }

  // Setup mobile navigation on DOM ready
  document.addEventListener('DOMContentLoaded', setupMobileNav);

  // Check if current app is marked private
  const requiresAuth = window.RMApps.isCurrentAppPrivate();
  if (!requiresAuth) {
    return;
  }

  // If already unlocked, allow access
  if (isUnlocked()) {
    return;
  }

  // Otherwise, render access gate barrier
  document.addEventListener('DOMContentLoaded', () => {
    // Double check in case unlocked during load
    if (isUnlocked()) return;

    const gateOverlay = document.createElement('div');
    gateOverlay.id = 'rm-access-gate';
    gateOverlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #ffffff;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 20px;
    `;

    const appName = currentAppId === 'panel-control' ? 'Panel de Control' : (window.RMApps.getAppById(currentAppId)?.title || 'Aplicación Privada');

    gateOverlay.innerHTML = `
      <div style="max-width: 380px; width: 100%; text-align: center; border: 1px solid #e2e8f0; border-radius: 24px; padding: 36px 28px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); background: #ffffff;">
        <div style="width: 52px; height: 52px; border-radius: 16px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; border: 1px solid #dbeafe;">
          🔒
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.02em;">Acceso Protegido</h2>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 20px; line-height: 1.5;">
          <strong>${appName}</strong> está configurada con acceso privado. Introduce tu PIN maestro para acceder.
        </p>
        
        <form id="rm-gate-form" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="password" id="rm-pin-input" placeholder="PIN maestro..." autofocus style="width: 100%; box-sizing: border-box; padding: 12px 14px; font-size: 16px; text-align: center; letter-spacing: 0.25em; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; transition: border-color 0.2s;" />
          <div id="rm-gate-error" style="color: #ef4444; font-size: 12px; font-weight: 600; display: none;">PIN incorrecto. Vuelve a intentarlo.</div>
          
          <label style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: #64748b; cursor: pointer; user-select: none;">
            <input type="checkbox" id="rm-remember-check" checked style="border-radius: 4px;" /> Recordar en este navegador
          </label>
          
          <button type="submit" style="width: 100%; padding: 12px; border: none; border-radius: 12px; background: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; touch-action: manipulation;">
            Desbloquear Acceso
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; display: flex; justify-content: center; gap: 12px;">
          <a href="/" style="font-size: 12px; color: #2563eb; text-decoration: none; font-weight: 500;">← Volver al Hub Principal</a>
        </div>
      </div>
    `;

    document.body.appendChild(gateOverlay);

    const form = document.getElementById('rm-gate-form');
    const input = document.getElementById('rm-pin-input');
    const errorEl = document.getElementById('rm-gate-error');
    const rememberCheck = document.getElementById('rm-remember-check');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      const enteredHash = await sha256(val);

      if (enteredHash === getSavedHash()) {
        unlockSession(rememberCheck.checked);
        gateOverlay.remove();
        setupMobileNav();
      } else {
        errorEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  });

  // PWA Service Worker & Manifest registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  // Capture beforeinstallprompt globally
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.rmPwaPrompt = e;
  });

  // Ensure manifest and touch icon links exist in head
  if (!document.querySelector('link[rel="manifest"]')) {
    const m = document.createElement('link');
    m.rel = 'manifest';
    m.href = '/manifest.webmanifest';
    document.head.appendChild(m);
  }
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const a = document.createElement('link');
    a.rel = 'apple-touch-icon';
    a.href = '/apple-touch-icon.png';
    document.head.appendChild(a);
  }
})();
