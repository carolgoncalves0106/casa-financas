"use client";

import { useState } from "react";
import { ContaFixa, StatusContaFixa } from "@/lib/types";
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
  // Estado local só para a demonstração — nada é persistido ainda.
  const [overrides, setOverrides] = useState<Record<string, StatusContaFixa>>({});
  const [arquivadas, setArquivadas] = useState<Set<string>>(new Set());

  function statusAtual(conta: ContaFixa) {
    return overrides[conta.id] ?? conta.status;
  }

  function setStatus(id: string, status: StatusContaFixa) {
    setOverrides((prev) => ({ ...prev, [id]: status }));
  }

  function confirmarArquivar(conta: ContaFixa) {
    const ok = window.confirm(
      `Arquivar "${conta.nome}"? Ela para de gerar lançamentos previstos. (demonstração — nada é salvo ainda)`
    );
    if (ok) setArquivadas((prev) => new Set(prev).add(conta.id));
  }

  const visiveis = itens.filter((c) => !arquivadas.has(c.id));

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {grupos.map((grupo) => {
        const contasDoGrupo = visiveis.filter((c) => grupo.status.includes(statusAtual(c)));
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
                  conta={{ ...conta, status: statusAtual(conta) }}
                  onPausar={() => setStatus(conta.id, "pausada")}
                  onRetomar={() => setStatus(conta.id, conta.status === "vencida" ? "vencida" : "proxima")}
                  onPular={() => setStatus(conta.id, "pulada")}
                  onArquivar={() => confirmarArquivar(conta)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {visiveis.length === 0 && (
        <p className="text-sm text-ink-faint text-center py-10">Nenhuma conta fixa cadastrada ainda.</p>
      )}
    </div>
  );
}
