import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/cat-tetris/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['cat-icon.svg', 'sounds/*.mp3'],
      manifest: {
        name: 'Cat Tetris - Jogo de Tetris com Gatos',
        short_name: 'Cat Tetris',
        description: 'Um jogo de Tetris divertido com tema de gatos. Jogue offline, bata recordes e divirta-se com seus amigos felinos!',
        theme_color: '#764ba2',
        background_color: '#667eea',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/cat-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
}) 