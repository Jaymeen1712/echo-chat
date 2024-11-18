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
        "purple-primary": "#7678ed",
        "red-danger": "#ff7a55",
        "white-primary": "#f9fafc",
      },
    },
  },
  plugins: [],
};
