import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import LancamentosList from "@/components/dashboard/LancamentosList";
import { todosLancamentos } from "@/lib/mock";

export default function LancamentosPage() {
  return (
    <AppShell>
      <PageHeader
        title="Lançamentos"
        subtitle="Tudo que entra e sai da casa"
      />
      <LancamentosList itens={todosLancamentos} />
    </AppShell>
  );
}
