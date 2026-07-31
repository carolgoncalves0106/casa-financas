import { CartaoCredito } from "@/lib/types";

// Re-exportado como "Cartao" para manter compatibilidade com quem já
// importava esse nome (ex: composição de "Origem" em lib/mock/index.ts)
export type Cartao = CartaoCredito;

// Cartões de crédito fictícios — usados na tela de Cartões, no Painel e nos formulários.
export const cartoes: Cartao[] = [
  {
    id: "cartao-carol",
    nome: "Cartão Carol",
    titular: "Carol",
    tipo: "cartao",
    emoji: "💳",
    cor: "plum",
    bandeira: "Mastercard",
    limite: 6000.00,
    fechamento: 20,
    vencimento: 27,
    faturaAtual: 2150.00,
    statusFatura: "aberta",
    afetaContaAoPagar: true,
    faturas: [
      { id: "jul-2026", label: "Julho 2026 (atual)" },
      { id: "ago-2026", label: "Agosto 2026" },
    ],
  },
  {
    id: "cartao-mitch",
    nome: "Cartão Mitch",
    titular: "Mitch",
    tipo: "cartao",
    emoji: "💳",
    cor: "slate2",
    // bandeira, limite e fechamento não informados de propósito — são opcionais
    vencimento: 15,
    faturaAtual: 684.30,
    statusFatura: "aberta",
    afetaContaAoPagar: false,
    faturas: [
      { id: "jul-2026", label: "Julho 2026 (atual)" },
      { id: "ago-2026", label: "Agosto 2026" },
    ],
  },
];
