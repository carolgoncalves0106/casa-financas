import { CategoriaGasto } from "@/lib/types";
import { categoryChartPalette } from "@/lib/design-system";
import { buscarCategoria } from "./categorias";
import { contas } from "./contas";

export const mesAtual = "Julho de 2026";

export const resumoMes = {
  // Somando o saldo de todas as contas cadastradas — nunca hardcoded aqui,
  // sempre derivado de lib/mock/contas.ts para os dois nunca divergirem.
  saldoAtual: contas.reduce((soma, conta) => soma + conta.saldoAtual, 0),
  entradasMes: 12500.00,
  saidasMes: 7820.40,
  entradasPrevistas: 3200.00,
  saidasPrevistas: 4730.60,
  faturaCarol: 2150.00,
  faturaMitch: 684.30,
};

// Estatísticas do mês por categoria — valores fictícios; nome/emoji sempre
// vêm da lista central em lib/mock/categorias.ts e a cor vem da paleta
// central em lib/design-system.ts, para evitar qualquer inconsistência.
const estatisticasPorCategoria: { nome: string; valor: number; percentual: number }[] = [
  { nome: "Casa", valor: 4380.00, percentual: 36 },
  { nome: "Mercado", valor: 1420.00, percentual: 18 },
  { nome: "Delivery & Restaurantes", valor: 830.00, percentual: 10 },
  { nome: "Lana", valor: 720.00, percentual: 9 },
  { nome: "Pets", valor: 410.00, percentual: 5 },
  { nome: "Transporte", valor: 360.00, percentual: 5 },
  { nome: "Saúde", valor: 300.00, percentual: 4 },
  { nome: "Compras", valor: 260.00, percentual: 3 },
  { nome: "Lazer", valor: 240.00, percentual: 3 },
  { nome: "Financeiro", valor: 220.00, percentual: 3 },
];

export const gastosPorCategoria: CategoriaGasto[] = estatisticasPorCategoria.map((item, i) => ({
  ...item,
  emoji: buscarCategoria(item.nome)?.emoji ?? "🏷️",
  cor: categoryChartPalette[i % categoryChartPalette.length],
}));
