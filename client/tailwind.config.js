/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-dull": "var(--color-primary-dull)",
      },
    },
  },
  plugins: [animate],
};