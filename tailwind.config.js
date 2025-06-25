/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)", 
        accent: "var(--color-accent)",
        background: "var(--color-background)"
      }
    },
  },
  plugins: [],
}