import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import PayInvoiceForm from "@/components/forms/PayInvoiceForm";
import { getCartao } from "@/lib/data/cartoes";
import { getContas } from "@/lib/data/contas";

export default async function PagarFaturaPage({ params }: { params: { id: string } }) {
  const [cartao, contas] = await Promise.all([getCartao(params.id), getContas()]);
  if (!cartao) notFound();

  return (
    <AppShell>
      <PageHeader title="Marcar fatura como paga" subtitle={cartao.nome} showAddButton={false} />
      <div className="max-w-xl">
        <PayInvoiceForm cartao={cartao} contas={contas} />
      </div>
    </AppShell>
  );
}
