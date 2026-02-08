/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'combate-dark': '#0f172a',
        'combate-green': '#10b981',
        'combate-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
