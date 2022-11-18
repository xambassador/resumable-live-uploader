/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter, sans-serif"],
    },
    extend: {
      colors: {
        sky: {
          100: "#e5effb",
          200: "#b0bcd6",
        },
      },
    },
  },
  plugins: [],
};
