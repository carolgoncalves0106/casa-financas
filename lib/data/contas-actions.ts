"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUsuarioAutenticadoId } from "@/lib/supabase/server";
import { CorConta, TipoContaBancaria } from "@/lib/types";

export interface ContaInput {
  nome: string;
  banco: string;
  tipoConta: TipoContaBancaria;
  saldoInicial: number;
  dataSaldoInicial: string; // aaaa-mm-dd
  emoji: string;
  cor: CorConta;
  observacao: string;
}

interface Resultado {
  error: string | null;
}

export async function createConta(input: ContaInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa conta antes de salvar." };

  const userId = await getUsuarioAutenticadoId();
  if (!userId) return { error: "Sessão expirada — faça login novamente." };

  const supabase = createClient();
  const { error } = await supabase.from("casa_contas").insert({
    user_id: userId,
    nome: input.nome.trim(),
    banco: input.banco.trim() || null,
    tipo_conta: input.tipoConta,
    saldo_inicial: input.saldoInicial,
    data_saldo_inicial: input.dataSaldoInicial || new Date().toISOString().slice(0, 10),
    emoji: input.emoji,
    cor: input.cor,
    observacao: input.observacao.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/contas");
  return { error: null };
}

export async function updateConta(id: string, input: ContaInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa conta antes de salvar." };

  const supabase = createClient();
  const { error } = await supabase
    .from("casa_contas")
    .update({
      nome: input.nome.trim(),
      banco: input.banco.trim() || null,
      tipo_conta: input.tipoConta,
      saldo_inicial: input.saldoInicial,
      data_saldo_inicial: input.dataSaldoInicial || new Date().toISOString().slice(0, 10),
      emoji: input.emoji,
      cor: input.cor,
      observacao: input.observacao.trim() || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/contas");
  revalidatePath(`/contas/${id}`);
  return { error: null };
}

export async function arquivarConta(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_contas").update({ arquivada: true }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/contas");
  return { error: null };
}

export interface AjusteSaldoInput {
  contaId: string;
  saldoCalculado: number;
  saldoInformado: number;
  data: string; // aaaa-mm-dd
  observacao: string;
}

export async function ajustarSaldo(input: AjusteSaldoInput): Promise<Resultado> {
  const diferenca = input.saldoInformado - input.saldoCalculado;

  if (diferenca === 0) {
    return { error: "O saldo informado já é igual ao saldo calculado — nada para ajustar." };
  }

  const userId = await getUsuarioAutenticadoId();
  if (!userId) return { error: "Sessão expirada — faça login novamente." };

  const supabase = createClient();
  const { error } = await supabase.from("casa_lancamentos").insert({
    user_id: userId,
    tipo: "movimentacao",
    subtipo_movimentacao: "ajuste",
    // A view casa_v_saldo_contas subtrai "valor" de movimentações na conta de
    // origem — guardamos o valor invertido pra que o saldo se mova exatamente
    // pela diferença informada (pra cima ou pra baixo).
    valor: -diferenca,
    descricao: "Ajuste de saldo",
    emoji: "🎚️",
    data: input.data || new Date().toISOString().slice(0, 10),
    previsto: false,
    origem_conta_id: input.contaId,
    observacao: input.observacao.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/contas/${input.contaId}`);
  revalidatePath("/contas");
  revalidatePath("/painel");
  return { error: null };
}
