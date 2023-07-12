/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        red: '#bb3a32',
        green: '#437e33',
        green2: '#2b5433',
        gray: '#494949',
      },
    },
  },
  plugins: [],
}
