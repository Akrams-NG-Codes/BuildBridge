const CACHE_NAME = 'buildbridge-v1';
const API_CACHE = 'buildbridge-api-v1';
const MEDIA_CACHE = 'buildbridge-media-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('[SW] Cache add error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes('v1'))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first for API, cache first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          console.log('[SW] API offline, using cache for:', request.url);
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets: Cache first
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
