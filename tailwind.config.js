/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Inter"', '"Roboto"', 'sans-serif'],
        display: ['"Be Vietnam Pro"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
