import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import NewTransactionForm from "@/components/forms/NewTransactionForm";
import { getContas } from "@/lib/data/contas";
import { getCartoes } from "@/lib/data/cartoes";
import { getCategorias } from "@/lib/data/categorias";

export default async function NovoLancamentoPage() {
  const [contas, cartoes, categoriasDespesas, categoriasEntradas] = await Promise.all([
    getContas(),
    getCartoes(),
    getCategorias("despesa"),
    getCategorias("entrada"),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Adicionar lançamento"
        subtitle="Registre uma entrada, saída ou movimentação financeira"
        showAddButton={false}
      />
      <div className="max-w-2xl">
        <NewTransactionForm
          contas={contas}
          cartoes={cartoes}
          categoriasDespesas={categoriasDespesas}
          categoriasEntradas={categoriasEntradas}
        />
      </div>
    </AppShell>
  );
}
