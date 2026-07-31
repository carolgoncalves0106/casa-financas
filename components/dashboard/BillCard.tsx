import { CreditCard } from "lucide-react";
import { formatBRL, cn } from "@/lib/utils";

interface BillCardProps {
  titular: string;
  valor: number;
  corAccent: "plum" | "slate2";
}

const accentStyles = {
  plum: {
    border: "border-plum/20",
    bg: "bg-plum-soft",
    badge: "bg-plum text-white",
    text: "text-plum",
  },
  slate2: {
    border: "border-slate2/20",
    bg: "bg-slate2-soft",
    badge: "bg-slate2 text-white",
    text: "text-slate2",
  },
};

export default function BillCard({ titular, valor, corAccent }: BillCardProps) {
  const s = accentStyles[corAccent];
  return (
    <div
      className={cn(
        "relative rounded-2xl p-2.5 sm:p-3 border overflow-hidden",
        s.border,
        s.bg
      )}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={cn("rounded-lg p-1.5 shrink-0", s.badge)}>
          <CreditCard size={12} strokeWidth={2.3} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-ink-soft leading-tight truncate">
            Fatura atual
          </p>
          <p className={cn("text-xs font-semibold leading-tight truncate", s.text)}>
            Cartão {titular}
          </p>
        </div>
      </div>
      <p className="font-display font-semibold text-lg sm:text-xl text-ink tracking-tight leading-none">
        {formatBRL(valor)}
      </p>
      <p className="text-[10px] text-ink-faint mt-1 leading-snug">
        Não afeta o saldo em conta
      </p>
    </div>
  );
}
