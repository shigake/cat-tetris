import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/cat-tetris/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['cat-icon.svg', 'sounds/*.mp3', 'icons/*.png'],
      manifest: {
        name: 'Cat Tetris - Jogo de Tetris com Gatos',
        short_name: 'Cat Tetris',
        description: 'Um jogo de Tetris divertido com tema de gatos. Jogue offline, bata recordes e divirta-se com seus amigos felinos!',
        theme_color: '#764ba2',
        background_color: '#667eea',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'pt-BR',
        scope: '/cat-tetris/',
        start_url: '/cat-tetris/',
        categories: ['games', 'entertainment'],
        icons: [
          {
            src: 'icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/maskable-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Novo Jogo',
            short_name: 'Jogar',
            description: 'Iniciar um novo jogo de Cat Tetris',
            url: '/cat-tetris/?action=new-game'
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