/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Use class strategy for dark mode
  theme: {
    extend: {
      colors: {
        // Define your custom brand colors for consistency
        'brand': {
          amber: {
            light: '#fef3c7', // amber-100
            dark: 'rgba(251, 191, 36, 0.2)'
          },
          emerald: {
            light: '#d1fae5', // emerald-100
            dark: 'rgba(16, 185, 129, 0.2)'
          },
          sky: {
            light: '#e0f2fe', // sky-100
            dark: 'rgba(14, 165, 233, 0.2)'
          },
          rose: {
            light: '#ffe4e6', // rose-100
            dark: 'rgba(244, 63, 94, 0.2)'
          },
          violet: {
            light: '#ede9fe', // violet-100
            dark: 'rgba(139, 92, 246, 0.2)'
          },
          indigo: {
            light: '#e0e7ff', // indigo-100
            dark: 'rgba(79, 70, 229, 0.2)'
          }
        }
      },
      animation: {
        'pulse-scale': 'pulseScale 2s infinite',
      },
      keyframes: {
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}