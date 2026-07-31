export type StatusConta = "vencida" | "vence-em-breve" | "paga" | "futura";

export interface ContaItem {
  id: string;
  emoji: string;
  descricao: string;
  categoria: string;
  vencimento: string; // dd/mm
  valor: number;
  status: StatusConta;
}

export interface CategoriaGasto {
  emoji: string;
  nome: string;
  valor: number;
  percentual: number;
  cor: string;
}

export type TipoLancamento = "entrada" | "saida" | "movimentacao";

export interface Lancamento {
  id: string;
  emoji: string;
  descricao: string;
  categoria: string;
  origem: string;
  data: string;
  /** Rótulo relativo opcional, ex: "Hoje", "Ontem" — usado no lugar da data quando disponível */
  quando?: string;
  valor: number;
  tipo: TipoLancamento;
  /** true = ainda não aconteceu (previsto) · omitido/false = já realizado */
  previsto?: boolean;
  /** Presente quando o lançamento é uma parcela de uma compra parcelada */
  parcela?: { atual: number; total: number };
}

// ---- Contas bancárias ----

export type TipoContaBancaria = "corrente" | "dinheiro" | "poupanca" | "viagem" | "outro";

// Paleta de acento disponível para personalizar cada conta — sempre alinhada
// às cores da identidade visual (lib/design-system.ts)
export type CorConta = "peach" | "sage" | "butter" | "plum" | "slate2" | "bloom" | "clay";

export interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  tipo: "conta"; // discrimina de Cartao no union "Origem"
  tipoConta: TipoContaBancaria;
  emoji: string;
  cor: CorConta;
  saldoAtual: number;
  saldoInicial: number;
  dataSaldoInicial: string; // dd/mm/aaaa
  ultimaAtualizacao: string; // rótulo relativo, ex: "Hoje", "3 dias atrás"
  lancamentosPrevistos: number;
  observacao?: string;
  arquivada?: boolean;
}

export const tiposContaBancaria: { value: TipoContaBancaria; label: string }[] = [
  { value: "corrente", label: "Conta corrente" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "poupanca", label: "Poupança" },
  { value: "viagem", label: "Conta de viagem" },
  { value: "outro", label: "Outro" },
];

export const iconesContaDisponiveis = ["🏦", "💵", "🐷", "✈️", "💳", "🏠", "🎯", "📱", "💰", "🌱"];

export const coresContaDisponiveis: { value: CorConta; label: string }[] = [
  { value: "peach", label: "Pêssego" },
  { value: "sage", label: "Verde-sálvia" },
  { value: "butter", label: "Amarelo-manteiga" },
  { value: "plum", label: "Ameixa" },
  { value: "slate2", label: "Azul-acinzentado" },
  { value: "bloom", label: "Rosa suave" },
  { value: "clay", label: "Terracota" },
];

// ---- Cartões de crédito ----

export type StatusFatura = "aberta" | "fechada" | "paga";

export interface Fatura {
  id: string;
  label: string;
}

export interface CartaoCredito {
  id: string;
  nome: string;
  titular: string;
  tipo: "cartao"; // discrimina de ContaBancaria no union "Origem"
  emoji: string;
  cor: CorConta;
  bandeira?: string;
  limite?: number;
  fechamento?: number; // dia do mês, opcional
  vencimento?: number; // dia do mês, opcional
  faturaAtual: number;
  statusFatura: StatusFatura;
  faturas: Fatura[];
  arquivado?: boolean;
  /** Só o Cartão Carol afeta o saldo de uma conta ao pagar a fatura */
  afetaContaAoPagar: boolean;
}

// ---- Contas fixas ----

export type StatusContaFixa = "proxima" | "vencida" | "paga" | "pausada" | "pulada";
export type FrequenciaContaFixa = "mensal" | "semanal" | "anual" | "personalizada";

export const frequenciasContaFixa: { value: FrequenciaContaFixa; label: string }[] = [
  { value: "mensal", label: "Mensal" },
  { value: "semanal", label: "Semanal" },
  { value: "anual", label: "Anual" },
  { value: "personalizada", label: "Personalizada" },
];

export interface ContaFixa {
  id: string;
  nome: string;
  categoria: string;
  emoji: string;
  descricao?: string;
  valorPrevisto: number;
  valorFixo: boolean; // true = valor fixo · false = estimado
  origem: string; // nome de uma conta ou cartão
  diaVencimento: number;
  frequencia: FrequenciaContaFixa;
  status: StatusContaFixa;
  lembrete?: boolean;
  dataInicio?: string;
  dataFim?: string;
  observacao?: string;
}

// ---- Categorias (versão rica, com edição) ----

export type TipoCategoria = "despesa" | "entrada";

export interface CategoriaCompleta {
  id: string;
  emoji: string;
  nome: string;
  cor: CorConta;
  tipo: TipoCategoria;
  arquivada?: boolean;
  /** true quando já existem lançamentos usando essa categoria — trava exclusão definitiva */
  temLancamentos: boolean;
}

// ---- Configurações ----

export interface UsuarioCasa {
  id: string;
  nome: string;
  emoji: string;
  cor: CorConta;
}
