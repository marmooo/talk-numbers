const CACHE_NAME = "2025-09-09 00:19";
const urlsToCache = [
  "/talk-numbers/",
  "/talk-numbers/kohacu.webp",
  "/talk-numbers/index.js",
  "/talk-numbers/mp3/end.mp3",
  "/talk-numbers/mp3/cat.mp3",
  "/talk-numbers/mp3/correct3.mp3",
  "/talk-numbers/favicon/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
