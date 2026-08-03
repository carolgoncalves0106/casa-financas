"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, ShoppingBag, Pencil, CheckCircle2, Archive } from "lucide-react";
import { CartaoCredito } from "@/lib/types";
import { formatBRL, cn } from "@/lib/utils";
import ActionMenu from "@/components/ui/ActionMenu";
import { arquivarCartao } from "@/lib/data/cartoes-actions";

const corStyles: Record<CartaoCredito["cor"], string> = {
  peach: "bg-peach",
  sage: "bg-sage",
  butter: "bg-butter",
  plum: "bg-plum",
  slate2: "bg-slate2",
  bloom: "bg-bloom",
  clay: "bg-clay",
};

const statusStyles = {
  aberta: { label: "Aberta", bg: "bg-status-soonSoft", text: "text-status-soon" },
  fechada: { label: "Fechada", bg: "bg-status-futureSoft", text: "text-status-future" },
  paga: { label: "Paga", bg: "bg-status-paidSoft", text: "text-status-paid" },
};

export default function CardTile({ cartao }: { cartao: CartaoCredito }) {
  const router = useRouter();
  const status = statusStyles[cartao.statusFatura];
  const disponivel = cartao.limite !== undefined ? cartao.limite - cartao.faturaAtual : undefined;

  async function handleArquivar() {
    const ok = window.confirm(`Arquivar "${cartao.nome}"? O histórico é mantido.`);
    if (!ok) return;

    const resultado = await arquivarCartao(cartao.id);
    if (resultado.error) {
      alert(`Não foi possível arquivar: ${resultado.error}`);
      return;
    }
    router.refresh();
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5 transition-opacity",
        cartao.arquivado && "opacity-55"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Link href={`/cartoes/${cartao.id}`} className="group flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center text-lg text-white shrink-0",
              corStyles[cartao.cor]
            )}
          >
            {cartao.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-ink truncate group-hover:underline decoration-1 underline-offset-2">
              {cartao.nome}
            </p>
            <p className="text-xs text-ink-faint truncate">
              {cartao.titular}
              {cartao.bandeira ? ` · ${cartao.bandeira}` : ""}
            </p>
          </div>
        </Link>

        <ActionMenu
          items={[
            { label: "Ver fatura", icon: Eye, href: `/cartoes/${cartao.id}` },
            { label: "Adicionar compra", icon: ShoppingBag, href: "/lancamentos/novo" },
            { label: "Editar cartão", icon: Pencil, href: `/cartoes/${cartao.id}/editar` },
            { label: "Marcar fatura como paga", icon: CheckCircle2, href: `/cartoes/${cartao.id}/pagar` },
            { label: "Arquivar cartão", icon: Archive, onClick: handleArquivar, destructive: true },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-faint">Fatura atual</p>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", status.bg, status.text)}>
          {status.label}
        </span>
      </div>
      <p className="font-display font-semibold text-2xl text-ink tracking-tight leading-none mt-1">
        {formatBRL(cartao.faturaAtual)}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 text-[11px] text-ink-faint">
        <span>{cartao.vencimento ? `Vence dia ${cartao.vencimento}` : "Vencimento não informado"}</span>
        {cartao.fechamento && <span>Fecha dia {cartao.fechamento}</span>}
      </div>

      {(cartao.limite !== undefined || cartao.arquivado) && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {cartao.limite !== undefined && disponivel !== undefined && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-sage-soft text-sage">
              💳 {formatBRL(disponivel)} disponível de {formatBRL(cartao.limite)}
            </span>
          )}
          {cartao.arquivado && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-ink/5 text-ink-faint">
              📦 Arquivado
            </span>
          )}
        </div>
      )}
    </div>
  );
}
