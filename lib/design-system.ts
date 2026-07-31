/**
 * DESIGN SYSTEM — "Nossa Casa"
 * ------------------------------------------------------------------
 * Fonte única da verdade para os tokens visuais do projeto: cores,
 * raios, sombras, espaçamentos e tipografia.
 *
 * `tailwind.config.ts` importa este arquivo para gerar as classes
 * utilitárias (bg-sage, rounded-3xl, shadow-soft...). Qualquer
 * ajuste de identidade visual (uma cor, uma sombra, um raio) deve
 * ser feito AQUI — o resto do projeto (Tailwind + componentes que
 * precisam da cor "crua" em JS, como o gráfico de rosquinha) se
 * atualiza automaticamente.
 * ------------------------------------------------------------------
 */

export const colors = {
  // Fundo e superfícies
  cream: { DEFAULT: "#FBF6EE", soft: "#F7F1E6" },
  card: { DEFAULT: "#FFFFFF", blush: "#FDF4F1" },

  // Texto
  ink: { DEFAULT: "#3B332C", soft: "#6E6459", faint: "#A69C8E" },

  // Acentos da identidade
  butter: { DEFAULT: "#F0C36B", soft: "#FAE7BE" },
  peach: { DEFAULT: "#EFA47E", soft: "#FBE3D5" },
  bloom: { DEFAULT: "#DE9C97", soft: "#F7E2DF" },
  sage: { DEFAULT: "#8FB596", soft: "#E4EFE3" },
  clay: { DEFAULT: "#C97F5D", soft: "#F1DDD1" },
  plum: { DEFAULT: "#9B7E9C", soft: "#EBE1EA" },
  slate2: { DEFAULT: "#7C8CA0", soft: "#E4E9EE" },

  // Status (contas, lançamentos)
  status: {
    late: "#E28B7D",
    lateSoft: "#FBEAE6",
    soon: "#E4B45E",
    soonSoft: "#FBF1DC",
    paid: "#7FAE89",
    paidSoft: "#E7F1E7",
    future: "#ADA396",
    futureSoft: "#F1ECE4",
  },
} as const;

// Paleta usada pelo gráfico "Gastos por categoria" — nesta ordem,
// para bater com a ordem das categorias em lib/mock/categorias.ts
export const categoryChartPalette = [
  colors.peach.DEFAULT,
  colors.sage.DEFAULT,
  colors.butter.DEFAULT,
  colors.bloom.DEFAULT,
  colors.plum.DEFAULT,
  colors.slate2.DEFAULT,
  colors.clay.DEFAULT,
  "#B7AFA6",
  "#E4B45E",
  "#ADA396",
] as const;

export const radius = {
  sm: "0.75rem", // rounded-xl
  md: "1rem", // rounded-2xl (padrão de inputs, badges)
  lg: "1.25rem", // rounded-3xl-ish
  xl: "1.75rem", // rounded-3xl (cards)
  "2xl": "2.25rem", // rounded-4xl (destaques)
  full: "9999px",
} as const;

export const shadows = {
  soft: "0 2px 10px -2px rgba(59, 51, 44, 0.06), 0 8px 24px -12px rgba(59, 51, 44, 0.08)",
  softer: "0 1px 4px -1px rgba(59, 51, 44, 0.05)",
  lift: "0 10px 30px -8px rgba(59, 51, 44, 0.14)",
} as const;

// Escala de espaçamento "com nome" — referência para quem for além do
// espaçamento padrão do Tailwind (px, py, gap...) em algum componente novo
export const spacing = {
  xs: "0.375rem", // 6px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
} as const;

export const typography = {
  fontDisplay: "var(--font-display)", // Quicksand — títulos, valores em destaque
  fontBody: "var(--font-body)", // Plus Jakarta Sans — texto corrido, labels
  scale: {
    xs: "0.6875rem", // 11px — hints, legendas
    sm: "0.75rem", // 12px — labels de card
    base: "0.875rem", // 14px — corpo padrão
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px — valores de card comuns
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px — valor do card em destaque (Saldo)
    "4xl": "2.25rem", // 36px
  },
} as const;

// Duração/curva padrão das transições — usado nas classes utilitárias
// "transition" já configuradas no Tailwind, listado aqui como referência
export const motion = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
