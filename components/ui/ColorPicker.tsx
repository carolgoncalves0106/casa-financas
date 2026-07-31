"use client";

import { cn } from "@/lib/utils";
import { CorConta } from "@/lib/types";

interface ColorPickerProps {
  label: string;
  options: { value: CorConta; label: string }[];
  value: CorConta;
  onChange: (value: CorConta) => void;
}

// Classes de fundo por cor — sempre os tokens da identidade visual
const swatchBg: Record<CorConta, string> = {
  peach: "bg-peach",
  sage: "bg-sage",
  butter: "bg-butter",
  plum: "bg-plum",
  slate2: "bg-slate2",
  bloom: "bg-bloom",
  clay: "bg-clay",
};

export default function ColorPicker({ label, options, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-soft">{label}</label>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            aria-label={opt.label}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-150 flex items-center justify-center",
              swatchBg[opt.value],
              value === opt.value
                ? "ring-2 ring-offset-2 ring-ink/30 scale-110"
                : "hover:scale-105"
            )}
          >
            {value === opt.value && <span className="h-2 w-2 rounded-full bg-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
