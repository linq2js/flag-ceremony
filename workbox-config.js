module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,woff,woff2,ttf,eot}',
  ],
  swDest: 'dist/sw.js',
  // Use injectManifest to inject precaching into our custom service worker
  swSrc: 'public/sw.js',
  // Runtime caching strategies - avoids aggressive precaching
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources-cache',
      },
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
};

