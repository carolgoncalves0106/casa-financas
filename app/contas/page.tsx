import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AccountCard from "@/components/contas/AccountCard";
import EmptyState from "@/components/ui/EmptyState";
import { getContas } from "@/lib/data/contas";

export default async function ContasPage() {
  const contas = await getContas();

  return (
    <AppShell>
      <PageHeader
        title="Contas"
        subtitle="Onde o dinheiro da casa mora"
        action={
          <Link
            href="/contas/nova"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] active:brightness-95 transition"
          >
            <Plus size={17} strokeWidth={2.5} />
            Adicionar conta
          </Link>
        }
      />

      {contas.length === 0 ? (
        <EmptyState
          icon={Wallet}
          titulo="Nenhuma conta cadastrada ainda"
          descricao='Clique em "Adicionar conta" para cadastrar a primeira conta, carteira ou reserva da casa.'
        />
      ) : (
        <section
          aria-label="Contas cadastradas"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {contas.map((conta) => (
            <AccountCard key={conta.id} conta={conta} />
          ))}
        </section>
      )}
    </AppShell>
  );
}
