/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        panel: "var(--color-panel)",
        textMain: "var(--color-text-main)",
        textSub: "var(--color-text-sub)",

        primary: "#6366F1",

        income: "#22C55E",
        expense: "#EF4444",
        asset: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Oswald", "sans-serif"],
      },

      boxShadow: {
        "gold-glow": "0 4px 20px rgba(245,166,35,0.3)",
        "panel-depth": "0 10px 30px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
