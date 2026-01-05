/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500
          hover: '#059669',   // Emerald 600
          light: '#D1FAE5',   // Emerald 100
        },
        secondary: {
          DEFAULT: '#0F172A', // Slate 900
          light: '#334155',   // Slate 700
        },
        accent: {
          DEFAULT: '#3B82F6', // Blue 500
        },
        background: {
          DEFAULT: '#F8FAFC', // Slate 50
        },
        surface: {
          DEFAULT: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
