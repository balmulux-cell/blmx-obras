// BLMX OBRAS — Service Worker
const CACHE = 'blmx-v1';
const ASSETS = ['/blmx-obras/', '/blmx-obras/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo cachear recursos propios, dejar pasar Firebase y Cloudflare
  const url = new URL(e.request.url);
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('cloudflare') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('emailjs') ||
      url.hostname.includes('cdnjs')) {
    return; // red directa
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
