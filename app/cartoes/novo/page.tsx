import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CardForm from "@/components/forms/CardForm";

export default function NovoCartaoPage() {
  return (
    <AppShell>
      <PageHeader title="Adicionar cartão" subtitle="Cadastre um novo cartão de crédito" showAddButton={false} />
      <div className="max-w-2xl">
        <CardForm modo="criar" />
      </div>
    </AppShell>
  );
}
