import { createClient } from "@/lib/supabase/server";
import { Lancamento, TipoLancamento } from "@/lib/types";
import { primeiroRelacionado } from "@/lib/utils";

interface LancamentoRow {
  id: string;
  tipo: TipoLancamento;
  valor: number;
  descricao: string;
  emoji: string;
  data: string;
  previsto: boolean;
  parcela_atual: number | null;
  parcela_total: number | null;
  // Sem tipos gerados do schema, o Supabase tipa relações N-para-1 do
  // PostgREST como array — mesmo cada lançamento só tendo uma categoria.
  casa_categorias: { nome: string }[] | null;
}

function formatarQuando(dataISO: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(dataISO + "T00:00:00");
  const diffDias = Math.round((hoje.getTime() - data.getTime()) / 86400000);

  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Ontem";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

interface LancamentoRowCompleto extends LancamentoRow {
  origem_conta_id: string | null;
  origem_cartao_id: string | null;
  casa_contas: { nome: string }[] | null;
  casa_cartoes: { nome: string }[] | null;
}

/** Lista geral de lançamentos — usada na tela Lançamentos. */
export async function getLancamentos(): Promise<Lancamento[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("casa_lancamentos")
    .select(
      "id, tipo, valor, descricao, emoji, data, previsto, parcela_atual, parcela_total, origem_conta_id, origem_cartao_id, casa_categorias(nome), casa_contas(nome), casa_cartoes(nome)"
    )
    .order("data", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as LancamentoRowCompleto[]).map((row) => ({
    id: row.id,
    emoji: row.emoji,
    descricao: row.descricao,
    categoria:
      primeiroRelacionado(row.casa_categorias)?.nome ??
      (row.tipo === "movimentacao" ? "Movimentação financeira" : ""),
    origem: primeiroRelacionado(row.casa_contas)?.nome ?? primeiroRelacionado(row.casa_cartoes)?.nome ?? "",
    data: formatarQuando(row.data),
    dataISO: row.data,
    quando: formatarQuando(row.data),
    valor: Number(row.valor),
    tipo: row.tipo,
    previsto: row.previsto,
    parcela:
      row.parcela_atual && row.parcela_total
        ? { atual: row.parcela_atual, total: row.parcela_total }
        : undefined,
  }));
}

/** Últimos N lançamentos realizados — usado no Painel. */
export async function getUltimosLancamentos(limite = 4): Promise<Lancamento[]> {
  const todos = await getLancamentos();
  return todos.filter((l) => !l.previsto).slice(0, limite);
}

/**
 * Lançamentos de um cartão específico — usado pela tela de detalhe de Cartões.
 */
export async function getLancamentosPorCartao(cartaoId: string, nomeCartao: string): Promise<Lancamento[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("casa_lancamentos")
    .select("id, tipo, valor, descricao, emoji, data, previsto, parcela_atual, parcela_total, fatura_id, casa_categorias(nome)")
    .eq("origem_cartao_id", cartaoId)
    .order("data", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as (LancamentoRow & { fatura_id: string | null })[]).map((row) => ({
    id: row.id,
    emoji: row.emoji,
    descricao: row.descricao,
    categoria:
      primeiroRelacionado(row.casa_categorias)?.nome ??
      (row.tipo === "movimentacao" ? "Movimentação financeira" : ""),
    origem: nomeCartao,
    data: formatarQuando(row.data),
    dataISO: row.data,
    quando: formatarQuando(row.data),
    valor: Number(row.valor),
    tipo: row.tipo,
    previsto: row.previsto,
    faturaId: row.fatura_id,
    parcela:
      row.parcela_atual && row.parcela_total
        ? { atual: row.parcela_atual, total: row.parcela_total }
        : undefined,
  }));
}

/**
 * Lançamentos de uma conta específica — usado só pela tela de detalhe de
 * Contas por enquanto. A migração completa da tela Lançamentos (lista geral,
 * filtros, formulário "Adicionar lançamento") continua sendo uma etapa à parte.
 */
export async function getLancamentosPorConta(contaId: string, nomeConta: string): Promise<Lancamento[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("casa_lancamentos")
    .select("id, tipo, valor, descricao, emoji, data, previsto, parcela_atual, parcela_total, casa_categorias(nome)")
    .eq("origem_conta_id", contaId)
    .order("data", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as LancamentoRow[]).map((row) => ({
    id: row.id,
    emoji: row.emoji,
    descricao: row.descricao,
    categoria:
      primeiroRelacionado(row.casa_categorias)?.nome ??
      (row.tipo === "movimentacao" ? "Movimentação financeira" : ""),
    origem: nomeConta,
    data: formatarQuando(row.data),
    dataISO: row.data,
    quando: formatarQuando(row.data),
    valor: Number(row.valor),
    tipo: row.tipo,
    previsto: row.previsto,
    parcela:
      row.parcela_atual && row.parcela_total
        ? { atual: row.parcela_atual, total: row.parcela_total }
        : undefined,
  }));
}
