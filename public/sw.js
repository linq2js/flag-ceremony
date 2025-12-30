// Service worker for Flag Ceremony PWA
// Workbox will inject precaching code here during build

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Workbox will inject precache manifest here
// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Runtime caching will be added by Workbox injectManifest

