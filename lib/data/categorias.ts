import { createClient } from "@/lib/supabase/server";
import { CategoriaCompleta, TipoCategoria } from "@/lib/types";

interface CategoriaRow {
  id: string;
  emoji: string;
  nome: string;
  cor: CategoriaCompleta["cor"];
  tipo: TipoCategoria;
  arquivada: boolean;
}

export async function getCategorias(tipo?: TipoCategoria, incluirArquivadas = false): Promise<CategoriaCompleta[]> {
  const supabase = createClient();

  let query = supabase.from("casa_categorias").select("*").order("nome", { ascending: true });
  if (tipo) query = query.eq("tipo", tipo);
  if (!incluirArquivadas) query = query.eq("arquivada", false);

  const { data, error } = await query;
  if (error || !data) return [];

  const { data: usados } = await supabase.from("casa_lancamentos").select("categoria_id");
  const idsComLancamento = new Set(
    ((usados ?? []) as { categoria_id: string | null }[]).map((u) => u.categoria_id).filter(Boolean)
  );

  return (data as CategoriaRow[]).map((row: CategoriaRow) => ({
    id: row.id,
    emoji: row.emoji,
    nome: row.nome,
    cor: row.cor,
    tipo: row.tipo,
    arquivada: row.arquivada,
    temLancamentos: idsComLancamento.has(row.id),
  }));
}

export async function buscarCategoriaPorNome(nome: string): Promise<CategoriaCompleta | null> {
  const todas = await getCategorias();
  return todas.find((c) => c.nome === nome) ?? null;
}
