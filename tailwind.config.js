/** @type {import('tailwindcss').Config} */

// Colors are CSS variables (see src/index.css) so light and dark themes
// share one set of class names.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        subtle: token("subtle"),
        line: token("line"),
        ink: token("ink"),
        muted: token("muted"),
        brand: {
          DEFAULT: token("brand"),
          strong: token("brand-strong"),
          soft: token("brand-soft"),
          ink: token("brand-ink"),
        },
        accent: {
          DEFAULT: token("accent"),
          ink: token("accent-ink"),
        },
        danger: {
          DEFAULT: token("danger"),
          soft: token("danger-soft"),
        },
        success: {
          DEFAULT: token("success"),
          soft: token("success-soft"),
        },
        warning: {
          DEFAULT: token("warning"),
          soft: token("warning-soft"),
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 24 40 / 0.04), 0 1px 3px rgb(16 24 40 / 0.06)",
        lift: "0 12px 32px -12px rgb(16 24 40 / 0.18)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "slide-in-left": "slide-in-left 200ms ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
