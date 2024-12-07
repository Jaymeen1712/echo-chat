/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
    },
    extend: {
      colors: {
        "black-primary": "#202022",
        "red-danger": "#EA7553",
        "white-primary": "#f9fafc",
        "purple-primary": "#7678ed",
        "purple-dark-1": "#232C6A",
        "contrast-color": "#34B7F1"
      },
      fontFamily: {
        noto: ['"Noto Serif Display"', "serif"],
      },
    },
  },
  plugins: [],
};
