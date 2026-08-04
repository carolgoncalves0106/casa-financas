export function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Extrai o registro de um relacionamento aninhado do Supabase/PostgREST
 * (ex: `casa_categorias(nome)` dentro de um `.select()`).
 *
 * Sem tipos gerados a partir do schema (Database), o cliente do Supabase tipa
 * relações N-para-1 como array (`{ nome: string }[]`) em vez de objeto único
 * — mesmo quando, no banco, cada linha só pode ter um relacionado. Esta
 * função aceita os dois formatos, então o código que a usa não quebra se
 * esse comportamento mudar.
 */
export function primeiroRelacionado<T>(valor: T[] | T | null | undefined): T | undefined {
  if (!valor) return undefined;
  return Array.isArray(valor) ? valor[0] : valor;
}
