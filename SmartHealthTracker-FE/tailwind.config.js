/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7f27ff",
        secondary: "#c297ff",
        // accent: "#F59E0B",
        background: "#f5f5f5",
        cardBackground: "#FFFFFF",
        textPrimary: "black",
        textSecondary: "#2e2e2e",
        light_inputBackground: "#fafafa",
        dark_inputBackground: "#1f222a",

        dark_background: "#1F2937",
        dark_cardBackground: "#374151",
        dark_textPrimary: "#F9FAFB",
        dark_textSecondary: "#D1D5DB",
      },
    },
  },
  plugins: [],
};
