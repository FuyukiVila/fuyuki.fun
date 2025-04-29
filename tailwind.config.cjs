/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        moveRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' }
        }
      },
      animation: {
        moveRight: 'moveRight 1s ease-in-out infinite'
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
