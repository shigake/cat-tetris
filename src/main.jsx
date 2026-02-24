import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { I18nProvider } from './hooks/useI18n.jsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
 onRegisteredSW(swUrl, registration) {
 if (registration) {

 setInterval(() => {
 registration.update()
 }, 60 * 60 * 1000)

 if ('periodicSync' in registration) {
 registration.periodicSync.register('content-sync', {
 minInterval: 24 * 60 * 60 * 1000
 }).catch(() => {

 })
 }
 }
 },
 onOfflineReady() {
 }
})

ReactDOM.createRoot(document.getElementById('root')).render(
 <I18nProvider>
 <App />
 </I18nProvider>
)
