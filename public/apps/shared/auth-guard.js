// Ramón Menor - Client-side Access Guard for Private Apps
(function() {
  const STORAGE_KEY = 'rm_private_access_session';
  const PIN_HASH_KEY = 'rm_master_pin_hash';

  // Default master PIN is '1234' (SHA-256: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4)
  const DEFAULT_PIN_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

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

  window.RMAccess = {
    isUnlocked,
    lock: function() {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    },
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
      return { success: true, message: 'PIN actualizado correctamente.' };
    }
  };

  // If already unlocked, do nothing
  if (isUnlocked()) {
    return;
  }

  // Otherwise, render access gate modal
  document.addEventListener('DOMContentLoaded', () => {
    // Hide body content until unlocked
    const originalDisplay = document.body.style.display;
    
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

    gateOverlay.innerHTML = `
      <div style="max-width: 360px; width: 100%; text-align: center; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); background: #ffffff;">
        <div style="width: 48px; height: 48px; border-radius: 14px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px; border: 1px solid #dbeafe;">
          🔒
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.02em;">Aplicación Privada</h2>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 20px; line-height: 1.5;">Esta herramienta tiene control de acceso. Introduce tu PIN maestro para desbloquearla.</p>
        
        <form id="rm-gate-form" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="password" id="rm-pin-input" placeholder="PIN de acceso..." autofocus style="width: 100%; box-sizing: border-box; padding: 12px 14px; font-size: 14px; text-align: center; letter-spacing: 0.2em; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 12px; outline: none;" />
          <div id="rm-gate-error" style="color: #ef4444; font-size: 12px; font-weight: 600; display: none;">PIN incorrecto. Vuelve a intentarlo.</div>
          
          <label style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: #64748b; cursor: pointer;">
            <input type="checkbox" id="rm-remember-check" checked style="border-radius: 4px;" /> Recordar en este navegador
          </label>
          
          <button type="submit" style="width: 100%; padding: 12px; border: none; border-radius: 12px; background: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            Desbloquear Acceso
          </button>
        </form>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          <a href="/" style="font-size: 12px; color: #2563eb; text-decoration: none; font-weight: 500;">← Volver a ramonmenor.es</a>
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
      } else {
        errorEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  });
})();
