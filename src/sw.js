import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache all assets built by Vite
precacheAndRoute(self.__WB_MANIFEST)

// Cleanup old caches
cleanupOutdatedCaches()

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
)

// Cache audio files
registerRoute(
  ({ url }) => /\.(?:mp3|wav|ogg)$/.test(url.pathname),
  new CacheFirst({
    cacheName: 'audio',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
)

// Cache JS/CSS with StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
)

// Offline fallback for navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      const preloadResponse = await event.preloadResponse
      if (preloadResponse) return preloadResponse
      return await fetch(event.request)
    } catch {
      const cache = await caches.open('offline-fallback')
      return cache.match('/cat-tetris/offline.html') || cache.match('/cat-tetris/index.html')
    }
  }
)

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Cat Tetris'
  const options = {
    body: data.body || 'Hora de jogar Cat Tetris! 🐱',
    icon: '/cat-tetris/icons/icon-192x192.png',
    badge: '/cat-tetris/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/cat-tetris/'
    },
    actions: [
      { action: 'play', title: 'Jogar Agora' },
      { action: 'close', title: 'Fechar' }
    ]
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/cat-tetris/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/cat-tetris/') && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

// Background sync handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(
      // Sync high scores when back online
      Promise.resolve()
    )
  }
})

// Periodic background sync handler
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Check for app updates periodically
      caches.open('static-resources').then((cache) => {
        return cache.add('/cat-tetris/')
      }).catch(() => {})
    )
  }
})

// Skip waiting and claim clients immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
