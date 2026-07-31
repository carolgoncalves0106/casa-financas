import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import NewTransactionForm from "@/components/forms/NewTransactionForm";

export default function NovoLancamentoPage() {
  return (
    <AppShell>
      <PageHeader
        title="Adicionar lançamento"
        subtitle="Registre uma entrada, saída ou movimentação financeira"
        showAddButton={false}
      />
      <div className="max-w-2xl">
        <NewTransactionForm />
      </div>
    </AppShell>
  );
}
