"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import SectionCard from "@/components/ui/SectionCard";
import Toggle from "@/components/ui/Toggle";
import Select from "@/components/ui/Select";
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart";
import CategorySummaryList from "@/components/dashboard/CategorySummaryList";
import { CategoriaGasto } from "@/lib/types";
import { MesEvolucao } from "@/lib/mock/relatorios";
import { formatBRL } from "@/lib/utils";

interface ReportsPageProps {
  anos: number[];
  meses: string[];
  evolucao: MesEvolucao[];
  gastosPorCategoria: CategoriaGasto[];
  categoriaAoLongoDoAno: Record<string, number[]>;
  origens: string[];
}

export default function ReportsPage({
  anos,
  meses,
  evolucao,
  gastosPorCategoria,
  categoriaAoLongoDoAno,
  origens,
}: ReportsPageProps) {
  const [ano, setAno] = useState(anos[anos.length - 1]);
  const [mesesSelecionados, setMesesSelecionados] = useState<string[]>(meses.slice(0, evolucao.length));
  const [origem, setOrigem] = useState("todas");
  const [categoria, setCategoria] = useState("todas");
  const [status, setStatus] = useState<"realizado" | "previsto">("realizado");
  const [categoriaGrafico, setCategoriaGrafico] = useState(Object.keys(categoriaAoLongoDoAno)[0]);

  function toggleMes(mes: string) {
    setMesesSelecionados((prev) =>
      prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes]
    );
  }

  const totalGastos = gastosPorCategoria.reduce((soma, c) => soma + c.valor, 0);

  const ranking = useMemo(
    () => [...gastosPorCategoria].sort((a, b) => b.valor - a.valor),
    [gastosPorCategoria]
  );

  const dadosEvolucaoCategoria = useMemo(
    () =>
      (categoriaAoLongoDoAno[categoriaGrafico] ?? []).map((valor, i) => ({
        mes: evolucao[i]?.mes ?? `Mês ${i + 1}`,
        valor,
      })),
    [categoriaGrafico, categoriaAoLongoDoAno, evolucao]
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Filtros */}
      <SectionCard title="Filtros">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Ano"
              id="ano"
              value={String(ano)}
              onChange={(e) => setAno(Number(e.target.value))}
              options={anos.map((a) => ({ value: String(a), label: String(a) }))}
            />
            <Select
              label="Origem"
              id="origem-relatorio"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              options={[{ value: "todas", label: "Todas as origens" }, ...origens.map((o) => ({ value: o, label: o }))]}
            />
            <Select
              label="Categoria"
              id="categoria-relatorio"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              options={[
                { value: "todas", label: "Todas as categorias" },
                ...gastosPorCategoria.map((c) => ({ value: c.nome, label: `${c.emoji} ${c.nome}` })),
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Meses</label>
            <div className="flex flex-wrap gap-1.5">
              {meses.map((mes) => (
                <button
                  key={mes}
                  type="button"
                  onClick={() => toggleMes(mes)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    mesesSelecionados.includes(mes)
                      ? "bg-clay text-white border-clay"
                      : "bg-cream-soft text-ink-soft border-transparent hover:bg-white"
                  }`}
                >
                  {mes}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="Realizado ou previsto?"
            value={status}
            onChange={setStatus}
            options={[
              { value: "realizado", label: "Realizado" },
              { value: "previsto", label: "Previsto" },
            ]}
          />
        </div>
      </SectionCard>

      {/* Despesas por categoria + Onde foi nosso dinheiro */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <SectionCard title="Despesas por categoria" subtitle="Nubank, Cartão Carol e Cartão Mitch">
          <CategoryDonutChart dados={gastosPorCategoria} total={totalGastos} />
        </SectionCard>
        <SectionCard title="Onde foi nosso dinheiro?">
          <CategorySummaryList dados={gastosPorCategoria} />
        </SectionCard>
      </section>

      {/* Evolução mensal / comparação entre meses */}
      <SectionCard title="Evolução mensal" subtitle="Comparação entre meses — entradas x saídas">
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucao} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DA" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#A69C8E" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A69C8E" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                formatter={(v: number) => formatBRL(v)}
                contentStyle={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }}
              />
              <Bar dataKey="entradas" fill="#8FB596" radius={[8, 8, 0, 0]} name="Entradas" />
              <Bar dataKey="saidas" fill="#DE9C97" radius={[8, 8, 0, 0]} name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Categoria ao longo do ano */}
      <SectionCard title="Uma categoria ao longo do ano">
        <div className="mb-4 max-w-xs">
          <Select
            label="Categoria"
            id="categoria-evolucao"
            value={categoriaGrafico}
            onChange={(e) => setCategoriaGrafico(e.target.value)}
            options={Object.keys(categoriaAoLongoDoAno).map((c) => ({ value: c, label: c }))}
          />
        </div>
        <div className="h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosEvolucaoCategoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DA" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#A69C8E" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A69C8E" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }} />
              <Line type="monotone" dataKey="valor" stroke="#C97F5D" strokeWidth={2.5} dot={{ r: 3 }} name={categoriaGrafico} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Ranking das maiores categorias */}
      <SectionCard title="Ranking das maiores categorias">
        <ul className="flex flex-col gap-2">
          {ranking.map((c, i) => (
            <li key={c.nome} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-cream-soft/60">
              <span className="text-xs font-semibold text-ink-faint w-5 shrink-0">{i + 1}º</span>
              <span className="text-lg shrink-0">{c.emoji}</span>
              <span className="text-sm text-ink flex-1 min-w-0 truncate">{c.nome}</span>
              <span className="text-sm font-semibold text-ink shrink-0">{formatBRL(c.valor)}</span>
              <span className="text-xs text-ink-faint w-10 text-right shrink-0">{c.percentual}%</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <p className="text-xs text-ink-faint px-1">
        Os relatórios consideram despesas em contas, Cartão Carol e Cartão Mitch — pagamentos de
        fatura, transferências e ajustes de saldo são movimentações e não entram aqui.
      </p>
    </div>
  );
}
