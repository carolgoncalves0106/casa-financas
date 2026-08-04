import { createClient } from "@/lib/supabase/server";
import { CartaoCredito, StatusFatura, Fatura } from "@/lib/types";

interface CartaoRow {
  id: string;
  nome: string;
  titular: string;
  emoji: string;
  cor: CartaoCredito["cor"];
  bandeira: string | null;
  limite: number | null;
  dia_fechamento: number | null;
  dia_vencimento: number | null;
  afeta_conta_ao_pagar: boolean;
  arquivado: boolean;
}

function competenciaAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/** Gera as duas próximas faturas (atual + próxima) pro seletor da tela de detalhe. */
function gerarFaturas(): Fatura[] {
  const hoje = new Date();
  const resultado: Fatura[] = [];
  for (let i = 0; i < 2; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    const capitalizado = label.charAt(0).toUpperCase() + label.slice(1);
    resultado.push({ id, label: i === 0 ? `${capitalizado} (atual)` : capitalizado });
  }
  return resultado;
}

interface FaturaValorRow {
  valor_fatura: number;
}

interface FaturaStatusRow {
  status: string;
}

async function faturaAtualDoCartao(cartaoId: string): Promise<{ valor: number; status: StatusFatura }> {
  const supabase = createClient();
  const competencia = competenciaAtual();

  const [{ data: soma }, { data: faturaRow }] = await Promise.all([
    supabase
      .from("casa_v_fatura_atual_cartao")
      .select("valor_fatura")
      .eq("cartao_id", cartaoId)
      .eq("competencia", competencia)
      .maybeSingle(),
    supabase
      .from("casa_faturas")
      .select("status")
      .eq("cartao_id", cartaoId)
      .eq("competencia", competencia)
      .maybeSingle(),
  ]);

  const somaTipada = soma as FaturaValorRow | null;
  const faturaTipada = faturaRow as FaturaStatusRow | null;

  return {
    valor: somaTipada ? Number(somaTipada.valor_fatura) : 0,
    status: (faturaTipada?.status as StatusFatura) ?? "aberta",
  };
}

function mapCartao(row: CartaoRow, faturaAtual: number, statusFatura: StatusFatura): CartaoCredito {
  return {
    id: row.id,
    nome: row.nome,
    titular: row.titular,
    tipo: "cartao",
    emoji: row.emoji,
    cor: row.cor,
    bandeira: row.bandeira ?? undefined,
    limite: row.limite ?? undefined,
    fechamento: row.dia_fechamento ?? undefined,
    vencimento: row.dia_vencimento ?? undefined,
    faturaAtual,
    statusFatura,
    faturas: gerarFaturas(),
    arquivado: row.arquivado,
    afetaContaAoPagar: row.afeta_conta_ao_pagar,
  };
}

export async function getCartoes(): Promise<CartaoCredito[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("casa_cartoes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return Promise.all(
    (data as CartaoRow[]).map(async (row) => {
      const { valor, status } = await faturaAtualDoCartao(row.id);
      return mapCartao(row, valor, status);
    })
  );
}

export async function getCartao(id: string): Promise<CartaoCredito | null> {
  const supabase = createClient();
  const { data: row, error } = await supabase.from("casa_cartoes").select("*").eq("id", id).single();
  if (error || !row) return null;

  const { valor, status } = await faturaAtualDoCartao(id);
  return mapCartao(row as CartaoRow, valor, status);
}
