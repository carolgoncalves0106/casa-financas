"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Archive, RefreshCw } from "lucide-react";
import { ContaFixa, CategoriaCompleta } from "@/lib/types";
import { formatBRL } from "@/lib/utils";
import { createAssinatura, arquivarContaFixa } from "@/lib/data/contas-fixas-actions";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface SubscriptionsSectionProps {
  cartaoId: string;
  assinaturas: ContaFixa[];
  categorias: CategoriaCompleta[];
}

export default function SubscriptionsSection({ cartaoId, assinaturas, categorias }: SubscriptionsSectionProps) {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const [nome, setNome] = useState("");
  const [categoriaNome, setCategoriaNome] = useState(categorias[0]?.nome ?? "");
  const [valor, setValor] = useState("");
  const [dia, setDia] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  async function handleSalvar() {
    setErro(null);
    setSalvando(true);

    const resultado = await createAssinatura({ nome, categoriaNome, valor, diaVencimento: dia, cartaoId });
    setSalvando(false);

    if (resultado.error) {
      setErro(resultado.error);
      return;
    }

    setNome("");
    setValor("");
    setDia("");
    setAberta(false);
    router.refresh();
  }

  async function handleArquivar(id: string, nomeItem: string) {
    const ok = window.confirm(`Parar a assinatura "${nomeItem}"? Ela deixa de gerar cobrança nos próximos meses.`);
    if (!ok) return;

    setProcessandoId(id);
    const resultado = await arquivarContaFixa(id);
    setProcessandoId(null);

    if (resultado.error) {
      alert(`Não foi possível parar: ${resultado.error}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-base sm:text-lg font-semibold text-ink flex items-center gap-2">
          <RefreshCw size={16} className="text-clay" />
          Assinaturas recorrentes
        </h2>
      </div>
      <p className="text-xs text-ink-faint mb-3">
        Cobranças mensais automáticas neste cartão — não aparecem em Contas fixas e não precisam ser confirmadas todo mês.
      </p>

      {assinaturas.length > 0 && (
        <ul className="flex flex-col gap-2 mb-3">
          {assinaturas.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-cream-soft/60 px-3.5 py-3"
              style={{ opacity: processandoId === a.id ? 0.5 : 1 }}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{a.nome}</p>
                <p className="text-xs text-ink-faint">{a.categoria} · todo dia {a.diaVencimento}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-ink">{formatBRL(a.valorPrevisto)}</span>
                <button
                  type="button"
                  onClick={() => handleArquivar(a.id, a.nome)}
                  aria-label="Parar assinatura"
                  className="flex items-center justify-center h-7 w-7 rounded-lg text-ink-faint hover:bg-bloom-soft hover:text-bloom transition-colors"
                >
                  <Archive size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!aberta ? (
        <button
          type="button"
          onClick={() => setAberta(true)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 text-ink-soft hover:bg-cream-soft hover:text-ink transition-colors px-3.5 py-3 text-sm font-medium"
        >
          <Plus size={15} /> Nova assinatura
        </button>
      ) : (
        <div className="rounded-2xl border border-black/5 bg-cream-soft/30 p-3.5 flex flex-col gap-3 animate-field-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nome" id="assinatura-nome" placeholder="Ex: Netflix" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Select
              label="Categoria"
              id="assinatura-categoria"
              value={categoriaNome}
              onChange={(e) => setCategoriaNome(e.target.value)}
              options={categorias.map((c) => ({ value: c.nome, label: `${c.emoji} ${c.nome}` }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor" id="assinatura-valor" inputMode="decimal" placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
            <Input label="Dia da cobrança" id="assinatura-dia" type="number" min={1} max={31} placeholder="Ex: 15" value={dia} onChange={(e) => setDia(e.target.value)} />
          </div>
          {erro && <p className="text-xs text-bloom">{erro}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAberta(false)} className="text-xs font-medium text-ink-faint px-3 py-2">
              Cancelar
            </button>
            <PrimaryButton type="button" onClick={handleSalvar} disabled={salvando} fullWidthOnMobile={false}>
              {salvando ? "Salvando..." : "Adicionar"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
