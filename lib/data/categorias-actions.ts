"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CorConta, TipoCategoria } from "@/lib/types";

interface Resultado {
  error: string | null;
}

export interface CategoriaInput {
  emoji: string;
  nome: string;
  cor: CorConta;
}

export async function createCategoria(input: CategoriaInput & { tipo: TipoCategoria }): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa categoria antes de salvar." };

  const supabase = createClient();
  const { error } = await supabase.from("casa_categorias").insert({
    emoji: input.emoji,
    nome: input.nome.trim(),
    cor: input.cor,
    tipo: input.tipo,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe uma categoria com esse nome." : error.message,
    };
  }

  revalidatePath("/categorias");
  return { error: null };
}

export async function updateCategoria(id: string, input: CategoriaInput): Promise<Resultado> {
  if (!input.nome.trim()) return { error: "Dá um nome pra essa categoria antes de salvar." };

  const supabase = createClient();
  const { error } = await supabase
    .from("casa_categorias")
    .update({ emoji: input.emoji, nome: input.nome.trim(), cor: input.cor })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/categorias");
  return { error: null };
}

export async function arquivarCategoria(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("casa_categorias").update({ arquivada: true }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/categorias");
  return { error: null };
}
