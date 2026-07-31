"use client";

import { useMemo, useState } from "react";
import { Lancamento, TipoLancamento } from "@/lib/types";
import TransactionCard from "@/components/ui/TransactionCard";
import SegmentedControl from "@/components/ui/SegmentedControl";
import SectionCard from "@/components/ui/SectionCard";

type Filtro = "todos" | TipoLancamento;

export default function LancamentosList({ itens }: { itens: Lancamento[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtrados = useMemo(
    () => (filtro === "todos" ? itens : itens.filter((i) => i.tipo === filtro)),
    [itens, filtro]
  );

  const grupos = useMemo(() => {
    const acc: { titulo: string; itens: Lancamento[] }[] = [];
    for (const item of filtrados) {
      const titulo = item.quando ?? item.data;
      const ultimo = acc[acc.length - 1];
      if (ultimo && ultimo.titulo === titulo) {
        ultimo.itens.push(item);
      } else {
        acc.push({ titulo, itens: [item] });
      }
    }
    return acc;
  }, [filtrados]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <SegmentedControl
        value={filtro}
        onChange={setFiltro}
        options={[
          { value: "todos", label: "Todos" },
          { value: "entrada", label: "Entradas", emoji: "📈" },
          { value: "saida", label: "Saídas", emoji: "📉" },
          { value: "movimentacao", label: "Movim.", emoji: "🔁" },
        ]}
      />

      {grupos.length === 0 ? (
        <SectionCard title="Nenhum lançamento por aqui">
          <p className="text-sm text-ink-faint">
            Nada encontrado para este filtro ainda.
          </p>
        </SectionCard>
      ) : (
        grupos.map((grupo) => (
          <SectionCard key={grupo.titulo} title={grupo.titulo}>
            <ul className="flex flex-col gap-2">
              {grupo.itens.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))}
            </ul>
          </SectionCard>
        ))
      )}
    </div>
  );
}
