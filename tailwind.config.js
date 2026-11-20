/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#F5F5F7',
        border: '#ECECF0',
        dim: '#6B6B76',
        ink: '#18181B',
        ink2: '#3F3F46',
      },
    },
  },
  plugins: [],
}

