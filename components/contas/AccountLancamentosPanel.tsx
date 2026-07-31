"use client";

import { useMemo, useState } from "react";
import { Lancamento, TipoLancamento } from "@/lib/types";
import TransactionCard from "@/components/ui/TransactionCard";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Toggle from "@/components/ui/Toggle";
import Select from "@/components/ui/Select";
import SectionCard from "@/components/ui/SectionCard";

type FiltroTipo = "todos" | TipoLancamento;
type FiltroStatus = "realizado" | "previsto";

export default function AccountLancamentosPanel({ itens }: { itens: Lancamento[] }) {
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [status, setStatus] = useState<FiltroStatus>("realizado");
  const [categoria, setCategoria] = useState("todas");

  const categoriasDisponiveis = useMemo(
    () => Array.from(new Set(itens.map((i) => i.categoria))),
    [itens]
  );

  const filtrados = useMemo(() => {
    return itens.filter((i) => {
      const ehPrevisto = !!i.previsto;
      if ((status === "previsto") !== ehPrevisto) return false;
      if (tipo !== "todos" && i.tipo !== tipo) return false;
      if (categoria !== "todas" && i.categoria !== categoria) return false;
      return true;
    });
  }, [itens, tipo, status, categoria]);

  return (
    <SectionCard title="Lançamentos da conta">
      <div className="flex flex-col gap-3 mb-4">
        <Toggle
          value={status}
          onChange={setStatus}
          options={[
            { value: "realizado", label: "Realizado" },
            { value: "previsto", label: "Previsto" },
          ]}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <SegmentedControl
            className="flex-1"
            value={tipo}
            onChange={setTipo}
            options={[
              { value: "todos", label: "Todos" },
              { value: "entrada", label: "Entradas", emoji: "📈" },
              { value: "saida", label: "Saídas", emoji: "📉" },
              { value: "movimentacao", label: "Movim.", emoji: "🔁" },
            ]}
          />
          <Select
            label="Categoria"
            id="categoria-filtro"
            containerClassName="sm:w-56"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            options={[
              { value: "todas", label: "Todas as categorias" },
              ...categoriasDisponiveis.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-sm text-ink-faint py-6 text-center">
          Nenhum lançamento {status === "previsto" ? "previsto" : "realizado"} encontrado para esse filtro.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtrados.map((item) => (
            <TransactionCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
