/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toyota: {
          red: "#EB0A1E",
          black: "#000000",
          gray: {
            100: "#F7F7F7",
            200: "#E5E5E5",
            300: "#BDBDBD",
            400: "#757575",
            500: "#424242",
          }
        }
      },
      fontFamily: {
        sans: ['Toyota Type', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
