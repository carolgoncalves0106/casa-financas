import { CategoriaCompleta } from "@/lib/types";

// Re-exportado como "Categoria" para manter compatibilidade com quem já
// importava esse nome (formulários, gráfico do Painel...)
export type Categoria = CategoriaCompleta;

// Categorias de despesas (saídas) — usadas no formulário, nos gráficos do
// Painel e na tela de Categorias, onde podem ser editadas/arquivadas.
export const categoriasDespesas: Categoria[] = [
  { id: "cat-casa", emoji: "🏠", nome: "Casa", cor: "peach", tipo: "despesa", temLancamentos: true },
  { id: "cat-mercado", emoji: "🛒", nome: "Mercado", cor: "sage", tipo: "despesa", temLancamentos: true },
  { id: "cat-delivery", emoji: "🍔", nome: "Delivery & Restaurantes", cor: "butter", tipo: "despesa", temLancamentos: true },
  { id: "cat-transporte", emoji: "🚗", nome: "Transporte", cor: "slate2", tipo: "despesa", temLancamentos: true },
  { id: "cat-saude", emoji: "🩺", nome: "Saúde", cor: "clay", tipo: "despesa", temLancamentos: true },
  { id: "cat-lana", emoji: "👧", nome: "Lana", cor: "bloom", tipo: "despesa", temLancamentos: true },
  { id: "cat-pets", emoji: "🐱", nome: "Pets", cor: "plum", tipo: "despesa", temLancamentos: true },
  { id: "cat-compras", emoji: "🛍️", nome: "Compras", cor: "peach", tipo: "despesa", temLancamentos: false },
  { id: "cat-lazer", emoji: "🎉", nome: "Lazer", cor: "butter", tipo: "despesa", temLancamentos: true },
  { id: "cat-financeiro", emoji: "💸", nome: "Financeiro", cor: "sage", tipo: "despesa", temLancamentos: false },
];

// Categorias de entrada — usadas no formulário quando o tipo é "Entrada"
export const categoriasEntradas: Categoria[] = [
  { id: "cat-entrada-carol", emoji: "💰", nome: "Entrada Carol", cor: "plum", tipo: "entrada", temLancamentos: false },
  { id: "cat-entrada-mitch", emoji: "💵", nome: "Entrada Mitch", cor: "slate2", tipo: "entrada", temLancamentos: false },
  { id: "cat-entrada-ndmerch", emoji: "🎸", nome: "Entrada ND Merch", cor: "clay", tipo: "entrada", temLancamentos: true },
  { id: "cat-entrada-reparo", emoji: "✨", nome: "Entrada Reparô", cor: "butter", tipo: "entrada", temLancamentos: false },
  { id: "cat-reembolso", emoji: "🔄", nome: "Reembolso", cor: "sage", tipo: "entrada", temLancamentos: true },
  { id: "cat-outros", emoji: "📥", nome: "Outros", cor: "peach", tipo: "entrada", temLancamentos: false },
];

// Movimentações financeiras não têm categoria — o próprio tipo já identifica:
// Pagamento de fatura, Transferência ou Ajuste de saldo.
export const tiposDeMovimentacao = [
  { id: "transferencia", label: "Transferência" },
  { id: "ajuste", label: "Ajuste de saldo" },
  { id: "fatura", label: "Pagamento de fatura" },
] as const;

export function buscarCategoria(nome: string): Categoria | undefined {
  return [...categoriasDespesas, ...categoriasEntradas].find((c) => c.nome === nome);
}
