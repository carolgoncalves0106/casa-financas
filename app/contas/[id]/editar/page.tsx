import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AccountForm from "@/components/forms/AccountForm";
import { contas } from "@/lib/mock";

export default function EditarContaPage({ params }: { params: { id: string } }) {
  const conta = contas.find((c) => c.id === params.id);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader
        title={`Editar ${conta.nome}`}
        subtitle="Atualize os dados desta conta"
        showAddButton={false}
      />
      <div className="max-w-2xl">
        <AccountForm modo="editar" contaExistente={conta} />
      </div>
    </AppShell>
  );
}
