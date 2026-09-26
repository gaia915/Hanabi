/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night: {
          950: '#070913',
          900: '#0c0f20',
          800: '#141a36',
          700: '#1e264f',
        },
        spark: {
          gold: '#ffd166',
          coral: '#ef476f',
          cyan: '#06d6a0',
          blue: '#118ab2',
          purple: '#9d4edd',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'twinkle': 'twinkle 3s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(239, 71, 111, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255, 209, 102, 0.7))' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
