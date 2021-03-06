require("dotenv").config();
const enablePurge = !process.env.ENABLE_PURGE;

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
