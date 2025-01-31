/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./apps/frontend/**/*.{html,js,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Inter var",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      serif: ["Merriweather", "serif"],
    },
    fontSize: {
      tiny: "0.5rem",
    },
  },
  plugins: [],
};

