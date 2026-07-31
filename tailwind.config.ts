import type { Config } from "tailwindcss";
import { colors, radius, shadows } from "./lib/design-system";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Todas as cores, raios e sombras vêm de lib/design-system.ts —
      // é lá que a identidade visual do projeto deve ser ajustada.
      colors: { ...colors },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        "2xl": radius.md,
        "3xl": radius.xl,
        "4xl": radius["2xl"],
      },
      boxShadow: { ...shadows },
    },
  },
  plugins: [],
};

export default config;
