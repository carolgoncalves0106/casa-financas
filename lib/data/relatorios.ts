import { createClient } from "@/lib/supabase/server";
import { primeiroRelacionado } from "@/lib/utils";

export const mesesDoAno = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export interface MesEvolucao {
  mes: string;
  entradas: number;
  saidas: number;
}

export async function getAnosDisponiveis(): Promise<number[]> {
  const supabase = createClient();
  const anoAtual = new Date().getFullYear();

  const { data } = await supabase.from("casa_lancamentos").select("data").order("data", { ascending: true }).limit(1);
  const primeiroAno = data && data[0] ? new Date(data[0].data).getFullYear() : anoAtual;

  const anos: number[] = [];
  for (let a = primeiroAno; a <= anoAtual; a++) anos.push(a);
  return anos.length > 0 ? anos : [anoAtual];
}

/** Evolução mensal (entradas x saídas realizadas) de um ano inteiro. */
export async function getEvolucaoMensal(ano: number): Promise<MesEvolucao[]> {
  const supabase = createClient();
  const inicio = `${ano}-01-01`;
  const fim = `${ano}-12-31`;

  const { data } = await supabase
    .from("casa_v_resumo_mensal")
    .select("*")
    .eq("previsto", false)
    .gte("mes", inicio)
    .lte("mes", fim);

  const porMes: MesEvolucao[] = mesesDoAno.map((mes) => ({ mes, entradas: 0, saidas: 0 }));

  for (const row of data ?? []) {
    const indiceMes = new Date(row.mes).getMonth();
    if (row.tipo === "entrada") porMes[indiceMes].entradas = Number(row.total);
    else porMes[indiceMes].saidas = Number(row.total);
  }

  return porMes;
}

/** Uma série mensal (12 valores) por categoria de despesa, ao longo de um ano. */
export async function getCategoriaAoLongoDoAno(ano: number): Promise<Record<string, number[]>> {
  const supabase = createClient();
  const inicio = `${ano}-01-01`;
  const fim = `${ano}-12-31`;

  const { data } = await supabase
    .from("casa_lancamentos")
    .select("valor, data, casa_categorias(nome)")
    .eq("tipo", "saida")
    .eq("previsto", false)
    .gte("data", inicio)
    .lte("data", fim);

  const resultado: Record<string, number[]> = {};

  for (const row of (data ?? []) as { valor: number; data: string; casa_categorias: { nome: string }[] | null }[]) {
    const nomeCategoria = primeiroRelacionado(row.casa_categorias)?.nome;
    if (!nomeCategoria) continue;
    if (!resultado[nomeCategoria]) resultado[nomeCategoria] = new Array(12).fill(0);
    const mes = new Date(row.data).getMonth();
    resultado[nomeCategoria][mes] += Number(row.valor);
  }

  return resultado;
}
