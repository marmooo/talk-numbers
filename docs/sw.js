const CACHE_NAME="2025-04-05 21:00",urlsToCache=["/talk-numbers/","/talk-numbers/kohacu.webp","/talk-numbers/index.js","/talk-numbers/mp3/end.mp3","/talk-numbers/mp3/cat.mp3","/talk-numbers/mp3/correct3.mp3","/talk-numbers/favicon/favicon.svg"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})