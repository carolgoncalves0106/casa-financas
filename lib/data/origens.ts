import { getContas } from "./contas";
import { getCartoes } from "./cartoes";

export interface OrigemOpcao {
  id: string;
  nome: string;
  emoji: string;
  tipo: "conta" | "cartao";
}

/** Contas + cartões juntos — usado em qualquer seletor de "conta ou cartão". */
export async function getOrigens(): Promise<OrigemOpcao[]> {
  const [contas, cartoes] = await Promise.all([getContas(), getCartoes()]);

  return [
    ...contas.filter((c) => !c.arquivada).map((c) => ({ id: c.id, nome: c.nome, emoji: c.emoji, tipo: "conta" as const })),
    ...cartoes.filter((c) => !c.arquivado).map((c) => ({ id: c.id, nome: c.nome, emoji: c.emoji, tipo: "cartao" as const })),
  ];
}
