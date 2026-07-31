"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import FloatingActionButton from "./FloatingActionButton";

interface PageHeaderProps {
  title: string;
  emoji?: string;
  subtitle?: string;
  mes?: string;
  showAddButton?: boolean;
  /** Substitui o botão padrão "Adicionar lançamento" por uma ação própria da página (ex: "+ Adicionar conta") */
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  emoji,
  subtitle,
  mes,
  showAddButton = true,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 mb-4 sm:mb-6 lg:mb-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="lg:hidden text-2xl">🏡</span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            {title} {emoji}
          </h1>
        </div>
        {subtitle && (
          <p className="text-sm text-ink-faint mt-1">{subtitle}</p>
        )}
        {action && <div className="sm:hidden mt-3">{action}</div>}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {mes && (
          <div className="flex items-center gap-1 bg-white rounded-2xl shadow-softer px-1.5 py-1.5">
            <button
              aria-label="Mês anterior"
              className="p-1.5 rounded-xl text-ink-soft hover:bg-cream-soft transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-ink px-1 min-w-[112px] text-center">
              {mes}
            </span>
            <button
              aria-label="Próximo mês"
              className="p-1.5 rounded-xl text-ink-soft hover:bg-cream-soft transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {action ? (
          <div className="hidden sm:block">{action}</div>
        ) : (
          showAddButton && <FloatingActionButton variant="inline" className="hidden sm:flex" />
        )}
      </div>
    </header>
  );
}
