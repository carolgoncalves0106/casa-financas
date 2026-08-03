import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AccountForm from "@/components/forms/AccountForm";
import { getConta } from "@/lib/data/contas";

export default async function EditarContaPage({ params }: { params: { id: string } }) {
  const conta = await getConta(params.id);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title={`Editar ${conta.nome}`} subtitle="Atualize os dados desta conta" showAddButton={false} />
      <div className="max-w-2xl">
        <AccountForm modo="editar" contaExistente={conta} />
      </div>
    </AppShell>
  );
}
