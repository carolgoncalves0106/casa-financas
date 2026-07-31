"use client";

import { cn } from "@/lib/utils";

interface IconPickerProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function IconPicker({ label, options, value, onChange }: IconPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-soft">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            aria-pressed={value === emoji}
            className={cn(
              "h-11 w-11 rounded-2xl flex items-center justify-center text-xl transition-all duration-150",
              value === emoji
                ? "bg-white shadow-soft ring-2 ring-clay/50 scale-105"
                : "bg-cream-soft hover:bg-white hover:shadow-softer"
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
