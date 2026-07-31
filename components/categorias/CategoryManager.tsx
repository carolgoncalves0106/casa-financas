"use client";

import { useState } from "react";
import { Categoria } from "@/lib/mock";
import { CorConta } from "@/lib/types";
import CategoryRow from "./CategoryRow";

interface EditState {
  emoji: string;
  nome: string;
  cor: CorConta;
}

function makeEditState(c: Categoria): EditState {
  return { emoji: c.emoji, nome: c.nome, cor: c.cor };
}

export default function CategoryManager({ despesas, entradas }: { despesas: Categoria[]; entradas: Categoria[] }) {
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Partial<EditState>>>({});
  const [arquivadas, setArquivadas] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<Record<string, EditState>>({});

  function categoriaComOverride(c: Categoria): Categoria {
    return { ...c, ...overrides[c.id] };
  }

  function toggleAbrir(c: Categoria) {
    const jaAberta = abertaId === c.id;
    setAbertaId(jaAberta ? null : c.id);
    if (!jaAberta && !edits[c.id]) {
      setEdits((prev) => ({ ...prev, [c.id]: makeEditState(categoriaComOverride(c)) }));
    }
  }

  function handleArquivar(c: Categoria) {
    const ok = window.confirm(
      `Arquivar "${c.nome}"? Ela some das opções de novos lançamentos, mas o histórico é mantido. (demonstração — nada é salvo ainda)`
    );
    if (ok) setArquivadas((prev) => new Set(prev).add(c.id));
  }

  function handleSalvar(c: Categoria) {
    const edit = edits[c.id];
    if (edit) setOverrides((prev) => ({ ...prev, [c.id]: edit }));
    setAbertaId(null);
  }

  function renderSecao(titulo: string, lista: Categoria[]) {
    return (
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5">
        <h2 className="font-display text-base sm:text-lg font-semibold text-ink mb-3">{titulo}</h2>
        <div className="flex flex-col gap-2">
          {lista.map((original) => {
            const c = categoriaComOverride(original);
            const edit = edits[original.id] ?? makeEditState(c);
            return (
              <CategoryRow
                key={original.id}
                categoria={c}
                arquivada={arquivadas.has(original.id)}
                aberta={abertaId === original.id}
                onToggleAbrir={() => toggleAbrir(original)}
                onArquivar={() => handleArquivar(original)}
                editState={edit}
                onEditChange={(patch) =>
                  setEdits((prev) => ({ ...prev, [original.id]: { ...edit, ...patch } }))
                }
                onSalvar={() => handleSalvar(original)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {renderSecao("Despesas", despesas)}
      {renderSecao("Entradas", entradas)}
    </div>
  );
}
