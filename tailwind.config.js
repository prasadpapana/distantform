/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: '#111111',
        paper: '#f4f4f1',
        electric: '#225bff',
      },
    },
  },
  plugins: [],
}
