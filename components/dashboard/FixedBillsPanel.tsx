import Link from "next/link";
import { ContaFixa, StatusConta } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatBRL } from "@/lib/utils";

interface FixedBillsPanelProps {
  itens: ContaFixa[];
  /** Dia do mês considerado "hoje" nos dados fictícios — usado só para ordenar cronologicamente */
  diaAtual: number;
  verTodasHref?: string;
}

// Contas fixas usam um conjunto de status um pouco mais rico (inclui pausada/pulada);
// aqui mapeamos para o StatusBadge que já existe, reaproveitando o mesmo componente.
const statusParaBadge: Partial<Record<ContaFixa["status"], StatusConta>> = {
  vencida: "vencida",
  proxima: "vence-em-breve",
  paga: "paga",
};

export default function FixedBillsPanel({ itens, diaAtual, verTodasHref }: FixedBillsPanelProps) {
  // Pausadas/puladas não têm uma "próxima data" real este mês — ficam de fora
  // deste resumo do Painel e continuam visíveis na tela completa de Contas fixas.
  const visiveis = itens.filter((c) => statusParaBadge[c.status]);

  const ordenadas = [...visiveis].sort((a, b) => {
    const chave = (c: ContaFixa) =>
      c.status === "proxima" && c.diaVencimento <= diaAtual ? c.diaVencimento + 31 : c.diaVencimento;
    return chave(a) - chave(b);
  });

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5">
      <h2 className="font-display text-base sm:text-lg font-semibold text-ink mb-4">📆 Contas fixas</h2>

      {ordenadas.length === 0 ? (
        <p className="text-sm text-ink-faint py-4">Nada por aqui — tudo em dia! 🎉</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {ordenadas.map((conta) => (
            <li
              key={conta.id}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 bg-cream-soft/60 hover:bg-cream-soft transition-colors"
            >
              <span className="text-xl shrink-0">{conta.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{conta.nome}</p>
                <p className="text-xs text-ink-faint truncate">
                  {conta.categoria} · dia {conta.diaVencimento}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-semibold text-ink">{formatBRL(conta.valorPrevisto)}</span>
                <StatusBadge status={statusParaBadge[conta.status]!} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {verTodasHref && (
        <Link
          href={verTodasHref}
          className="mt-4 block text-center text-sm font-medium text-clay hover:brightness-90 transition"
        >
          Ver todas
        </Link>
      )}
    </div>
  );
}
