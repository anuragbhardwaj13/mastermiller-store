/* Master Miller service worker — lightweight progressive/offline support.
 * - Network-first for page navigations (fresh content when online, cached
 *   fallback + offline page when not).
 * - Cache-first for static assets (images, fonts, CSS/JS chunks).
 * Bump CACHE_VERSION to invalidate old caches on deploy.
 */
const CACHE_VERSION = 'mm-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

const PRECACHE = ['/', '/shop', '/offline', '/header-logo-trimmed.png', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; let the browser deal with the rest.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin (e.g. Cloudinary handled by Next image, analytics, etc.)
  if (url.origin !== self.location.origin) return;

  // Page navigations → network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/offline') || caches.match('/');
        })
    );
    return;
  }

  // Static assets → cache-first, fall back to network and cache it.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          // Only cache successful, basic responses.
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
    )
  );
});
