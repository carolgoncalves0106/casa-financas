import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CategoryManager from "@/components/categorias/CategoryManager";
import { categoriasDespesas, categoriasEntradas } from "@/lib/mock";

export default function CategoriasPage() {
  return (
    <AppShell>
      <PageHeader
        title="Categorias"
        subtitle="Como organizamos onde o dinheiro vai e vem"
        showAddButton={false}
      />
      <CategoryManager despesas={categoriasDespesas} entradas={categoriasEntradas} />
    </AppShell>
  );
}
