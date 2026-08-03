import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import MarkFixedBillPaidForm from "@/components/forms/MarkFixedBillPaidForm";
import { getContaFixa } from "@/lib/data/contas-fixas";
import { getOrigens } from "@/lib/data/origens";

export default async function PagarContaFixaPage({ params }: { params: { id: string } }) {
  const [conta, origens] = await Promise.all([getContaFixa(params.id), getOrigens()]);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title="Marcar como paga" subtitle={conta.nome} showAddButton={false} />
      <div className="max-w-xl">
        <MarkFixedBillPaidForm conta={conta} origens={origens} />
      </div>
    </AppShell>
  );
}
