require("dotenv").config();
const enablePurge = process.env.ENABLE_PURGE || false;

module.exports = {
  purge: { enabled: enablePurge, content: ["./src/**/*.{html,ts,scss}"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      screens: { xs: "400px" },
      spacing: { 120: "30rem" },
      colors: {
        "cool-gray": {
          50: "#f3f2f7",
          100: "#e7e6f0",
          200: "#c3bfd9",
          300: "#9f99c2",
          400: "#564d94",
          500: "#0e0066",
          600: "#0d005c",
          700: "#0b004d",
          800: "#08003d",
          900: "#070032",
        },
        supernova: {
          50: "#fffcf2",
          100: "#fefae6",
          200: "#fdf2c0",
          300: "#fcea99",
          400: "#f9da4d",
          500: "#f7ca01",
          600: "#deb601",
          700: "#b99801",
          800: "#947901",
          900: "#796300",
        },
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "group-hover"],
    textColor: ["responsive", "hover", "focus", "group-hover"],
    opacity: ["responsive", "hover", "focus", "group-hover"],
    display: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [require("@tailwindcss/ui")],
};
