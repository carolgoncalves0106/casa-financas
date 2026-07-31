import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/utils";

type Tone = "entrada" | "saida" | "entrada-prevista" | "saida-prevista";

interface SummaryCardProps {
  label: string;
  valor: number;
  icon: LucideIcon;
  hint?: string;
  /**
   * Quando true, aplica a variação "featured" — usada no Saldo atual.
   * Precisa continuar visivelmente maior que os demais (span duplo +
   * fonte maior) para manter a hierarquia do dashboard.
   */
  featured?: boolean;
  tone?: Tone;
}

const toneStyles: Record<
  Tone,
  { bg: string; border: string; iconBg: string; iconText: string }
> = {
  entrada: {
    bg: "bg-sage-soft",
    border: "border-sage/15",
    iconBg: "bg-white",
    iconText: "text-sage",
  },
  saida: {
    bg: "bg-bloom-soft",
    border: "border-bloom/15",
    iconBg: "bg-white",
    iconText: "text-bloom",
  },
  "entrada-prevista": {
    bg: "bg-butter-soft",
    border: "border-butter/20",
    iconBg: "bg-white",
    iconText: "text-clay",
  },
  "saida-prevista": {
    bg: "bg-peach-soft",
    border: "border-peach/20",
    iconBg: "bg-white",
    iconText: "text-clay",
  },
};

const featuredStyle = {
  bg: "bg-gradient-to-br from-white to-peach-soft",
  border: "border-black/5",
  iconBg: "bg-white",
  iconText: "text-clay",
};

export default function SummaryCard({
  label,
  valor,
  icon: Icon,
  hint,
  featured = false,
  tone = "entrada",
}: SummaryCardProps) {
  const styles = featured ? featuredStyle : toneStyles[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border",
        featured ? "p-3.5 sm:p-4 col-span-2" : "p-2.5 sm:p-3",
        styles.bg,
        styles.border
      )}
    >
      <div className={cn("flex items-start justify-between", featured ? "mb-2" : "mb-1.5")}>
        <p
          className={cn(
            "font-medium leading-tight",
            featured ? "text-sm text-ink-soft" : "text-xs text-ink/70"
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-xl flex items-center justify-center",
            styles.iconBg,
            featured ? "h-8 w-8" : "h-6 w-6"
          )}
        >
          <Icon size={featured ? 16 : 13} className={styles.iconText} strokeWidth={2.3} />
        </span>
      </div>
      <p
        className={cn(
          "font-display font-semibold tracking-tight text-ink leading-none",
          featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        )}
      >
        {formatBRL(valor)}
      </p>
      {hint && <p className="text-[10px] text-ink/55 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}
