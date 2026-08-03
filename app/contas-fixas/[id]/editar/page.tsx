import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import FixedBillForm from "@/components/forms/FixedBillForm";
import { getContaFixa } from "@/lib/data/contas-fixas";
import { getCategorias } from "@/lib/data/categorias";
import { getOrigens } from "@/lib/data/origens";

export default async function EditarContaFixaPage({ params }: { params: { id: string } }) {
  const [conta, categorias, origens] = await Promise.all([
    getContaFixa(params.id),
    getCategorias("despesa"),
    getOrigens(),
  ]);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title={`Editar ${conta.nome}`} subtitle="Atualize os dados desta conta fixa" showAddButton={false} />
      <div className="max-w-2xl">
        <FixedBillForm modo="editar" contaExistente={conta} categorias={categorias} origens={origens} />
      </div>
    </AppShell>
  );
}
