"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContaFixa, StatusContaFixa } from "@/lib/types";
import { pausarContaFixa, retomarContaFixa, pularContaFixa, arquivarContaFixa } from "@/lib/data/contas-fixas-actions";
import FixedBillCard from "./FixedBillCard";

interface FixedBillsBoardProps {
  itens: ContaFixa[];
}

const grupos: { status: StatusContaFixa[]; titulo: string; emoji: string }[] = [
  { status: ["vencida"], titulo: "Vencidas", emoji: "🔴" },
  { status: ["proxima"], titulo: "Próximas", emoji: "📅" },
  { status: ["paga"], titulo: "Pagas no mês", emoji: "✅" },
  { status: ["pausada", "pulada"], titulo: "Pausadas ou puladas", emoji: "⏸️" },
];

export default function FixedBillsBoard({ itens }: FixedBillsBoardProps) {
  const router = useRouter();
  const [processando, setProcessando] = useState<string | null>(null);

  async function executar(id: string, acao: () => Promise<{ error: string | null }>) {
    setProcessando(id);
    const resultado = await acao();
    setProcessando(null);

    if (resultado.error) {
      alert(`Não foi possível concluir: ${resultado.error}`);
      return;
    }
    router.refresh();
  }

  async function confirmarArquivar(conta: ContaFixa) {
    const ok = window.confirm(`Arquivar "${conta.nome}"? Ela para de gerar lançamentos previstos.`);
    if (!ok) return;
    executar(conta.id, () => arquivarContaFixa(conta.id));
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {grupos.map((grupo) => {
        const contasDoGrupo = itens.filter((c) => grupo.status.includes(c.status));
        if (contasDoGrupo.length === 0) return null;

        return (
          <div key={grupo.titulo} className="rounded-2xl sm:rounded-3xl bg-cream-soft/50 p-3 sm:p-4">
            <h2 className="font-display text-sm sm:text-base font-semibold text-ink mb-2.5 px-1">
              {grupo.emoji} {grupo.titulo}
              <span className="text-ink-faint font-normal"> · {contasDoGrupo.length}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {contasDoGrupo.map((conta) => (
                <FixedBillCard
                  key={conta.id}
                  conta={conta}
                  processando={processando === conta.id}
                  onPausar={() => executar(conta.id, () => pausarContaFixa(conta.id))}
                  onRetomar={() => executar(conta.id, () => retomarContaFixa(conta.id))}
                  onPular={() => executar(conta.id, () => pularContaFixa(conta.id))}
                  onArquivar={() => confirmarArquivar(conta)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {itens.length === 0 && (
        <p className="text-sm text-ink-faint text-center py-10">Nenhuma conta fixa cadastrada ainda.</p>
      )}
    </div>
  );
}
