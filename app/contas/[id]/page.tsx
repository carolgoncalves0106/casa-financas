import { notFound } from "next/navigation";
import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, CalendarPlus, CalendarMinus, SlidersHorizontal, Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import SummaryCard from "@/components/ui/SummaryCard";
import AccountLancamentosPanel from "@/components/contas/AccountLancamentosPanel";
import { contas, todosLancamentos } from "@/lib/mock";

export default function ContaDetalhePage({ params }: { params: { id: string } }) {
  const conta = contas.find((c) => c.id === params.id);
  if (!conta) notFound();

  const lancamentosConta = todosLancamentos.filter((l) => l.origem === conta.nome);
  const realizados = lancamentosConta.filter((l) => !l.previsto);
  const previstos = lancamentosConta.filter((l) => l.previsto);

  const somaPor = (lista: typeof lancamentosConta, tipo: "entrada" | "saida") =>
    lista.filter((l) => l.tipo === tipo).reduce((soma, l) => soma + l.valor, 0);

  return (
    <AppShell>
      <PageHeader
        title={`${conta.emoji} ${conta.nome}`}
        subtitle={conta.banco}
        action={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/contas/${conta.id}/ajustar-saldo`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-black/10 text-ink font-semibold text-sm px-4 py-2.5 shadow-softer hover:bg-cream-soft transition"
            >
              <SlidersHorizontal size={15} />
              Ajustar saldo
            </Link>
            <Link
              href="/lancamentos/novo"
              className="flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] transition"
            >
              <Plus size={15} strokeWidth={2.5} />
              Adicionar lançamento
            </Link>
          </div>
        }
      />

      <section
        aria-label="Resumo da conta"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5"
      >
        <SummaryCard label="Saldo atual" valor={conta.saldoAtual} featured icon={Wallet} hint={`Desde ${conta.dataSaldoInicial}`} />
        <SummaryCard label="Entradas do mês" valor={somaPor(realizados, "entrada")} tone="entrada" icon={TrendingUp} />
        <SummaryCard label="Saídas do mês" valor={somaPor(realizados, "saida")} tone="saida" icon={TrendingDown} />
        <SummaryCard label="Entradas previstas" valor={somaPor(previstos, "entrada")} tone="entrada-prevista" icon={CalendarPlus} />
        <SummaryCard label="Saídas previstas" valor={somaPor(previstos, "saida")} tone="saida-prevista" icon={CalendarMinus} />
      </section>

      <section className="mt-3 sm:mt-4 lg:mt-5">
        <AccountLancamentosPanel itens={lancamentosConta} />
      </section>

      {conta.observacao && (
        <p className="text-xs text-ink-faint mt-4 px-1">💬 {conta.observacao}</p>
      )}
    </AppShell>
  );
}
