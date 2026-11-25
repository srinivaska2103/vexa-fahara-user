const CACHE_NAME = 'grab2go-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Explicit NetworkOnly rule for video requests and range requests
  // Chromium / Android Chrome media player fails if Service Worker intercepts video Range requests with standard fetch()
  const isVideo =
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.webm') ||
    url.pathname.includes('/videos/') ||
    request.headers.get('range') ||
    request.destination === 'video';

  if (isVideo) {
    // Let browser handle Range requests and partial content directly via network without SW interference
    return;
  }

  // 2. Standard pass-through for other requests
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
