/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1a1a2e',
          800: '#16213e',
          700: '#0f3460',
          600: '#0f1923',
        },
        brand: '#e94560',
      },
    },
  },
  plugins: [],
}
