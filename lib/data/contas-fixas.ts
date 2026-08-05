import { createClient, getUsuarioAutenticadoId } from "@/lib/supabase/server";
import { ContaFixa, StatusContaFixa, FrequenciaContaFixa } from "@/lib/types";
import { primeiroRelacionado } from "@/lib/utils";

interface ContaFixaRow {
  id: string;
  nome: string;
  emoji: string;
  descricao: string | null;
  valor_previsto: number;
  valor_fixo: boolean;
  origem_conta_id: string | null;
  origem_cartao_id: string | null;
  categoria_id: string;
  dia_vencimento: number;
  frequencia: FrequenciaContaFixa;
  lembrete: boolean;
  pausada: boolean;
  arquivada: boolean;
  data_inicio: string;
  data_fim: string | null;
  observacao: string | null;
  oculta: boolean;
  confirmacao_automatica: boolean;
  casa_categorias: { nome: string }[] | null;
}

interface LancamentoDoMes {
  id: string;
  data: string;
  valor: number;
  previsto: boolean;
  pulado: boolean;
}

function competenciaAtual(): { inicio: string; fim: string } {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  return {
    inicio: `${ano}-${String(mes + 1).padStart(2, "0")}-01`,
    fim: `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`,
  };
}

function dataDoVencimentoEsteMes(dia: number): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const diaSeguro = Math.min(dia, ultimoDia);
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaSeguro).padStart(2, "0")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function garantirLancamentoDoMes(supabase: any, row: ContaFixaRow): Promise<LancamentoDoMes | null> {
  const { inicio, fim } = competenciaAtual();

  // IMPORTANTE: usamos .limit(1) em vez de .maybeSingle() de propósito —
  // .maybeSingle() dá erro se encontrar mais de uma linha, e isso já causou
  // duplicação em produção (o erro passava batido, caía no "não existe" e
  // criava outro lançamento a cada vez que a página era aberta). Com
  // .limit(1) isso nunca acontece, não importa quantas linhas existam.
  const { data: existentes } = await supabase
    .from("casa_lancamentos")
    .select("id, data, valor, previsto, pulado")
    .eq("conta_fixa_id", row.id)
    .gte("data", inicio)
    .lte("data", fim)
    .order("created_at", { ascending: true })
    .limit(1);

  if (existentes && existentes.length > 0) return existentes[0] as LancamentoDoMes;

  // Pausada, arquivada ou sem origem definida: não gera lançamento previsto.
  if (row.pausada || row.arquivada) return null;
  if (!row.origem_conta_id && !row.origem_cartao_id) return null;

  const userId = await getUsuarioAutenticadoId();
  if (!userId) return null;

  const { data: novo, error } = await supabase
    .from("casa_lancamentos")
    .insert({
      user_id: userId,
      tipo: "saida",
      valor: row.valor_previsto,
      descricao: row.nome,
      emoji: row.emoji,
      categoria_id: row.categoria_id,
      data: dataDoVencimentoEsteMes(row.dia_vencimento),
      previsto: !row.confirmacao_automatica,
      origem_conta_id: row.origem_conta_id,
      origem_cartao_id: row.origem_cartao_id,
      conta_fixa_id: row.id,
    })
    .select("id, data, valor, previsto, pulado")
    .single();

  if (error || !novo) {
    // Provável colisão com a trava única do banco (duas requisições tentando
    // criar ao mesmo tempo) — busca de novo em vez de arriscar duplicar.
    const { data: existenteAgora } = await supabase
      .from("casa_lancamentos")
      .select("id, data, valor, previsto, pulado")
      .eq("conta_fixa_id", row.id)
      .gte("data", inicio)
      .lte("data", fim)
      .order("created_at", { ascending: true })
      .limit(1);
    return existenteAgora && existenteAgora.length > 0 ? (existenteAgora[0] as LancamentoDoMes) : null;
  }

  return novo as LancamentoDoMes;
}

