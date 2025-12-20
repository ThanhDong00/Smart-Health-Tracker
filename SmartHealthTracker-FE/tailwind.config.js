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

        // Light theme
        "background-light": "#f8fafc",
        "surface-light": "#ffffff",
        "card-light": "#f1f5f9",
        "text-dark": "#1e293b",
        "text-muted": "#64748b",
        "surface-hover-light": "#e2e8f0",

        // Dark theme
        "background-dark": "#0f0f23",
        "surface-dark": "#1e1e2e",
        "text-primary": "#cdd6f4",
        "text-secondary": "#a6adc8",
        "text-disabled": "#45475a",
        "surface-variant-dark": "#313244",
        "surface-variant-hover-dark": "#45475a",

        // Destructive colors for delete button
        "destructive-dark": "#1e1b22",
        "destructive-light": "#ef44441a",
        "destructive-hover-dark": "#2a2330",
        "destructive-hover-light": "#ef444426",
        destructive: "#ef4444",

        // Primary variants
        "primary-dark": "#00b894",
      },
    },
  },
  plugins: [],
};
