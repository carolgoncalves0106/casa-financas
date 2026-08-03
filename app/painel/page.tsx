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
import { getResumoMes, getGastosPorCategoriaMes } from "@/lib/data/painel";
import { getContasFixas } from "@/lib/data/contas-fixas";
import { getUltimosLancamentos } from "@/lib/data/lancamentos";
import { getCartoes } from "@/lib/data/cartoes";

function mesAtualLabel(): string {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const hoje = new Date();
  return `${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
}

export default async function PainelPage() {
  const [resumo, gastosPorCategoria, contasFixas, ultimosLancamentos, cartoes] = await Promise.all([
    getResumoMes(),
    getGastosPorCategoriaMes(),
    getContasFixas(),
    getUltimosLancamentos(4),
    getCartoes(),
  ]);

  const totalGastos = gastosPorCategoria.reduce((acc, c) => acc + c.valor, 0);
  const diaAtual = new Date().getDate();
  const corBillCard: ("plum" | "slate2")[] = ["plum", "slate2"];

  return (
    <AppShell>
      <PageHeader
        title="Painel"
        emoji="👋"
        subtitle="Resumo financeiro da casa"
        mes={mesAtualLabel()}
      />

      {/* Cards de resumo */}
      <section
        aria-label="Resumo financeiro do mês"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5"
      >
        <SummaryCard
          label="Saldo atual"
          valor={resumo.saldoAtual}
          featured
          icon={Wallet}
          hint="Somando todas as contas cadastradas"
        />
        <SummaryCard
          label="Entradas do mês"
          valor={resumo.entradasMes}
          tone="entrada"
          icon={TrendingUp}
          hint="Total recebido"
        />
        <SummaryCard
          label="Saídas do mês"
          valor={resumo.saidasMes}
          tone="saida"
          icon={TrendingDown}
          hint="Total gasto"
        />
        <SummaryCard
          label="Entradas previstas"
          valor={resumo.entradasPrevistas}
          tone="entrada-prevista"
          icon={CalendarPlus}
          hint="Ainda não recebidas"
        />
        <SummaryCard
          label="Saídas previstas"
          valor={resumo.saidasPrevistas}
          tone="saida-prevista"
          icon={CalendarMinus}
          hint="Ainda não pagas"
        />
        {cartoes.slice(0, 2).map((cartao, i) => (
          <BillCard key={cartao.id} titular={cartao.titular} valor={cartao.faturaAtual} corAccent={corBillCard[i]} />
        ))}
      </section>

      {/* Contas fixas — vencidas, próximas e pagas, tudo em ordem cronológica */}
      <section aria-label="Contas fixas" className="mt-3 sm:mt-4 lg:mt-5">
        <FixedBillsPanel itens={contasFixas} diaAtual={diaAtual} verTodasHref="/contas-fixas" />
      </section>

      {/* Gráfico de categorias */}
      <section
        aria-label="Gastos por categoria"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 mt-3 sm:mt-4 lg:mt-5"
      >
        <SectionCard title="Gastos por categoria" subtitle="Contas e cartões da casa">
          {gastosPorCategoria.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">Nenhum gasto registrado neste mês ainda.</p>
          ) : (
            <CategoryDonutChart dados={gastosPorCategoria} total={totalGastos} />
          )}
        </SectionCard>

        <SectionCard title="Onde foi nosso dinheiro este mês?">
          {gastosPorCategoria.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">Nenhum gasto registrado neste mês ainda.</p>
          ) : (
            <CategorySummaryList dados={gastosPorCategoria} />
          )}
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
          {ultimosLancamentos.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">Nenhum lançamento registrado ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {ultimosLancamentos.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))}
            </ul>
          )}
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
