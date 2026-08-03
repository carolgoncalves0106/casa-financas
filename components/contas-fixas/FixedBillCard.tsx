"use client";

import Link from "next/link";
import { Pencil, CheckCircle2, Pause, SkipForward, Archive, Play } from "lucide-react";
import { ContaFixa } from "@/lib/types";
import { formatBRL, cn } from "@/lib/utils";
import ActionMenu from "@/components/ui/ActionMenu";

const statusStyles: Record<ContaFixa["status"], { label: string; bg: string; text: string }> = {
  vencida: { label: "Vencida", bg: "bg-status-lateSoft", text: "text-status-late" },
  proxima: { label: "Vence em breve", bg: "bg-status-soonSoft", text: "text-status-soon" },
  paga: { label: "Paga", bg: "bg-status-paidSoft", text: "text-status-paid" },
  pausada: { label: "Pausada", bg: "bg-ink/5", text: "text-ink-faint" },
  pulada: { label: "Pulada este mês", bg: "bg-ink/5", text: "text-ink-faint" },
};

const frequenciaLabel: Record<ContaFixa["frequencia"], string> = {
  mensal: "Mensal",
  semanal: "Semanal",
  anual: "Anual",
  personalizada: "Personalizada",
};

interface FixedBillCardProps {
  conta: ContaFixa;
  processando?: boolean;
  onPausar: () => void;
  onRetomar: () => void;
  onPular: () => void;
  onArquivar: () => void;
}

export default function FixedBillCard({ conta, processando, onPausar, onRetomar, onPular, onArquivar }: FixedBillCardProps) {
  const status = statusStyles[conta.status];
  const pausadaOuPulada = conta.status === "pausada" || conta.status === "pulada";

  return (
    <div className={cn("rounded-2xl bg-white border border-black/5 shadow-soft p-3.5 sm:p-4 transition-opacity", processando && "opacity-55")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-xl shrink-0">{conta.emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{conta.nome}</p>
            <p className="text-xs text-ink-faint truncate">
              {conta.categoria} · dia {conta.diaVencimento} · {frequenciaLabel[conta.frequencia]} · {conta.origem}
            </p>
          </div>
        </div>
        <ActionMenu
          items={[
            { label: "Marcar como paga", icon: CheckCircle2, href: `/contas-fixas/${conta.id}/pagar` },
            { label: "Editar", icon: Pencil, href: `/contas-fixas/${conta.id}/editar` },
            pausadaOuPulada
              ? { label: "Retomar", icon: Play, onClick: onRetomar }
              : { label: "Pausar", icon: Pause, onClick: onPausar },
            { label: "Pular este mês", icon: SkipForward, onClick: onPular },
            { label: "Arquivar", icon: Archive, onClick: onArquivar, destructive: true },
          ]}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-ink">
          {conta.valorFixo ? "" : "~ "}
          {formatBRL(conta.valorPrevisto)}
        </span>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", status.bg, status.text)}>
          {status.label}
        </span>
      </div>

      {conta.observacao && (
        <p className="text-[11px] text-ink-faint mt-2 leading-snug">💬 {conta.observacao}</p>
      )}
    </div>
  );
}
