/* ============================================================
   sw.js — Service Worker for Educational Dashboard – Mathematics
   Provides offline caching for core assets and pages.
   ============================================================ */

const CACHE_NAME = 'math-dashboard-v1';

// Core assets to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/maths_y5.html',
  '/maths_y6.html',
  '/maths_y7.html',
  '/maths_shared.css',
  '/maths_programs.css',
  '/maths_lessons.css',
  '/maths_programs.js',
  '/maths_lessons.js',
  '/assets/icons/icon-152x152.png',
  '/manifest.json'          // will be added later
];

// Install event – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event – serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then(response => {
        // Cache new GET requests if they are successful
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // If offline and request is for a page, we could return an offline fallback.
        // For now, we let the browser show its default offline error.
        // Later we can add a dedicated offline.html.
      });
    })
  );
});