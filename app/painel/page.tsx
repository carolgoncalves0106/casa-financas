import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, CalendarPlus, CalendarMinus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import SummaryCard from "@/components/ui/SummaryCard";
import TransactionCard from "@/components/ui/TransactionCard";
import BillCard from "@/components/dashboard/BillCard";
import FixedBillsPanel from "@/components/dashboard/FixedBillsPanel";
import SectionCard from "@/components/ui/SectionCard";
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart";
import CategorySummaryList from "@/components/dashboard/CategorySummaryList";
import {
  mesAtual,
  resumoMes,
  contasFixas,
  diaAtualDoMes,
  gastosPorCategoria,
  ultimosLancamentos,
} from "@/lib/mock";

export default function PainelPage() {
  const totalGastos = gastosPorCategoria.reduce((acc, c) => acc + c.valor, 0);

  return (
    <AppShell>
      <PageHeader
        title="Painel"
        emoji="👋"
        subtitle="Resumo financeiro da casa"
        mes={mesAtual}
      />

      {/* Cards de resumo */}
      <section
        aria-label="Resumo financeiro do mês"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5"
      >
        <SummaryCard
          label="Saldo atual"
          valor={resumoMes.saldoAtual}
          featured
          icon={Wallet}
          hint="Somando todas as contas cadastradas"
        />
        <SummaryCard
          label="Entradas do mês"
          valor={resumoMes.entradasMes}
          tone="entrada"
          icon={TrendingUp}
          hint="Total recebido"
        />
        <SummaryCard
          label="Saídas do mês"
          valor={resumoMes.saidasMes}
          tone="saida"
          icon={TrendingDown}
          hint="Total gasto"
        />
        <SummaryCard
          label="Entradas previstas"
          valor={resumoMes.entradasPrevistas}
          tone="entrada-prevista"
          icon={CalendarPlus}
          hint="Ainda não recebidas"
        />
        <SummaryCard
          label="Saídas previstas"
          valor={resumoMes.saidasPrevistas}
          tone="saida-prevista"
          icon={CalendarMinus}
          hint="Ainda não pagas"
        />
        <BillCard titular="Carol" valor={resumoMes.faturaCarol} corAccent="plum" />
        <BillCard titular="Mitch" valor={resumoMes.faturaMitch} corAccent="slate2" />
      </section>

      {/* Contas fixas — vencidas, próximas e pagas, tudo em ordem cronológica */}
      <section aria-label="Contas fixas" className="mt-3 sm:mt-4 lg:mt-5">
        <FixedBillsPanel itens={contasFixas} diaAtual={diaAtualDoMes} verTodasHref="/contas-fixas" />
      </section>

      {/* Gráfico de categorias */}
      <section
        aria-label="Gastos por categoria"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 mt-3 sm:mt-4 lg:mt-5"
      >
        <SectionCard title="Gastos por categoria" subtitle="Nubank, Cartão Carol e Cartão Mitch">
          <CategoryDonutChart dados={gastosPorCategoria} total={totalGastos} />
        </SectionCard>

        <SectionCard title="Onde foi nosso dinheiro este mês?">
          <CategorySummaryList dados={gastosPorCategoria} />
          <Link
            href="/categorias"
            className="mt-4 block text-center text-sm font-medium text-clay hover:brightness-90 transition"
          >
            Ver todas as categorias
          </Link>
        </SectionCard>
      </section>

      {/* Últimos lançamentos */}
      <section aria-label="Últimos lançamentos" className="mt-3 sm:mt-4 lg:mt-5">
        <SectionCard title="Últimos lançamentos">
          <ul className="flex flex-col gap-2">
            {ultimosLancamentos.map((item) => (
              <TransactionCard key={item.id} item={item} />
            ))}
          </ul>
          <Link
            href="/lancamentos"
            className="mt-4 block text-center text-sm font-medium text-clay hover:brightness-90 transition"
          >
            Ver todos os lançamentos
          </Link>
        </SectionCard>
      </section>
    </AppShell>
  );
}
