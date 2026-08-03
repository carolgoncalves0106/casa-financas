"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CategoriaCompleta, CorConta, TipoCategoria, coresContaDisponiveis } from "@/lib/types";
import { createCategoria, updateCategoria, arquivarCategoria } from "@/lib/data/categorias-actions";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import Input from "@/components/ui/Input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CategoryRow from "./CategoryRow";

interface EditState {
  emoji: string;
  nome: string;
  cor: CorConta;
}

const emojisComuns = ["🏠", "🛒", "🍔", "🚗", "🩺", "👧", "🐱", "🛍️", "🎉", "💸", "💰", "💵", "🎸", "✨", "🔄", "📥", "🏋️", "📺", "🌱", "🎯"];

function makeEditState(c: CategoriaCompleta): EditState {
  return { emoji: c.emoji, nome: c.nome, cor: c.cor };
}

function NovaCategoria({ tipo }: { tipo: TipoCategoria }) {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const [emoji, setEmoji] = useState(emojisComuns[0]);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState<CorConta>(coresContaDisponiveis[0].value);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    setErro(null);
    setSalvando(true);
    const resultado = await createCategoria({ emoji, nome, cor, tipo });
    setSalvando(false);

    if (resultado.error) {
      setErro(resultado.error);
      return;
    }

    setNome("");
    setAberta(false);
    router.refresh();
  }

  if (!aberta) {
    return (
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 text-ink-soft hover:bg-cream-soft hover:text-ink transition-colors px-3.5 py-3 text-sm font-medium"
      >
        <Plus size={15} /> Nova categoria
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white px-3.5 py-4 flex flex-col gap-3 animate-field-in">
      <Input label="Nome" id={`nova-${tipo}`} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da categoria" />
      <IconPicker label="Emoji" options={emojisComuns} value={emoji} onChange={setEmoji} />
      <ColorPicker label="Cor" options={coresContaDisponiveis} value={cor} onChange={setCor} />
      {erro && <p className="text-xs text-bloom">{erro}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setAberta(false)}
          className="text-xs font-medium text-ink-faint px-3 py-2"
        >
          Cancelar
        </button>
        <PrimaryButton type="button" onClick={handleSalvar} disabled={salvando} fullWidthOnMobile={false}>
          {salvando ? "Salvando..." : "Adicionar"}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function CategoryManager({
  despesas,
  entradas,
}: {
  despesas: CategoriaCompleta[];
  entradas: CategoriaCompleta[];
}) {
  const router = useRouter();
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, EditState>>({});
  const [erroPorId, setErroPorId] = useState<Record<string, string>>({});
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  function toggleAbrir(c: CategoriaCompleta) {
    const jaAberta = abertaId === c.id;
    setAbertaId(jaAberta ? null : c.id);
    if (!jaAberta && !edits[c.id]) {
      setEdits((prev) => ({ ...prev, [c.id]: makeEditState(c) }));
    }
  }

  async function handleArquivar(c: CategoriaCompleta) {
    const ok = window.confirm(
      `Arquivar "${c.nome}"? Ela some das opções de novos lançamentos, mas o histórico é mantido.`
    );
    if (!ok) return;

    const resultado = await arquivarCategoria(c.id);
    if (resultado.error) {
      alert(`Não foi possível arquivar: ${resultado.error}`);
      return;
    }
    router.refresh();
  }

  async function handleSalvar(c: CategoriaCompleta) {
    const edit = edits[c.id];
    if (!edit) return;

    setSalvandoId(c.id);
    setErroPorId((prev) => ({ ...prev, [c.id]: "" }));
    const resultado = await updateCategoria(c.id, edit);
    setSalvandoId(null);

    if (resultado.error) {
      setErroPorId((prev) => ({ ...prev, [c.id]: resultado.error! }));
      return;
    }

    setAbertaId(null);
    router.refresh();
  }

  function renderSecao(titulo: string, lista: CategoriaCompleta[], tipo: TipoCategoria) {
    return (
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5">
        <h2 className="font-display text-base sm:text-lg font-semibold text-ink mb-3">{titulo}</h2>
        <div className="flex flex-col gap-2">
          {lista.map((c) => {
            const edit = edits[c.id] ?? makeEditState(c);
            return (
              <div key={c.id} className="flex flex-col gap-1.5">
                <CategoryRow
                  categoria={c}
                  arquivada={c.arquivada}
                  aberta={abertaId === c.id}
                  onToggleAbrir={() => toggleAbrir(c)}
                  onArquivar={() => handleArquivar(c)}
                  editState={edit}
                  onEditChange={(patch) => setEdits((prev) => ({ ...prev, [c.id]: { ...edit, ...patch } }))}
                  onSalvar={() => handleSalvar(c)}
                />
                {erroPorId[c.id] && <p className="text-xs text-bloom px-1">{erroPorId[c.id]}</p>}
                {salvandoId === c.id && <p className="text-xs text-ink-faint px-1">Salvando...</p>}
              </div>
            );
          })}
          <NovaCategoria tipo={tipo} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {renderSecao("Despesas", despesas, "despesa")}
      {renderSecao("Entradas", entradas, "entrada")}
    </div>
  );
}
