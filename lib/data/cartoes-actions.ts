"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUsuarioAutenticadoId } from "@/lib/supabase/server";
import { CorConta } from "@/lib/types";

interface Resultado {
  error: string | null;
}

export interface CartaoInput {
  nome: string;
  titular: string;
  emoji: string;
  cor: CorConta;
  bandeira: string;
  limite: string;
  fechamento: string;
  vencimento: string;
}

function paraInteiroOuNull(v: string): number | null {
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

function paraNumeroOuNull(v: string): number | null {
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) ? null : n;
}

export async function createCartao(input: CartaoInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pro cartão antes de salvar." };

  const userId = await getUsuarioAutenticadoId();
  if (!userId) return { error: "Sessão expirada — faça login novamente." };

  const supabase = createClient();
  const { error } = await supabase.from("casa_cartoes").insert({
    user_id: userId,
    nome: input.nome.trim(),
    titular: input.titular.trim(),
    emoji: input.emoji,
    cor: input.cor,
    bandeira: input.bandeira.trim() || null,
    limite: paraNumeroOuNull(input.limite),
    dia_fechamento: paraInteiroOuNull(input.fechamento),
    dia_vencimento: paraInteiroOuNull(input.vencimento),
  });

  if (error) return { error: error.message };
  revalidatePath("/cartoes");
  return { error: null };
}

export async function updateCartao(id: string, input: CartaoInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pro cartão antes de salvar." };

  const supabase = createClient();
  const { error } = await supabase
    .from("casa_cartoes")
    .update({
      nome: input.nome.trim(),
      titular: input.titular.trim(),
      emoji: input.emoji,
      cor: input.cor,
      bandeira: input.bandeira.trim() || null,
      limite: paraNumeroOuNull(input.limite),
      dia_fechamento: paraInteiroOuNull(input.fechamento),
      dia_vencimento: paraInteiroOuNull(input.vencimento),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/cartoes");
  revalidatePath(`/cartoes/${id}`);
  return { error: null };
}

export async function arquivarCartao(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_cartoes").update({ arquivado: true }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/cartoes");
  return { error: null };
}

export interface PagarFaturaInput {
  cartaoId: string;
  competencia: string; // aaaa-mm-01
  valorFatura: number;
  valorPago: number;
  data: string;
  contaId?: string; // só quando o cartão afeta o saldo de uma conta ao pagar (Carol)
  observacao: string;
}

export async function marcarFaturaPaga(input: PagarFaturaInput): Promise<Resultado> {
  const userId = await getUsuarioAutenticadoId();
  if (!userId) return { error: "Sessão expirada — faça login novamente." };

  const supabase = createClient();

  // Registro da fatura em si — sempre acontece, pago afetando conta ou não.
  const { error: faturaError } = await supabase.from("casa_faturas").upsert(
    {
      user_id: userId,
      cartao_id: input.cartaoId,
      competencia: input.competencia,
      status: "paga",
      valor_pago: input.valorPago,
      data_pagamento: input.data || new Date().toISOString().slice(0, 10),
      conta_pagamento_id: input.contaId ?? null,
      observacao: input.observacao.trim() || null,
    },
    { onConflict: "cartao_id,competencia" }
  );

  if (faturaError) return { error: faturaError.message };

  // Só gera movimentação financeira (afeta saldo de conta) quando o cartão
  // está configurado pra isso — ex: Cartão Carol sim, Cartão Mitch não.
  if (input.contaId) {
    const { error: lancamentoError } = await supabase.from("casa_lancamentos").insert({
      user_id: userId,
      tipo: "movimentacao",
      subtipo_movimentacao: "pagamento_fatura",
      valor: input.valorPago,
      descricao: "Pagamento de fatura",
      emoji: "💳",
      data: input.data || new Date().toISOString().slice(0, 10),
      previsto: false,
      origem_conta_id: input.contaId,
      cartao_pago_id: input.cartaoId,
      observacao: input.observacao.trim() || null,
    });
    if (lancamentoError) return { error: lancamentoError.message };
  }

  revalidatePath("/cartoes");
  revalidatePath(`/cartoes/${input.cartaoId}`);
  revalidatePath("/contas");
  revalidatePath("/painel");
  return { error: null };
}
