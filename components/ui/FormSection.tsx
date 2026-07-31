import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Aplica uma pequena animação de entrada — usado quando a seção aparece dinamicamente (ex: parcelamento) */
  animated?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  className,
  animated = false,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5 lg:p-6",
        animated && "animate-field-in",
        className
      )}
    >
      <div className="mb-4">
        <h2 className="font-display text-base sm:text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-xs text-ink-faint mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
