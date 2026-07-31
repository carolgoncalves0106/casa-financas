import { ContaBancaria } from "@/lib/types";

// Re-exportado como "Conta" para manter compatibilidade com quem já
// importava esse nome (ex: composição de "Origem" em lib/mock/index.ts)
export type Conta = ContaBancaria;

// Contas fictícias — usadas na tela de Contas, no Painel e nos formulários.
// Nubank é a única "real" por enquanto; as demais são exemplos futuros.
export const contas: Conta[] = [
  {
    id: "nubank",
    nome: "Nubank",
    banco: "Nu Pagamentos",
    tipo: "conta",
    tipoConta: "corrente",
    emoji: "🏦",
    cor: "peach",
    saldoAtual: 5430.70,
    saldoInicial: 3000.00,
    dataSaldoInicial: "01/01/2026",
    ultimaAtualizacao: "Hoje",
    lancamentosPrevistos: 4,
  },
  {
    id: "dinheiro",
    nome: "Dinheiro",
    banco: "Carteira",
    tipo: "conta",
    tipoConta: "dinheiro",
    emoji: "💵",
    cor: "sage",
    saldoAtual: 180.00,
    saldoInicial: 200.00,
    dataSaldoInicial: "01/06/2026",
    ultimaAtualizacao: "3 dias atrás",
    lancamentosPrevistos: 0,
  },
  {
    id: "poupanca",
    nome: "Poupança",
    banco: "Nubank",
    tipo: "conta",
    tipoConta: "poupanca",
    emoji: "🐷",
    cor: "butter",
    saldoAtual: 2500.00,
    saldoInicial: 2000.00,
    dataSaldoInicial: "01/01/2026",
    ultimaAtualizacao: "1 semana atrás",
    lancamentosPrevistos: 1,
  },
  {
    id: "conta-viagem",
    nome: "Conta de viagem",
    banco: "Wise",
    tipo: "conta",
    tipoConta: "viagem",
    emoji: "✈️",
    cor: "plum",
    saldoAtual: 320.00,
    saldoInicial: 0,
    dataSaldoInicial: "10/05/2026",
    ultimaAtualizacao: "2 semanas atrás",
    lancamentosPrevistos: 2,
    observacao: "Reserva para a viagem de fim de ano",
  },
];
