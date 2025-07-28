/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cat: {
          pink: '#FFB6C1',
          orange: '#FFA500',
          yellow: '#FFD700',
          blue: '#87CEEB',
          green: '#98FB98',
          purple: '#DDA0DD',
          red: '#FF6B6B',
          gray: '#F0F0F0'
        }
      },
      fontFamily: {
        'cat': ['Comic Sans MS', 'cursive', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'purr': 'purr 0.5s ease-in-out'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        purr: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
} 