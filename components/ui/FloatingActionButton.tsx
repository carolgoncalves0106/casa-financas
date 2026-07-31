"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  /**
   * "inline"   → botão normal, usado na sidebar ou no cabeçalho da página
   * "floating" → botão flutuante fixo, usado no celular
   */
  variant?: "inline" | "floating";
  label?: string;
  href?: string;
  className?: string;
}

export default function FloatingActionButton({
  variant = "inline",
  label = "Adicionar lançamento",
  href = "/lancamentos/novo",
  className,
}: FloatingActionButtonProps) {
  if (variant === "floating") {
    return (
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "fixed z-30 bottom-[76px] right-4 flex items-center gap-2 rounded-full bg-butter text-ink font-semibold text-sm pl-4 pr-5 py-3 shadow-lift active:brightness-95 transition",
          className
        )}
      >
        <Plus size={18} strokeWidth={2.5} />
        Adicionar
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] active:brightness-95 transition",
        className
      )}
    >
      <Plus size={17} strokeWidth={2.5} />
      {label}
    </Link>
  );
}
