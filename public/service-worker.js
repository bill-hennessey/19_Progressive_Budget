const FILES_TO_CACHE = ["./", "./styles.css", "./index.html"];
const CACHE_NAME = "static-cached-files-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// install event handler
self.addEventListener("install", (event) => {
  // open cache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  event.waitUntil(
    caches.open(DATA_CACHE_NAME).then((cache) => {
      return cache.add("/api/transaction");
    })
  );

  self.skipWaiting();
});

// updates the cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    caches
      .open(DATA_CACHE_NAME)
      .then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            return cache.match(event.request);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
