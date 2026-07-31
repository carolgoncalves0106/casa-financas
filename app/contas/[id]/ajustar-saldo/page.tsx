import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AdjustBalanceForm from "@/components/forms/AdjustBalanceForm";
import { contas } from "@/lib/mock";

export default function AjustarSaldoPage({ params }: { params: { id: string } }) {
  const conta = contas.find((c) => c.id === params.id);
  if (!conta) notFound();

  return (
    <AppShell>
      <PageHeader title="Ajustar saldo" subtitle={conta.nome} showAddButton={false} />
      <div className="max-w-xl">
        <AdjustBalanceForm conta={conta} />
      </div>
    </AppShell>
  );
}
