import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with periodic sync for updates
const updateSW = registerSW({
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      // Check for updates every hour
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)

      // Register periodic background sync if supported
      if ('periodicSync' in registration) {
        registration.periodicSync.register('content-sync', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        }).catch(() => {
          // Periodic sync not granted
        })
      }
    }
  },
  onOfflineReady() {
    console.log('Cat Tetris pronto para uso offline!')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
