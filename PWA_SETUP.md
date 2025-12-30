# PWA Setup

This app is configured as a Progressive Web App (PWA) with service worker support.

## Files Created

- `public/manifest.json` - PWA manifest file
- `public/logo192.png` - 192x192 PWA icon
- `public/logo512.png` - 512x512 PWA icon
- `public/sw.js` - Service worker template (injected by Workbox)
- `workbox-config.js` - Workbox configuration for service worker generation

## Build Process

The build process now includes:

1. `expo export -p web` - Exports the web app to `dist/`
2. `workbox-cli injectManifest` - Generates the service worker with precaching

Run `npm run build:web` to build with PWA support.

## Service Worker Strategy

The service worker uses runtime caching strategies to avoid aggressive precaching:

- **Supabase API**: NetworkFirst (5 min cache)
- **Images**: CacheFirst (30 days)
- **Static assets** (JS/CSS): StaleWhileRevalidate

This prevents the issues mentioned in [Expo's PWA docs](https://docs.expo.dev/guides/progressive-web-apps/) about aggressive caching.

## Testing

1. Build the app: `npm run build:web`
2. Serve the `dist/` directory locally
3. Open Chrome DevTools → Application → Service Workers to verify registration
4. Check Application → Manifest to verify PWA manifest

## Installation

Users can install the PWA by:
- **Chrome/Edge**: Click the install icon in the address bar
- **Safari (iOS)**: Share → Add to Home Screen
- **Firefox**: Menu → Install

## Notes

- The service worker is registered in `web/index.html`
- Manifest is linked in `web/index.html`
- Theme color matches the app's red background (#DC2626)
- Icons are copied from `assets/icon.png` during setup

