import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { Lancamento } from "@/lib/types";
import { formatBRL, cn } from "@/lib/utils";

export default function TransactionCard({ item }: { item: Lancamento }) {
  const isMov = item.tipo === "movimentacao";
  const isEntrada = item.tipo === "entrada";

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
        isMov ? "bg-cream-soft/50 opacity-80" : "hover:bg-cream-soft/60"
      )}
    >
      <span
        className={cn(
          "text-lg shrink-0 rounded-full h-9 w-9 flex items-center justify-center",
          isMov ? "bg-ink/5" : isEntrada ? "bg-sage-soft" : "bg-bloom-soft"
        )}
      >
        {item.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium truncate flex items-center gap-1.5", isMov ? "text-ink-soft" : "text-ink")}>
          {item.descricao}
          {item.parcela && (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-butter-soft text-clay">
              {item.parcela.atual}/{item.parcela.total}
            </span>
          )}
        </p>
        <p className="text-xs text-ink-faint truncate">
          {item.categoria} · {item.origem}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={cn(
            "text-sm font-semibold inline-flex items-center gap-1",
            isMov ? "text-ink-faint" : isEntrada ? "text-sage" : "text-ink"
          )}
        >
          {isMov ? (
            <ArrowLeftRight size={13} className="text-ink-faint" />
          ) : isEntrada ? (
            <ArrowUpRight size={13} className="text-sage" />
          ) : (
            <ArrowDownLeft size={13} className="text-bloom" />
          )}
          {isEntrada ? "+ " : isMov ? "" : "- "}
          {formatBRL(item.valor)}
        </span>
        <span className="text-xs text-ink-faint">{item.quando ?? item.data}</span>
      </div>
    </li>
  );
}
