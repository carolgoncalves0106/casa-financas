/**
 * Ponto único de entrada para todos os dados fictícios do projeto.
 * Todas as telas devem importar daqui — ex: `import { contas, categoriasDespesas } from "@/lib/mock"`.
 * Isso evita dados duplicados ou divergentes espalhados pelos componentes.
 */

export * from "./categorias";
export * from "./contas";
export * from "./cartoes";
export * from "./contas-fixas";
export * from "./lancamentos";
export * from "./resumo";
export * from "./relatorios";
export * from "./configuracoes";

import { contas, type Conta } from "./contas";
import { cartoes, type Cartao } from "./cartoes";

export type Origem = Conta | Cartao;

// "Origem" de um lançamento = uma conta OU um cartão — usado no formulário
// de novo lançamento e em qualquer outro lugar que precise das duas listas juntas.
export const origensDisponiveis: Origem[] = [...contas, ...cartoes];
