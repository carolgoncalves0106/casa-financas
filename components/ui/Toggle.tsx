"use client";

import { cn } from "@/lib/utils";

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleProps<T extends string> {
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  /**
   * "soft"   → padrão, discreto (ex: À vista ou parcelado)
   * "strong" → maior contraste no estado ativo (ex: Previsto ou realizado)
   */
  tone?: "soft" | "strong";
}

/**
 * Switch de duas opções com uma pastilha que desliza suavemente entre elas.
 * Reutilizado em qualquer escolha binária do formulário.
 */
export default function Toggle<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = "soft",
}: ToggleProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-ink-soft">{label}</label>}
      <div className="relative grid grid-cols-2 rounded-2xl bg-cream-soft p-1">
        <div
          className={cn(
            "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl transition-transform duration-200 ease-out",
            tone === "strong" ? "bg-clay shadow-soft" : "bg-white shadow-softer"
          )}
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={opt.value === value}
            className={cn(
              "relative z-10 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200",
              opt.value === value
                ? tone === "strong"
                  ? "text-white font-semibold"
                  : "text-ink"
                : "text-ink-soft hover:text-ink"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
