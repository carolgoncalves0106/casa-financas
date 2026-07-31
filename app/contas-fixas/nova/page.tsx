import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import FixedBillForm from "@/components/forms/FixedBillForm";

export default function NovaContaFixaPage() {
  return (
    <AppShell>
      <PageHeader title="Adicionar conta fixa" subtitle="Ela gera um lançamento previsto todo mês" showAddButton={false} />
      <div className="max-w-2xl">
        <FixedBillForm modo="criar" />
      </div>
    </AppShell>
  );
}
