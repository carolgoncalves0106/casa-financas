import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import MarkFixedBillPaidForm from "@/components/forms/MarkFixedBillPaidForm";
import { contasFixas } from "@/lib/mock";

export default function PagarContaFixaPage({ params }: { params: { id: string } }) {
  const conta = contasFixas.find((c) => c.id === params.id);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title="Marcar como paga" subtitle={conta.nome} showAddButton={false} />
      <div className="max-w-xl">
        <MarkFixedBillPaidForm conta={conta} />
      </div>
    </AppShell>
  );
}
