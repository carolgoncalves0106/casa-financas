import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
}

export default function EmptyState({ icon: Icon, titulo, descricao }: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-white border border-dashed border-black/10 p-10 sm:p-14 flex flex-col items-center text-center gap-3">
      <span className="rounded-2xl bg-cream-soft p-4">
        <Icon size={26} className="text-clay" strokeWidth={1.8} />
      </span>
      <h2 className="font-display text-lg font-semibold text-ink">{titulo}</h2>
      <p className="text-sm text-ink-faint max-w-sm">{descricao}</p>
    </div>
  );
}
