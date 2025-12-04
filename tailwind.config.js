/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-gold': '#FFD700',
        'emerald-deep': '#0d5c3d',
        'emerald-rich': '#1a7a50',
      },
      fontFamily: {
        'luxury': ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}