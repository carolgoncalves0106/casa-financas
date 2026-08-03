import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import FixedBillForm from "@/components/forms/FixedBillForm";
import { getCategorias } from "@/lib/data/categorias";
import { getOrigens } from "@/lib/data/origens";

export default async function NovaContaFixaPage() {
  const [categorias, origens] = await Promise.all([getCategorias("despesa"), getOrigens()]);

  return (
    <AppShell>
      <PageHeader title="Adicionar conta fixa" subtitle="Ela gera um lançamento previsto todo mês" showAddButton={false} />
      <div className="max-w-2xl">
        <FixedBillForm modo="criar" categorias={categorias} origens={origens} />
      </div>
    </AppShell>
  );
}
