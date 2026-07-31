"use client";

import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
  emoji?: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /**
   * "soft"   → padrão, discreto (usado em filtros e no tipo de lançamento)
   * "strong" → maior contraste no estado ativo (usado em Realizado/Previsto)
   */
  tone?: "soft" | "strong";
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  tone = "soft",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl bg-cream-soft p-1 w-full sm:w-auto",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 sm:flex-none whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? tone === "strong"
                  ? "bg-clay text-white shadow-soft font-semibold"
                  : "bg-white text-ink shadow-softer"
                : "text-ink-soft hover:text-ink"
            )}
          >
            {opt.emoji && <span className="mr-1.5">{opt.emoji}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
