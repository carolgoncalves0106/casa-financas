import { StatusConta } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<StatusConta, { label: string; bg: string; text: string; dot: string }> = {
  vencida: { label: "Vencida", bg: "bg-status-lateSoft", text: "text-status-late", dot: "bg-status-late" },
  "vence-em-breve": { label: "Vence em breve", bg: "bg-status-soonSoft", text: "text-status-soon", dot: "bg-status-soon" },
  paga: { label: "Paga", bg: "bg-status-paidSoft", text: "text-status-paid", dot: "bg-status-paid" },
  futura: { label: "Em dia", bg: "bg-status-paidSoft", text: "text-status-paid", dot: "bg-status-paid" },
};

export default function StatusBadge({ status }: { status: StatusConta }) {
  const c = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        c.bg,
        c.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
