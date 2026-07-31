import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ReportsPage from "@/components/relatorios/ReportsPage";
import {
  anosDisponiveis,
  mesesDoAno,
  evolucaoMensal,
  gastosPorCategoria,
  categoriaAoLongoDoAno,
  contas,
  cartoes,
} from "@/lib/mock";

export default function RelatoriosPage() {
  const origens = [...contas.map((c) => c.nome), ...cartoes.map((c) => c.nome)];

  return (
    <AppShell>
      <PageHeader title="Relatórios" subtitle="Entenda para onde o dinheiro da casa está indo" showAddButton={false} />
      <ReportsPage
        anos={anosDisponiveis}
        meses={mesesDoAno}
        evolucao={evolucaoMensal}
        gastosPorCategoria={gastosPorCategoria}
        categoriaAoLongoDoAno={categoriaAoLongoDoAno}
        origens={origens}
      />
    </AppShell>
  );
}
