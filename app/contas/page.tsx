import Link from "next/link";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import AccountCard from "@/components/contas/AccountCard";
import { contas } from "@/lib/mock";

export default function ContasPage() {
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

      <section
        aria-label="Contas cadastradas"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {contas.map((conta) => (
          <AccountCard key={conta.id} conta={conta} />
        ))}
      </section>
    </AppShell>
  );
}
