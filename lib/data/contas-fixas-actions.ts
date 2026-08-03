"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { FrequenciaContaFixa } from "@/lib/types";

interface Resultado {
  error: string | null;
}

export interface ContaFixaInput {
  nome: string;
  categoriaNome: string;
  descricao: string;
  valor: string;
  valorFixo: boolean;
  origemNome: string;
  diaVencimento: string;
  frequencia: FrequenciaContaFixa;
  lembrete: boolean;
  dataInicio: string;
  dataFim: string;
  observacao: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolverCategoriaId(supabase: any, nome: string): Promise<string | null> {
  const { data } = await supabase.from("casa_categorias").select("id").eq("nome", nome).maybeSingle();
  return data?.id ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolverOrigem(supabase: any, nome: string): Promise<{ contaId: string | null; cartaoId: string | null }> {
  const { data: conta } = await supabase.from("casa_contas").select("id").eq("nome", nome).maybeSingle();
  if (conta) return { contaId: conta.id, cartaoId: null };

  const { data: cartao } = await supabase.from("casa_cartoes").select("id").eq("nome", nome).maybeSingle();
  if (cartao) return { contaId: null, cartaoId: cartao.id };

  return { contaId: null, cartaoId: null };
}

async function montarPayload(input: ContaFixaInput) {
  const supabase = createClient();
  const categoriaId = await resolverCategoriaId(supabase, input.categoriaNome);
  const { contaId, cartaoId } = await resolverOrigem(supabase, input.origemNome);

  return {
    nome: input.nome.trim(),
    categoria_id: categoriaId,
    descricao: input.descricao.trim() || null,
    valor_previsto: parseFloat(input.valor.replace(",", ".")) || 0,
    valor_fixo: input.valorFixo,
    origem_conta_id: contaId,
    origem_cartao_id: cartaoId,
    dia_vencimento: parseInt(input.diaVencimento, 10) || 1,
    frequencia: input.frequencia,
    lembrete: input.lembrete,
    data_inicio: input.dataInicio || new Date().toISOString().slice(0, 10),
    data_fim: input.dataFim || null,
    observacao: input.observacao.trim() || null,
  };
}

export async function createContaFixa(input: ContaFixaInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa conta fixa antes de salvar." };

  const supabase = createClient();
  const payload = await montarPayload(input);

  if (!payload.categoria_id) return { error: "Selecione uma categoria válida." };

  const { error } = await supabase.from("casa_contas_fixas").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  return { error: null };
}

export async function updateContaFixa(id: string, input: ContaFixaInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa conta fixa antes de salvar." };

  const supabase = createClient();
  const payload = await montarPayload(input);

  const { error } = await supabase.from("casa_contas_fixas").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  revalidatePath(`/contas-fixas/${id}`);
  return { error: null };
}

export async function arquivarContaFixa(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_contas_fixas").update({ arquivada: true }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  return { error: null };
}

export async function pausarContaFixa(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_contas_fixas").update({ pausada: true }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  return { error: null };
}

export async function retomarContaFixa(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_contas_fixas").update({ pausada: false }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  return { error: null };
}

export async function pularContaFixa(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase
    .from("casa_lancamentos")
    .update({ pulado: true })
    .eq("conta_fixa_id", id)
    .eq("previsto", true);

  if (error) return { error: error.message };

  revalidatePath("/contas-fixas");
  return { error: null };
}

export interface MarcarContaFixaPagaInput {
  contaFixaId: string;
  valorPago: number;
  data: string;
  origemNome: string;
  observacao: string;
  usarNovoValorNosProximosMeses: boolean;
}

export async function marcarContaFixaPaga(input: MarcarContaFixaPagaInput): Promise<Resultado> {
  const supabase = createClient();

  const { data: lancamento } = await supabase
    .from("casa_lancamentos")
    .select("id")
    .eq("conta_fixa_id", input.contaFixaId)
    .eq("previsto", true)
    .maybeSingle();

  if (!lancamento) return { error: "Não encontrei o lançamento previsto deste mês pra marcar como pago." };

  const { error: lancamentoError } = await supabase
    .from("casa_lancamentos")
    .update({
      valor: input.valorPago,
      data: input.data || new Date().toISOString().slice(0, 10),
      previsto: false,
      observacao: input.observacao.trim() || null,
    })
    .eq("id", lancamento.id);

  if (lancamentoError) return { error: lancamentoError.message };

  if (input.usarNovoValorNosProximosMeses) {
    const { error: fixaError } = await supabase
      .from("casa_contas_fixas")
      .update({ valor_previsto: input.valorPago })
      .eq("id", input.contaFixaId);
    if (fixaError) return { error: fixaError.message };
  }

  revalidatePath("/contas-fixas");
  revalidatePath("/painel");
  return { error: null };
}
