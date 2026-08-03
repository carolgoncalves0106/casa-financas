import { createClient } from "@/lib/supabase/server";
import { ContaBancaria, CorConta, TipoContaBancaria } from "@/lib/types";

interface ContaRow {
  id: string;
  nome: string;
  banco: string | null;
  tipo_conta: TipoContaBancaria;
  emoji: string;
  cor: CorConta;
  saldo_inicial: number;
  data_saldo_inicial: string;
  observacao: string | null;
  arquivada: boolean;
  updated_at: string;
}

/** "Hoje", "Ontem", "3 dias atrás"... a partir de um timestamp real do banco. */
function formatarRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 0) return "Hoje";
  if (diffDias === 1) return "Ontem";
  if (diffDias < 7) return `${diffDias} dias atrás`;

  const semanas = Math.floor(diffDias / 7);
  if (semanas === 1) return "1 semana atrás";
  if (semanas < 5) return `${semanas} semanas atrás`;

  const meses = Math.floor(diffDias / 30);
  return meses <= 1 ? "1 mês atrás" : `${meses} meses atrás`;
}

function mapConta(row: ContaRow, saldoAtual: number, lancamentosPrevistos: number): ContaBancaria {
  return {
    id: row.id,
    nome: row.nome,
    banco: row.banco ?? "",
    tipo: "conta",
    tipoConta: row.tipo_conta,
    emoji: row.emoji,
    cor: row.cor,
    saldoAtual,
    saldoInicial: Number(row.saldo_inicial),
    dataSaldoInicial: new Date(row.data_saldo_inicial + "T00:00:00").toLocaleDateString("pt-BR"),
    ultimaAtualizacao: formatarRelativo(row.updated_at),
    lancamentosPrevistos,
    observacao: row.observacao ?? undefined,
    arquivada: row.arquivada,
  };
}

/** Conta quantos lançamentos previstos existem para essa conta (0 até Lançamentos ser migrado). */
async function contarLancamentosPrevistos(contaId: string): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from("casa_lancamentos")
    .select("id", { count: "exact", head: true })
    .eq("origem_conta_id", contaId)
    .eq("previsto", true);
  return count ?? 0;
}

export async function getContas(): Promise<ContaBancaria[]> {
  const supabase = createClient();

  const [{ data: contas, error }, { data: saldos }] = await Promise.all([
    supabase.from("casa_contas").select("*").order("created_at", { ascending: true }),
    supabase.from("casa_v_saldo_contas").select("*"),
  ]);

  if (error || !contas) {
    console.error("Erro ao buscar contas:", error);
    return [];
  }

  const saldoPorConta = new Map((saldos ?? []).map((s) => [s.conta_id, Number(s.saldo_atual)]));

  return Promise.all(
    contas.map(async (row: ContaRow) => {
      const previstos = await contarLancamentosPrevistos(row.id);
      return mapConta(row, saldoPorConta.get(row.id) ?? Number(row.saldo_inicial), previstos);
    })
  );
}

export async function getConta(id: string): Promise<ContaBancaria | null> {
  const supabase = createClient();

  const [{ data: row, error }, { data: saldoRow }] = await Promise.all([
    supabase.from("casa_contas").select("*").eq("id", id).single(),
    supabase.from("casa_v_saldo_contas").select("*").eq("conta_id", id).maybeSingle(),
  ]);

  if (error || !row) return null;

  const previstos = await contarLancamentosPrevistos(id);
  const saldoAtual = saldoRow ? Number(saldoRow.saldo_atual) : Number(row.saldo_inicial);
  return mapConta(row, saldoAtual, previstos);
}
