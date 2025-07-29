import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      const hasSeenPrompt = localStorage.getItem('cat-tetris-install-prompt-seen')
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 10000)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      localStorage.setItem('cat-tetris-installed', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }
    
    localStorage.setItem('cat-tetris-install-prompt-seen', 'true')
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('cat-tetris-install-prompt-seen', 'true')
  }

  const handleShowPrompt = () => {
    if (deferredPrompt) {
      setShowInstallPrompt(true)
    }
  }

  if (isInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <div className="flex items-center gap-2">
          <span>✅</span>
          <span>App instalado!</span>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {deferredPrompt && !showInstallPrompt && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShowPrompt}
          className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
          title="Instalar Cat Tetris"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.41 3.41L10.83 6H20V8H10.83L13.41 10.59L12 12L7 7L12 2ZM12 14L17 19L12 24L10.59 22.59L13.17 20H4V18H13.17L10.59 15.41L12 14Z"/>
          </svg>
        </motion.button>
      )}

      <AnimatePresence>
        {showInstallPrompt && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-purple-500/30"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🐱</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Instalar Cat Tetris
                </h2>
                <p className="text-purple-200 mb-6">
                  Instale o Cat Tetris na sua tela inicial para jogar offline a qualquer momento! 
                  Funciona como um app nativo.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-green-400 mb-1">🚀 Acesso Rápido</div>
                    <div className="text-purple-200">Ícone na tela inicial</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-green-400 mb-1">📱 Offline</div>
                    <div className="text-purple-200">Jogue sem internet</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-green-400 mb-1">⚡ Performance</div>
                    <div className="text-purple-200">Carregamento instantâneo</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-green-400 mb-1">🎮 Experiência</div>
                    <div className="text-purple-200">Como app nativo</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDismiss}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                  >
                    Agora não
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg"
                  >
                    🐱 Instalar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 