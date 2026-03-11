const CACHE_NAME = 'trip-cache-v1';
const ASSETS = ['./index.html', './itinerari.html', './mapa.html', './info.html', './style.css', './app.js', './manifest.json', './casa.svg'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
