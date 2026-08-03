import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CardForm from "@/components/forms/CardForm";
import { getCartao } from "@/lib/data/cartoes";

export default async function EditarCartaoPage({ params }: { params: { id: string } }) {
  const cartao = await getCartao(params.id);
  if (!cartao) notFound();

  return (
    <AppShell>
      <PageHeader title={`Editar ${cartao.nome}`} subtitle="Atualize os dados deste cartão" showAddButton={false} />
      <div className="max-w-2xl">
        <CardForm modo="editar" cartaoExistente={cartao} />
      </div>
    </AppShell>
  );
}
