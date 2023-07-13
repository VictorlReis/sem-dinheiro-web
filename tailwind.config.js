/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#282a36',
        secondary: '#44475a',
        foreground: '#f8f8f2',
        blue: '#6272a4',
        cyan: '#8be9fd',
        green: '#0ccd3d',
        orange: '#ffb86c',
        pink: '#ff79c6',
        purple: '#bd93f9',
        red: '#fd3131',
        yellow: '#f1fa8c',
      },
    },
  },
  plugins: [],
}
