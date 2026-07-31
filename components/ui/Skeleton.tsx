import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Placeholder de carregamento — ainda não usado em nenhuma tela (não há
 * requisições reais nesta etapa), mas fica pronto para quando os dados
 * passarem a vir do Supabase.
 */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-skeleton rounded-2xl bg-ink/10", className)}
      aria-hidden="true"
    />
  );
}

export function SummaryCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl border border-black/5 bg-white",
        featured ? "p-3.5 sm:p-4 col-span-2" : "p-3 sm:p-3.5"
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className={cn("rounded-xl", featured ? "h-9 w-9" : "h-7 w-7")} />
      </div>
      <Skeleton className={cn("rounded-lg", featured ? "h-8 w-32" : "h-6 w-24")} />
    </div>
  );
}
