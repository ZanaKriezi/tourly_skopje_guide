/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#4FC3F7',      // Sky Blue (main color)
        secondary: '#8AD4F7',    // Lighter Blue for secondary elements
        accent: '#2196F3',       // Brighter Blue for accents
        background: '#F4F9FC',   // Light Grayish Blue
        text: '#333333',         // Charcoal
        positive: '#66B86A',     // Emerald Green
        neutral: '#B0BEC5',      // Warm Gray
      },
    },
  },
  plugins: [],
}