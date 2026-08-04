import { createClient } from "@/lib/supabase/server";
import { CategoriaGasto } from "@/lib/types";

interface SaldoContaRow {
  saldo_atual: number;
}

interface LancamentoResumoRow {
  tipo: "entrada" | "saida";
  valor: number;
  previsto: boolean;
}

interface GastoCategoriaRow {
  emoji: string;
  nome: string;
  valor: number;
  cor: CategoriaGasto["cor"];
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

export async function getSaldoTotal(): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase.from("casa_v_saldo_contas").select("saldo_atual");
  return ((data ?? []) as SaldoContaRow[]).reduce(
    (soma: number, r: SaldoContaRow) => soma + Number(r.saldo_atual),
    0
  );
}

export interface ResumoMes {
  saldoAtual: number;
  entradasMes: number;
  saidasMes: number;
  entradasPrevistas: number;
  saidasPrevistas: number;
}

export async function getResumoMes(): Promise<ResumoMes> {
  const supabase = createClient();
  const { inicio, fim } = competenciaAtual();

  const [{ data: lancamentos }, saldoAtual] = await Promise.all([
    supabase
      .from("casa_lancamentos")
      .select("tipo, valor, previsto")
      .gte("data", inicio)
      .lte("data", fim)
      .in("tipo", ["entrada", "saida"]),
    getSaldoTotal(),
  ]);

  let entradasMes = 0;
  let saidasMes = 0;
  let entradasPrevistas = 0;
  let saidasPrevistas = 0;

  for (const l of (lancamentos ?? []) as LancamentoResumoRow[]) {
    const valor = Number(l.valor);
    if (l.tipo === "entrada") {
      if (l.previsto) entradasPrevistas += valor;
      else entradasMes += valor;
    } else {
      if (l.previsto) saidasPrevistas += valor;
      else saidasMes += valor;
    }
  }

  return { saldoAtual, entradasMes, saidasMes, entradasPrevistas, saidasPrevistas };
}

export async function getGastosPorCategoriaMes(): Promise<CategoriaGasto[]> {
  const supabase = createClient();
  const { inicio } = competenciaAtual();

  const { data } = await supabase.from("casa_v_gastos_por_categoria_mes").select("*").eq("mes", inicio);
  const linhas = (data ?? []) as GastoCategoriaRow[];
  if (linhas.length === 0) return [];

  const total = linhas.reduce((soma: number, r: GastoCategoriaRow) => soma + Number(r.valor), 0);

  return linhas
    .map((r: GastoCategoriaRow) => ({
      emoji: r.emoji,
      nome: r.nome,
      valor: Number(r.valor),
      percentual: total > 0 ? Math.round((Number(r.valor) / total) * 100) : 0,
      cor: r.cor,
    }))
    .sort((a: CategoriaGasto, b: CategoriaGasto) => b.valor - a.valor);
}
