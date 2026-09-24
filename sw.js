const CACHE_NAME = "friendly-helpers-v10"
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./bilder/logo.png",
  "./bilder/robot.jpeg",
  "./bilder/drone.jpeg",
  "./bilder/smartPromo.mp4",
  "./bilder/icon-192.png",
  "./bilder/icon-512.png",
  "./bilder/icon-maskable-512.png",
  "./bilder/apple-touch-icon.png",
  "./lyd/Stemme 1.m4a",
  "./lyd/Stemme 2.m4a",
  "./lyd/Stemme 3.m4a",
  "./lyd/Stemme 4.m4a",
]

const OFFLINE_NAV = "./index.html"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached
          // Navigasjons-fallback: vis app-skall når siden ikke ligger i cachen
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_NAV)
          }
          return Response.error()
        }),
      ),
  )
})
