"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, SlidersHorizontal, PlusCircle, Archive } from "lucide-react";
import { ContaBancaria } from "@/lib/types";
import { formatBRL, cn } from "@/lib/utils";
import ActionMenu from "@/components/ui/ActionMenu";

const corStyles: Record<ContaBancaria["cor"], string> = {
  peach: "bg-peach",
  sage: "bg-sage",
  butter: "bg-butter",
  plum: "bg-plum",
  slate2: "bg-slate2",
  bloom: "bg-bloom",
  clay: "bg-clay",
};

export default function AccountCard({ conta }: { conta: ContaBancaria }) {
  const [arquivada, setArquivada] = useState(!!conta.arquivada);

  function handleArquivar() {
    const confirmado = window.confirm(
      `Arquivar "${conta.nome}"? Ela deixa de aparecer nas listas ativas, mas o histórico é mantido. (demonstração — nada é salvo ainda)`
    );
    if (confirmado) setArquivada(true);
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5 transition-opacity",
        arquivada && "opacity-55"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Link href={`/contas/${conta.id}`} className="group flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center text-lg text-white shrink-0",
              corStyles[conta.cor]
            )}
          >
            {conta.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-ink truncate group-hover:underline decoration-1 underline-offset-2">
              {conta.nome}
            </p>
            <p className="text-xs text-ink-faint truncate">{conta.banco}</p>
          </div>
        </Link>

        <ActionMenu
          items={[
            { label: "Ver detalhes", icon: Eye, href: `/contas/${conta.id}` },
            { label: "Editar conta", icon: Pencil, href: `/contas/${conta.id}/editar` },
            { label: "Ajustar saldo", icon: SlidersHorizontal, href: `/contas/${conta.id}/ajustar-saldo` },
            { label: "Adicionar lançamento", icon: PlusCircle, href: "/lancamentos/novo" },
            { label: "Arquivar conta", icon: Archive, onClick: handleArquivar, destructive: true },
          ]}
        />
      </div>

      <p className="text-xs text-ink-faint">Saldo atual</p>
      <p className="font-display font-semibold text-2xl text-ink tracking-tight leading-none mt-1">
        {formatBRL(conta.saldoAtual)}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
        <span className="text-[11px] text-ink-faint">
          Inicial {formatBRL(conta.saldoInicial)}
        </span>
        <span className="text-[11px] text-ink-faint">{conta.ultimaAtualizacao}</span>
      </div>

      {(conta.lancamentosPrevistos > 0 || arquivada) && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {conta.lancamentosPrevistos > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-butter-soft text-clay">
              🕓 {conta.lancamentosPrevistos} previsto{conta.lancamentosPrevistos > 1 ? "s" : ""}
            </span>
          )}
          {arquivada && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-ink/5 text-ink-faint">
              📦 Arquivada
            </span>
          )}
        </div>
      )}
    </div>
  );
}