function determinarStatus(row: ContaFixaRow, lancamento: LancamentoDoMes | null): StatusContaFixa {
  if (row.pausada) return "pausada";
  if (!lancamento) return "proxima";
  if (lancamento.pulado) return "pulada";
  if (!lancamento.previsto) return "paga";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataLancamento = new Date(lancamento.data + "T00:00:00");
  return dataLancamento < hoje ? "vencida" : "proxima";
}

async function nomeOrigem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  contaId: string | null,
  cartaoId: string | null
): Promise<string> {
  if (contaId) {
    const { data } = await supabase.from("casa_contas").select("nome").eq("id", contaId).single();
    return data?.nome ?? "";
  }
  if (cartaoId) {
    const { data } = await supabase.from("casa_cartoes").select("nome").eq("id", cartaoId).single();
    return data?.nome ?? "";
  }
  return "";
}

function mapContaFixa(row: ContaFixaRow, lancamento: LancamentoDoMes | null, origem: string): ContaFixa {
  return {
    id: row.id,
    nome: row.nome,
    categoria: primeiroRelacionado(row.casa_categorias)?.nome ?? "",
    emoji: row.emoji,
    descricao: row.descricao ?? undefined,
    valorPrevisto: lancamento ? Number(lancamento.valor) : Number(row.valor_previsto),
    valorFixo: row.valor_fixo,
    origem,
    diaVencimento: row.dia_vencimento,
    frequencia: row.frequencia,
    status: determinarStatus(row, lancamento),
    lembrete: row.lembrete,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim ?? undefined,
    observacao: row.observacao ?? undefined,
  };
}

/**
 * Lista as contas fixas e, para cada uma, garante que exista um lançamento
 * previsto para o mês corrente (gera na hora se ainda não existir — não há
 * job/cron nesta etapa, a geração é "preguiçosa": acontece quando a tela é
 * aberta). O status (vencida/próxima/paga/pulada/pausada) vem desse lançamento.
 */
export async function getContasFixas(): Promise<ContaFixa[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("casa_contas_fixas")
    .select("*, casa_categorias(nome)")
    .eq("arquivada", false)
    .eq("oculta", false)
    .order("dia_vencimento", { ascending: true });

  if (error || !data) return [];

  const resultado: ContaFixa[] = [];
  for (const row of data as ContaFixaRow[]) {
    const lancamento = await garantirLancamentoDoMes(supabase, row);
    const origem = await nomeOrigem(supabase, row.origem_conta_id, row.origem_cartao_id);
    resultado.push(mapContaFixa(row, lancamento, origem));
  }
  return resultado;
}

/**
 * Assinaturas recorrentes de um cartão específico — usam a mesma estrutura
 * de contas fixas (oculta=true), mas aparecem só na tela do cartão, nunca em
 * Contas fixas, e o lançamento gerado já nasce realizado (sem "marcar como paga").
 */
export async function getAssinaturasPorCartao(cartaoId: string): Promise<ContaFixa[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("casa_contas_fixas")
    .select("*, casa_categorias(nome)")
    .eq("arquivada", false)
    .eq("oculta", true)
    .eq("origem_cartao_id", cartaoId)
    .order("nome", { ascending: true });

  if (error || !data) return [];

  const resultado: ContaFixa[] = [];
  for (const row of data as ContaFixaRow[]) {
    const lancamento = await garantirLancamentoDoMes(supabase, row);
    resultado.push(mapContaFixa(row, lancamento, ""));
  }
  return resultado;
}

export async function getContaFixa(id: string): Promise<ContaFixa | null> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("casa_contas_fixas")
    .select("*, casa_categorias(nome)")
    .eq("id", id)
    .single();

  if (error || !row) return null;

  const lancamento = await garantirLancamentoDoMes(supabase, row as ContaFixaRow);
  const origem = await nomeOrigem(supabase, (row as ContaFixaRow).origem_conta_id, (row as ContaFixaRow).origem_cartao_id);
  return mapContaFixa(row as ContaFixaRow, lancamento, origem);
}
