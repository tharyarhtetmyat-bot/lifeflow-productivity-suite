const CACHE_NAME = 'flowlife-v4.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/variables.css',
  './css/styles.css',
  './css/components.css',
  './css/animations.css',
  './js/storage.js',
  './js/auth.js',
  './js/calendarModule.js',
  './js/timetableModule.js',
  './js/habitTracker.js',
  './js/budgetTracker.js',
  './js/pomodoroKanban.js',
  './js/notesModule.js',
  './js/analyticsModule.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});