module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,woff,woff2,ttf,eot}',
  ],
  swDest: 'dist/sw.js',
  // Use injectManifest to inject precaching into our custom service worker
  swSrc: 'public/sw.js',
  // Note: runtimeCaching must be defined in the service worker file itself
  // injectManifest only injects the precache manifest
};

