/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sage: {
          50: '#f8faf8',
          100: '#f0f5f0',
          200: '#dceadc',
          300: '#b8d4b8',
          400: '#88b888',
          500: '#5d9b5d',
          600: '#4a7c4a',
          700: '#3d653d',
          800: '#335233',
          900: '#2b452b',
        }
      }
    },
  },
  plugins: [],
}
