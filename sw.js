// [SERVICE WORKER PWA] Caché Offline-First para La Casita — Club de Bienestar (Javier Espejo)
const CACHE_NAME = 'la-casita-club-v2'; // [VERSIÓN CACHÉ] Identificador de versión

const ASSETS_TO_CACHE = [ // [RECURSOS OFFLINE] Archivos locales y librerías CDN cacheadas al instalar
  './', // [RAÍZ]
  './index.html', // [HTML PRINCIPAL]
  './styles.css', // [HOJA DE ESTILOS]
  './script.js', // [LÓGICA FRONTEND]
  './manifest.json', // [MANIFIESTO PWA]
  './data/productos.json', // [CATÁLOGO JSON]
  './imagenes y video/logo-la-casita.jpg', // [LOGO PRINCIPAL]
  'https://code.jquery.com/jquery-3.7.1.min.js', // [JQUERY CDN]
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', // [ICONOS CDN]
  'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js' // [DOMPURIFY ANTI-XSS CDN]
];

self.addEventListener('install', (event) => { // [EVENTO INSTALL] Precarga recursos esenciales
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)) // [GUARDA EN CACHÉ]
  );
  self.skipWaiting(); // [ACTIVACIÓN INMEDIATA]
});

self.addEventListener('activate', (event) => { // [EVENTO ACTIVATE] Limpia cachés de versiones anteriores
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // [FILTRA OBSOLETAS]
          .map((key) => caches.delete(key)) // [ELIMINA OBSOLETAS]
      )
    )
  );
  self.clients.claim(); // [TOMA CONTROL INMEDIATO]
});

self.addEventListener('fetch', (event) => { // [ESTRATEGIA STALE-WHILE-REVALIDATE] Respuesta rápida + actualización en fondo
  if (event.request.method !== 'GET') return; // [SOLO GET]
  if (event.request.headers.has('range')) return; // [EVITA INTERCEPTAR STREAMING VIDEO RANGE]

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request) // [PETICIÓN RED EN PARALELO]
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) { // [RESPUESTA VÁLIDA]
            const clone = networkResponse.clone(); // [CLONA FLUJO]
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); // [REFRESCA CACHÉ]
          }
          return networkResponse; // [DEVUELVE RED]
        })
        .catch(() => cachedResponse); // [RESPALDO OFFLINE SI NO HAY INTERNET]

      return cachedResponse || networkFetch; // [CACHE FIRST CON ACTUALIZACIÓN]
    })
  );
});
