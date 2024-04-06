/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ADB5",
        secondary:"#EEEEEE",
        third: "#393E46",
        fourth:"#222831",
      }
    },
  },
  plugins: [],
}

