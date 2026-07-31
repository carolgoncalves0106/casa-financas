import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, subtitle, children, className }: SectionCardProps) {
  return (
    <div className={cn("rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5 lg:p-6", className)}>
      <div className="mb-4">
        <h2 className="font-display text-base sm:text-lg font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-ink-faint mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
