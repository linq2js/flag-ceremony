// Service worker for Flag Ceremony PWA
// Workbox will inject precaching code here during build

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Workbox will inject the precache manifest here during build
// injectManifest will replace the manifest placeholder with the actual manifest array
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Runtime caching strategies
// Supabase API - NetworkFirst with short cache
workbox.routing.registerRoute(
  ({ url }) => url.hostname.includes('supabase.co'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'supabase-api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Images - CacheFirst with long cache
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Static assets (JS, CSS, fonts) - StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources-cache',
  })
);

// Navigation route - serve index.html for all navigation requests (SPA routing)
// This enables offline support for the app
// Note: index.html should be precached by Workbox, so this will serve it from cache when offline
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'navigation-cache',
  })
);

