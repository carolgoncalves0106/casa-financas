import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CardTile from "@/components/cartoes/CardTile";
import EmptyState from "@/components/ui/EmptyState";
import { getCartoes } from "@/lib/data/cartoes";

export default async function CartoesPage() {
  const cartoes = await getCartoes();

  return (
    <AppShell>
      <PageHeader
        title="Cartões"
        subtitle="Faturas e compras no crédito da casa"
        action={
          <Link
            href="/cartoes/novo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] active:brightness-95 transition"
          >
            <Plus size={17} strokeWidth={2.5} />
            Adicionar cartão
          </Link>
        }
      />

      {cartoes.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          titulo="Nenhum cartão cadastrado ainda"
          descricao='Clique em "Adicionar cartão" para cadastrar o primeiro cartão de crédito da casa.'
        />
      ) : (
        <section
          aria-label="Cartões cadastrados"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {cartoes.map((cartao) => (
            <CardTile key={cartao.id} cartao={cartao} />
          ))}
        </section>
      )}
    </AppShell>
  );
}
