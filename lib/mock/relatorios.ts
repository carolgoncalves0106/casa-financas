export interface MesEvolucao {
  mes: string;
  entradas: number;
  saidas: number;
}

// Evolução mensal do ano corrente — usada no gráfico "Evolução mensal"
// e na "Comparação entre meses" da tela de Relatórios.
export const evolucaoMensal: MesEvolucao[] = [
  { mes: "Jan", entradas: 11800.00, saidas: 7200.00 },
  { mes: "Fev", entradas: 11950.00, saidas: 7450.00 },
  { mes: "Mar", entradas: 12100.00, saidas: 6980.00 },
  { mes: "Abr", entradas: 12300.00, saidas: 7600.00 },
  { mes: "Mai", entradas: 12500.00, saidas: 7300.00 },
  { mes: "Jun", entradas: 12450.00, saidas: 8100.00 },
  { mes: "Jul", entradas: 12500.00, saidas: 7820.40 },
];

export const mesesDoAno = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const anosDisponiveis = [2025, 2026];

// Algumas categorias acompanhadas mês a mês — usadas no gráfico
// "Comparação de uma categoria ao longo do ano".
export const categoriaAoLongoDoAno: Record<string, number[]> = {
  "Casa": [3800, 3950, 4100, 4200, 4050, 4300, 4380],
  "Mercado": [1200, 1300, 1250, 1400, 1380, 1450, 1420],
  "Delivery & Restaurantes": [620, 680, 590, 750, 710, 800, 830],
  "Lazer": [180, 220, 260, 210, 300, 250, 240],
};
