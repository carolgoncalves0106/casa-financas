import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CategoryManager from "@/components/categorias/CategoryManager";
import { getCategorias } from "@/lib/data/categorias";

export default async function CategoriasPage() {
  const [despesas, entradas] = await Promise.all([
    getCategorias("despesa"),
    getCategorias("entrada"),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Categorias"
        subtitle="Como organizamos onde o dinheiro vai e vem"
        showAddButton={false}
      />
      <CategoryManager despesas={despesas} entradas={entradas} />
    </AppShell>
  );
}
