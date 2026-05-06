import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
          hover: "var(--color-brand-hover)",
          tint: "var(--color-brand-tint)",
          border: "var(--color-brand-border)",
        },
        live: {
          DEFAULT: "var(--color-live)",
          tint: "var(--color-live-tint)",
        },
        amber: {
          DEFAULT: "var(--color-amber)",
          tint: "var(--color-amber-tint)",
        },
        bg: {
          app: "var(--color-bg-app)",
          surface: "var(--color-bg-surface)",
          card: "var(--color-bg-card)",
          input: "var(--color-bg-input)",
        },
        border: {
          DEFAULT: "var(--color-border)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
