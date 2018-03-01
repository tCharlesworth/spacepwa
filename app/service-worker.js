var cacheName = `spacePWA-v0.3`;
var filesToCache = [
  '/',
  '/index.html',
  '/app/app.js',
  '/styles/materialize.min.css',
  '/styles/styles.css',
  '/images/launchpad/ccafs_lc_13.jpg',
  '/images/launchpad/ccafs_slc_40.jpg',
  '/images/launchpad/default.jpg',
  '/images/launchpad/ksc_lc_39a.jpg',
  '/images/launchpad/kwajalein_atoll.jpg',
  '/images/launchpad/stls.jpg',
  '/images/launchpad/vafb_slc_3w.jpg',
  '/images/launchpad/vafb_slc_4e.jpg',
  '/images/launchpad/vafb_slc_4w.jpg',
  '/images/rocket/default.png',
  '/images/rocket/Falcon 1.jpg',
  '/images/rocket/Falcon 9.jpg',
  '/images/rocket/Falcon Heavy.jpg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log(`[ServiceWorker] Caching app shell`);
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('activate', function(e) {
  console.log(`[ServiceWorker] Activated`);
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(key !== cacheName) {
          console.log(`[ServiceWorker] Removing old cache`, key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
  console.log(`[ServiceWorker] Fetch`);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});