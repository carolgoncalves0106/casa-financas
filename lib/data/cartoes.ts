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

/**
 * A qual competência (mês da fatura, identificado pelo mês do VENCIMENTO)
 * uma data pertence, dado o dia de fechamento do cartão.
 *
 * Regra: uma fatura que fecha no mês M vence no mês M+1 — por isso a fatura
 * é rotulada pelo mês do vencimento, não do fechamento (é assim que a
 * maioria dos cartões reais funciona: fecha ~1 semana antes de vencer, e o
 * vencimento cai no mês seguinte ao fechamento).
 *
 * - Compra com dia ≤ dia de fechamento → fecha NESTE mês → fatura do mês seguinte
 * - Compra com dia > dia de fechamento → fecha no mês seguinte → fatura de 2 meses à frente
 *
 * Sem dia de fechamento cadastrado, cai de volta para o mês-calendário puro
 * (comportamento antigo, mais simples) — é o melhor que dá pra fazer sem
 * essa informação.
 */
export function competenciaDaData(dataISO: string, diaFechamento: number | null): string {
  const d = new Date(dataISO + "T00:00:00");
  let mes = d.getMonth(); // 0-indexado
  let ano = d.getFullYear();

  if (diaFechamento) {
    const dia = d.getDate();
    mes += dia <= diaFechamento ? 1 : 2;
  }
  // sem dia_fechamento: mês-calendário puro (mes fica como está, sem deslocar)

  ano += Math.floor(mes / 12);
  mes = ((mes % 12) + 12) % 12;
  return `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
}

/** A competência "atual" — a fatura que está aberta, acumulando compras, hoje. */
function competenciaAtualDoCartao(diaFechamento: number | null): string {
  const hoje = new Date();
  const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  return competenciaDaData(hojeISO, diaFechamento);
}

function labelCompetencia(competencia: string): string {
  const d = new Date(competencia + "T00:00:00");
  const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Gera a fatura atual + a próxima, pro seletor da tela de detalhe. */
function gerarFaturas(diaFechamento: number | null): Fatura[] {
  const atual = competenciaAtualDoCartao(diaFechamento);
  const [ano, mes] = atual.split("-").map(Number);
  const proximaData = new Date(ano, mes, 1); // mes já é 1-indexado aqui por causa do split, então isso já é o mês seguinte
  const proxima = `${proximaData.getFullYear()}-${String(proximaData.getMonth() + 1).padStart(2, "0")}-01`;

  return [
    { id: atual, label: `${labelCompetencia(atual)} (atual)` },
    { id: proxima, label: labelCompetencia(proxima) },
  ];
}

interface CompraRow {
  valor: number;
  data: string;
  fatura_id: string | null;
}

/**
 * Soma as compras (não previstas) desse cartão que pertencem à fatura-alvo.
 *
 * Prioridade: se a compra tem `fatura_id` preenchido (a pessoa escolheu a
 * fatura manualmente ao lançar), usa esse vínculo direto — ignora o cálculo
 * automático por dia de fechamento. Só cai no cálculo automático quando a
 * compra não tem fatura_id (ninguém escolheu manualmente).
 */
async function valorDaFatura(
  cartaoId: string,
  diaFechamento: number | null,
  competenciaAlvo: string,
  faturaAlvoId: string | null
): Promise<number> {
  const supabase = createClient();
  const { data: compras } = await supabase
    .from("casa_lancamentos")
    .select("valor, data, fatura_id")
    .eq("origem_cartao_id", cartaoId)
    .eq("tipo", "saida")
    .eq("previsto", false);

  return ((compras ?? []) as CompraRow[])
    .filter((c) =>
      c.fatura_id
        ? c.fatura_id === faturaAlvoId
        : competenciaDaData(c.data, diaFechamento) === competenciaAlvo
    )
    .reduce((soma, c) => soma + Number(c.valor), 0);
}

interface FaturaRow {
  id: string;
  status: string;
}

async function faturaAtualDoCartao(
  cartaoId: string,
  diaFechamento: number | null
): Promise<{ valor: number; status: StatusFatura; competencia: string; faturaId: string | null }> {
  const supabase = createClient();
  const competencia = competenciaAtualDoCartao(diaFechamento);

  const { data: faturaRow } = await supabase
    .from("casa_faturas")
    .select("id, status")
    .eq("cartao_id", cartaoId)
    .eq("competencia", competencia)
    .maybeSingle();

  const fatura = faturaRow as FaturaRow | null;

  if (fatura?.status === "paga") {
    return { valor: 0, status: "paga", competencia, faturaId: fatura.id };
  }

  const valor = await valorDaFatura(cartaoId, diaFechamento, competencia, fatura?.id ?? null);
  return { valor, status: (fatura?.status as StatusFatura) ?? "aberta", competencia, faturaId: fatura?.id ?? null };
}

function mapCartao(
  row: CartaoRow,
  faturaAtual: number,
  statusFatura: StatusFatura,
  faturaAtualId: string | null
): CartaoCredito {
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
    faturaAtualId: faturaAtualId ?? undefined,
    statusFatura,
    faturas: gerarFaturas(row.dia_fechamento),
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
      const { valor, status, faturaId } = await faturaAtualDoCartao(row.id, row.dia_fechamento);
      return mapCartao(row, valor, status, faturaId);
    })
  );
}

export async function getCartao(id: string): Promise<CartaoCredito | null> {
  const supabase = createClient();
  const { data: row, error } = await supabase.from("casa_cartoes").select("*").eq("id", id).single();
  if (error || !row) return null;

  const cartaoRow = row as CartaoRow;
  const { valor, status, faturaId } = await faturaAtualDoCartao(id, cartaoRow.dia_fechamento);
  return mapCartao(cartaoRow, valor, status, faturaId);
}
