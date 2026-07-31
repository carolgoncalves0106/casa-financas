import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import FixedBillForm from "@/components/forms/FixedBillForm";
import { contasFixas } from "@/lib/mock";

export default function EditarContaFixaPage({ params }: { params: { id: string } }) {
  const conta = contasFixas.find((c) => c.id === params.id);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title={`Editar ${conta.nome}`} subtitle="Atualize os dados desta conta fixa" showAddButton={false} />
      <div className="max-w-2xl">
        <FixedBillForm modo="editar" contaExistente={conta} />
      </div>
    </AppShell>
  );
}
