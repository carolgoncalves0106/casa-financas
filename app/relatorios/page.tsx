import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ReportsPage from "@/components/relatorios/ReportsPage";
import { getAnosDisponiveis, getEvolucaoMensal, getCategoriaAoLongoDoAno, mesesDoAno } from "@/lib/data/relatorios";
import { getGastosPorCategoriaMes } from "@/lib/data/painel";
import { getOrigens } from "@/lib/data/origens";

export default async function RelatoriosPage() {
  const anosDisponiveis = await getAnosDisponiveis();
  const anoAtual = anosDisponiveis[anosDisponiveis.length - 1];

  const [evolucaoMensal, gastosPorCategoria, categoriaAoLongoDoAno, origensList] = await Promise.all([
    getEvolucaoMensal(anoAtual),
    getGastosPorCategoriaMes(),
    getCategoriaAoLongoDoAno(anoAtual),
    getOrigens(),
  ]);

  const origens = origensList.map((o) => o.nome);

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
