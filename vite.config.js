import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/cat-tetris/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
      includeAssets: ['cat-icon.svg', 'sounds/*.mp3', 'icons/*.png', 'screenshots/*.png', 'offline.html'],
      manifest: {
        name: 'Cat Tetris - Jogo de Tetris com Gatos',
        short_name: 'Cat Tetris',
        description: 'Um jogo de Tetris divertido com tema de gatos. Jogue offline, bata recordes e divirta-se com seus amigos felinos!',
        theme_color: '#764ba2',
        background_color: '#667eea',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'tabbed', 'standalone'],
        orientation: 'portrait-primary',
        lang: 'pt-BR',
        dir: 'ltr',
        scope: '/cat-tetris/',
        start_url: '/cat-tetris/',
        id: '/cat-tetris/',
        categories: ['games', 'entertainment', 'puzzle'],
        iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
        prefer_related_applications: false,
        launch_handler: {
          client_mode: 'navigate-existing'
        },
        handle_links: 'preferred',
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
        screenshots: [
          {
            src: 'screenshots/mobile-1.png',
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Tela principal do Cat Tetris no celular'
          },
          {
            src: 'screenshots/mobile-2.png',
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Conquistas e modos de jogo'
          },
          {
            src: 'screenshots/desktop-1.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Cat Tetris no desktop'
          }
        ],
        shortcuts: [
          {
            name: 'Novo Jogo',
            short_name: 'Jogar',
            description: 'Iniciar um novo jogo de Cat Tetris',
            url: '/cat-tetris/?action=new-game',
            icons: [{ src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' }]
          }
        ],
        share_target: {
          action: '/cat-tetris/',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        related_applications: [
          {
            platform: 'webapp',
            url: 'https://shigake.github.io/cat-tetris/',
            id: '/cat-tetris/'
          }
        ],
        edge_side_panel: {
          preferred_width: 400
        },
        protocol_handlers: [
          {
            protocol: 'web+cattetris',
            url: '/cat-tetris/?game=%s'
          }
        ],
        scope_extensions: [
          { origin: '*.github.io' }
        ],
        file_handlers: [
          {
            action: '/cat-tetris/',
            accept: {
              'application/json': ['.json']
            }
          }
        ],
        widgets: [
          {
            name: 'Cat Tetris Score',
            tag: 'cat-tetris-score',
            ms_ac_template: 'widget/score',
            data: '/cat-tetris/',
            description: 'Mostra sua pontuação mais alta no Cat Tetris',
            screenshots: [
              {
                src: 'screenshots/desktop-1.png',
                sizes: '1920x1080',
                label: 'Widget de pontuação'
              }
            ],
            icons: [
              {
                src: 'icons/icon-96x96.png',
                sizes: '96x96'
              }
            ]
          }
        ],
        note_taking: {
          new_note_url: '/cat-tetris/'
        }
      },
      injectManifest: {
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