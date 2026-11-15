// SIDEOUT – Offline-Betrieb. Wird von tools/build_pages.rb nach pages/sw.js kopiert, @@CACHE@@ wird dabei
// durch einen Wert aus dem Inhalt ersetzt. Ändert sich das Spiel, ändert sich der Name, und der alte Speicher wird gelöscht.
const CACHE = 'sideout-d44519cb52';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'fonts/barlow-400-latin-ext.woff2', 'fonts/barlow-400-latin.woff2', 'fonts/barlow-600-latin-ext.woff2', 'fonts/barlow-600-latin.woff2', 'fonts/barlow-condensed-500-latin-ext.woff2', 'fonts/barlow-condensed-500-latin.woff2', 'fonts/barlow-condensed-700-latin-ext.woff2', 'fonts/barlow-condensed-700-latin.woff2', 'fonts/barlow-condensed-800-latin-ext.woff2', 'fonts/barlow-condensed-800-latin.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Erst das Netz (so kommt eine neue Fassung sofort an), ohne Netz die gespeicherte Fassung. Fremde Adressen bleiben unberührt.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
