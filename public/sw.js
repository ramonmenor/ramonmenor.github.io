// Ramón Menor - PWA Service Worker
const CACHE_NAME = 'rm-hub-v1';
const STATIC_ASSETS = [
  '/',
  '/cv',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/apps/shared/auth-guard.js',
  '/apps/shared/app-nav.css',
  '/apps/panel-control/',
  '/apps/json-formatter/',
  '/apps/sql-formatter/',
  '/apps/hash-uuid/',
  '/apps/color-converter/',
  '/apps/base64-converter/',
  '/apps/notas-privadas/',
  '/apps/mis-servidores/'
];

// Install: Cache core static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be precached:', err);
      });
    })
  );
});

// Activate: Clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first with Cache fallback for freshness
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If response is valid, update the cache clone
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback to cache if network fails (offline)
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // If requesting a page navigation, return cached home
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
