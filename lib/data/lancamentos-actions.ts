"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUsuarioAutenticadoId } from "@/lib/supabase/server";
import { getOuCriarFatura } from "@/lib/data/cartoes-actions";

interface Resultado {
  error: string | null;
}

export async function deleteLancamento(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_lancamentos").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/lancamentos");
  revalidatePath("/painel");
  revalidatePath("/contas");
  revalidatePath("/cartoes");
  return { error: null };
}

export interface LancamentoInput {
  tipo: "entrada" | "saida" | "movimentacao";
  valor: string;
  categoriaNome?: string;
  descricao: string;
  data: string;
  previsto?: boolean;

  origemId?: string;
  origemTipo?: "conta" | "cartao";
  faturaId?: string;

  parcelado?: boolean;
  qtdParcelas?: string;
  comoInformar?: "total" | "parcela";
  valorParcelamento?: string;
  primeiraParcela?: string;

  subtipoMovimentacao?: "transferencia" | "ajuste" | "pagamento_fatura";
  contaDestinoId?: string;
  cartaoPagoId?: string;
  contaPagamentoId?: string;
}

function revalidarTudo() {
  revalidatePath("/lancamentos");
  revalidatePath("/painel");
  revalidatePath("/contas");
  revalidatePath("/cartoes");
}

export async function createLancamento(input: LancamentoInput): Promise<Resultado> {
  const userId = await getUsuarioAutenticadoId();
  if (!userId) return { error: "Sessão expirada — faça login novamente." };

  const supabase = createClient();
  const valor = parseFloat((input.valor || "0").replace(",", "."));
  if (!valor || valor <= 0) return { error: "Informe um valor válido." };

  const dataLancamento = input.data || new Date().toISOString().slice(0, 10);

  // ---- Movimentação financeira ----
  if (input.tipo === "movimentacao") {
    const base = {
      user_id: userId,
      tipo: "movimentacao" as const,
      subtipo_movimentacao: input.subtipoMovimentacao,
      valor,
      data: dataLancamento,
      previsto: false,
    };

    if (input.subtipoMovimentacao === "transferencia") {
      if (!input.origemId || !input.contaDestinoId) {
        return { error: "Selecione as contas de origem e destino." };
      }
      const { error } = await supabase.from("casa_lancamentos").insert({
        ...base,
        descricao: input.descricao.trim() || "Transferência",
        emoji: "🔁",
        origem_conta_id: input.origemId,
        conta_destino_id: input.contaDestinoId,
      });
      if (error) return { error: error.message };
    } else if (input.subtipoMovimentacao === "ajuste") {
      if (!input.origemId) return { error: "Selecione a conta a ajustar." };
      const { error } = await supabase.from("casa_lancamentos").insert({
        ...base,
        descricao: input.descricao.trim() || "Ajuste de saldo",
        emoji: "🎚️",
        origem_conta_id: input.origemId,
      });
      if (error) return { error: error.message };
    } else if (input.subtipoMovimentacao === "pagamento_fatura") {
      if (!input.cartaoPagoId || !input.contaPagamentoId) {
        return { error: "Selecione o cartão e a conta de pagamento." };
      }
      const { error } = await supabase.from("casa_lancamentos").insert({
        ...base,
        descricao: input.descricao.trim() || "Pagamento de fatura",
        emoji: "💳",
        origem_conta_id: input.contaPagamentoId,
        cartao_pago_id: input.cartaoPagoId,
      });
      if (error) return { error: error.message };
    } else {
      return { error: "Selecione o tipo de movimentação." };
    }

    revalidarTudo();
    return { error: null };
  }

  // ---- Entrada ----
  if (!input.origemId) return { error: "Selecione a origem." };

  let categoriaId: string | null = null;
  if (input.categoriaNome) {
    const { data } = await supabase
      .from("casa_categorias")
      .select("id")
      .eq("nome", input.categoriaNome)
      .maybeSingle();
    categoriaId = data?.id ?? null;
  }
  if (!categoriaId) return { error: "Selecione uma categoria válida." };

  if (input.tipo === "entrada") {
    const { error } = await supabase.from("casa_lancamentos").insert({
      user_id: userId,
      tipo: "entrada",
      valor,
      descricao: input.descricao.trim() || "Entrada",
      emoji: "💰",
      categoria_id: categoriaId,
      data: dataLancamento,
      previsto: false,
      origem_conta_id: input.origemId,
    });
    if (error) return { error: error.message };

    revalidarTudo();
    return { error: null };
  }

  // ---- Saída ----
  const camposOrigem =
    input.origemTipo === "cartao"
      ? { origem_cartao_id: input.origemId, origem_conta_id: null }
      : { origem_conta_id: input.origemId, origem_cartao_id: null };

  // Se a pessoa escolheu manualmente uma fatura (só existe pra cartão),
  // resolve pro ID real em casa_faturas — é essa escolha que manda,
  // sobrepondo o cálculo automático por dia de fechamento.
  let faturaIdReal: string | null = null;
  if (input.origemTipo === "cartao" && input.faturaId) {
    faturaIdReal = await getOuCriarFatura(input.origemId!, input.faturaId, userId);
  }

  if (!input.parcelado) {
    const { error } = await supabase.from("casa_lancamentos").insert({
      user_id: userId,
      tipo: "saida",
      valor,
      descricao: input.descricao.trim() || "Saída",
      emoji: "🛒",
      categoria_id: categoriaId,
      data: dataLancamento,
      previsto: !!input.previsto,
      fatura_id: faturaIdReal,
      ...camposOrigem,
    });
    if (error) return { error: error.message };

    revalidarTudo();
    return { error: null };
  }

  // Saída parcelada — gera uma linha por parcela
  const totalParcelas = parseInt(input.qtdParcelas || "0", 10);
  if (!totalParcelas || totalParcelas < 2) {
    return { error: "Informe a quantidade de parcelas (mínimo 2)." };
  }

  let valorParcela: number;
  if (input.origemTipo === "cartao") {
    // No cartão o valor informado é o total da compra — divide pelas parcelas.
    valorParcela = valor / totalParcelas;
  } else {
    const valorInformado = parseFloat((input.valorParcelamento || "0").replace(",", "."));
    if (!valorInformado) return { error: "Informe o valor total ou o valor da parcela." };
    valorParcela = input.comoInformar === "parcela" ? valorInformado : valorInformado / totalParcelas;
  }

  const primeiraData = input.origemTipo === "cartao" ? dataLancamento : input.primeiraParcela || dataLancamento;
  const compraParceladaId = crypto.randomUUID();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const linhas = Array.from({ length: totalParcelas }, (_, i) => {
    const d = new Date(primeiraData + "T00:00:00");
    d.setMonth(d.getMonth() + i);
    const dataParcela = d.toISOString().slice(0, 10);
    return {
      user_id: userId,
      tipo: "saida" as const,
      valor: Number(valorParcela.toFixed(2)),
      descricao: input.descricao.trim() || "Saída",
      emoji: "🛒",
      categoria_id: categoriaId,
      data: dataParcela,
      previsto: new Date(dataParcela + "T00:00:00") > hoje,
      parcela_atual: i + 1,
      parcela_total: totalParcelas,
      compra_parcelada_id: compraParceladaId,
      fatura_id: i === 0 ? faturaIdReal : null,
      ...camposOrigem,
    };
  });

  const { error } = await supabase.from("casa_lancamentos").insert(linhas);
  if (error) return { error: error.message };

  revalidarTudo();
  return { error: null };
}
