/**
 * Service Worker for LivePay Petition
 * Enables offline support and app-like experience
 */

// Use timestamp for cache busting - update this when deploying new features
const CACHE_VERSION = '2026-02-01-001';
const CACHE_NAME = `livepay-v${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        console.log('Some assets could not be cached');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for HTML, cache for other assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - network first, fallback to cache
  if (request.url.includes('/api/')) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached response or offline page
          return caches.match(request) || caches.match('/index.html');
        })
    );
  }

  // HTML files - network first to always get latest content
  if (request.url.endsWith('.html') || request.url === self.location.origin + '/' || request.url === self.location.origin) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new version
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
  }

  // Static assets (CSS, JS, images) - cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Fetch in background to update cache
        fetch(request).then((fetchedResponse) => {
          if (fetchedResponse && fetchedResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchedResponse);
            });
          }
        }).catch(() => {});
        return response;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});
