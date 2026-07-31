import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import PayInvoiceForm from "@/components/forms/PayInvoiceForm";
import { cartoes } from "@/lib/mock";

export default function PagarFaturaPage({ params }: { params: { id: string } }) {
  const cartao = cartoes.find((c) => c.id === params.id);
  if (!cartao) notFound();

  return (
    <AppShell>
      <PageHeader title="Marcar fatura como paga" subtitle={cartao.nome} showAddButton={false} />
      <div className="max-w-xl">
        <PayInvoiceForm cartao={cartao} />
      </div>
    </AppShell>
  );
}
