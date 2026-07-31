"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

/**
 * Menu "⋯" reutilizável — abre uma lista de ações ancorada ao botão,
 * fecha ao clicar fora. Usado nos cards de conta, cartão etc.
 */
export default function ActionMenu({ items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Mais ações"
        aria-expanded={open}
        className="flex items-center justify-center h-7 w-7 rounded-lg text-ink-faint hover:bg-cream-soft hover:text-ink transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-30 w-48 rounded-2xl bg-white shadow-lift border border-black/5 py-1.5 animate-field-in"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon size={15} className={item.destructive ? "text-bloom" : "text-ink-faint"} />
                {item.label}
              </>
            );
            const itemClass = cn(
              "flex items-center gap-2.5 px-3.5 py-2 text-sm w-full text-left transition-colors",
              item.destructive ? "text-bloom hover:bg-bloom-soft/60" : "text-ink hover:bg-cream-soft"
            );

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={itemClass} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                className={itemClass}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
