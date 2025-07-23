const CACHE_NAME = 'tipificador-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './dist/css/bootstrap.min.css',
  './dist/css/style.css',
  './dist/js/bootstrap.bundle.min.js',
  './dist/js/sweetalert2@11.js',
  './dist/js/funciones.js',
  './dist/img/LR.png',
  './dist/img/call-center-agent.png',
  'https://code.jquery.com/jquery-3.6.0.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Instalar el service worker y cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones y servir desde cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver recurso desde cache si existe
        if (response) {
          return response;
        }
        // Si no está en cache, hacer petición a la red
        return fetch(event.request);
      })
  );
});

// Activar el service worker y limpiar caches antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});