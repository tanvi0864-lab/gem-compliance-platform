/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gem: {
          navy: "#0a192f",
          navyDark: "#030c1b",
          blue: "#1e3a8a",
          accent: "#2563eb",
          gold: "#d97706",
          slate: "#f8fafc",
          border: "#cbd5e1"
        }
      }
    },
  },
  plugins: [],
}
