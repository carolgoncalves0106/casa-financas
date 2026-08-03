import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import LancamentosList from "@/components/dashboard/LancamentosList";
import { getLancamentos } from "@/lib/data/lancamentos";

export default async function LancamentosPage() {
  const lancamentos = await getLancamentos();

  return (
    <AppShell>
      <PageHeader
        title="Lançamentos"
        subtitle="Tudo que entra e sai da casa"
      />
      <LancamentosList itens={lancamentos} />
    </AppShell>
  );
}
