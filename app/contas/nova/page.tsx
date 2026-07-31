import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AccountForm from "@/components/forms/AccountForm";

export default function NovaContaPage() {
  return (
    <AppShell>
      <PageHeader
        title="Adicionar conta"
        subtitle="Cadastre uma conta, carteira ou reserva da casa"
        showAddButton={false}
      />
      <div className="max-w-2xl">
        <AccountForm modo="criar" />
      </div>
    </AppShell>
  );
}
