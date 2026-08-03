"use client";

import { Pencil, Archive, ChevronDown } from "lucide-react";
import { CategoriaCompleta, CorConta, coresContaDisponiveis } from "@/lib/types";
import { cn } from "@/lib/utils";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import Input from "@/components/ui/Input";
import PrimaryButton from "@/components/ui/PrimaryButton";

const corBg: Record<CorConta, string> = {
  peach: "bg-peach", sage: "bg-sage", butter: "bg-butter", plum: "bg-plum",
  slate2: "bg-slate2", bloom: "bg-bloom", clay: "bg-clay",
};

const emojisComuns = ["🏠", "🛒", "🍔", "🚗", "🩺", "👧", "🐱", "🛍️", "🎉", "💸", "💰", "💵", "🎸", "✨", "🔄", "📥", "🏋️", "📺", "🌱", "🎯"];

interface CategoryRowProps {
  categoria: CategoriaCompleta;
  arquivada: boolean;
  aberta: boolean;
  onToggleAbrir: () => void;
  onArquivar: () => void;
  editState: { emoji: string; nome: string; cor: CorConta };
  onEditChange: (patch: Partial<{ emoji: string; nome: string; cor: CorConta }>) => void;
  onSalvar: () => void;
}

export default function CategoryRow({
  categoria,
  arquivada,
  aberta,
  onToggleAbrir,
  onArquivar,
  editState,
  onEditChange,
  onSalvar,
}: CategoryRowProps) {
  return (
    <div className={cn("rounded-2xl border border-black/5 bg-white overflow-hidden transition-opacity", arquivada && "opacity-55")}>
      <div className="flex items-center gap-3 px-3.5 py-3">
        <span className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-base text-white shrink-0", corBg[categoria.cor])}>
          {categoria.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{categoria.nome}</p>
          {arquivada && <p className="text-[11px] text-ink-faint">Arquivada</p>}
        </div>
        <button
          type="button"
          onClick={onToggleAbrir}
          className="flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-cream-soft transition"
        >
          <Pencil size={13} /> Editar
          <ChevronDown size={13} className={cn("transition-transform", aberta && "rotate-180")} />
        </button>
        <button
          type="button"
          onClick={onArquivar}
          disabled={arquivada}
          title={categoria.temLancamentos ? "Categorias com lançamentos não podem ser excluídas — só arquivadas" : undefined}
          className="flex items-center justify-center h-8 w-8 rounded-lg text-ink-faint hover:bg-bloom-soft/60 hover:text-bloom transition-colors disabled:opacity-40"
        >
          <Archive size={14} />
        </button>
      </div>

      {aberta && (
        <div className="animate-field-in px-3.5 pb-4 pt-1 border-t border-black/5 flex flex-col gap-3">
          <Input
            label="Nome"
            id={`nome-${categoria.id}`}
            value={editState.nome}
            onChange={(e) => onEditChange({ nome: e.target.value })}
          />
          <IconPicker
            label="Emoji"
            options={emojisComuns}
            value={editState.emoji}
            onChange={(emoji) => onEditChange({ emoji })}
          />
          <ColorPicker
            label="Cor"
            options={coresContaDisponiveis}
            value={editState.cor}
            onChange={(cor) => onEditChange({ cor })}
          />
          {categoria.temLancamentos && (
            <p className="text-[11px] text-ink-faint">
              Esta categoria já tem lançamentos — por isso não pode ser excluída, só arquivada.
            </p>
          )}
          <div className="flex justify-end">
            <PrimaryButton type="button" onClick={onSalvar} fullWidthOnMobile={false}>
              Salvar categoria
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
