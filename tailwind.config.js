/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222, 47%, 11%)'
      }
    }
  },
  plugins: []
}
