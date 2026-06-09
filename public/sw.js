const CACHE_NAME = 'nd3-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/labs',
  '/about',
  '/store',
  '/accessibility',
  '/privacy',
  '/terms',
  '/favicon.svg',
  '/ollie.jpg',
  '/logo-primary-flat.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔌 [PWA Service Worker] Pre-caching offline shells...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🔌 [PWA Service Worker] Clearing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Only process standard GET requests (bypass chrome-extensions and POST actions)
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // If response is valid, dynamically update the cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, serve from cache
        console.warn('🔌 [PWA Service Worker] Offline state detected. Serving from cache for url:', e.request.url);
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If a page route, return cached root/shell
          if (e.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
