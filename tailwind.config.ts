import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pattern rgb(var(--x-rgb) / <alpha-value>) — seule forme qui permet à
        // Tailwind de générer fiablement les modificateurs d'opacité (/80, /90…)
        // sur des couleurs personnalisées (un oklch() direct ne le permet pas).
        forest: {
          DEFAULT: "rgb(var(--color-forest-rgb) / <alpha-value>)",
          light: "rgb(var(--color-forest-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--color-forest-dark-rgb) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold-rgb) / <alpha-value>)",
          deep: "rgb(var(--color-gold-deep-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-gold-soft-rgb) / <alpha-value>)",
        },
        cream: {
          DEFAULT: "rgb(var(--color-cream-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-cream-soft-rgb) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        line: "rgb(var(--color-line-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: "var(--fs-hero)",
        h1: "var(--fs-h1)",
        h2: "var(--fs-h2)",
        h3: "var(--fs-h3)",
        "body-lg": "var(--fs-body-lg)",
        body: "var(--fs-body)",
      },
      maxWidth: {
        content: "1280px",
        prose: "68ch",
      },
      spacing: {
        section: "var(--section-py)",
        "section-sm": "var(--section-py-sm)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out-expo)",
        "in-out-soft": "var(--ease-in-out-soft)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "18px",
        pill: "999px",
      },
      letterSpacing: {
        wide2: "0.08em",
        wide3: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
