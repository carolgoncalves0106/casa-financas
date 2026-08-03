import Link from "next/link";
import { Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import FixedBillsBoard from "@/components/contas-fixas/FixedBillsBoard";
import { getContasFixas } from "@/lib/data/contas-fixas";

export default async function ContasFixasPage() {
  const contasFixas = await getContasFixas();

  return (
    <AppShell>
      <PageHeader
        title="Contas fixas"
        subtitle="O que se repete todo mês na casa"
        action={
          <Link
            href="/contas-fixas/nova"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] active:brightness-95 transition"
          >
            <Plus size={17} strokeWidth={2.5} />
            Adicionar conta fixa
          </Link>
        }
      />

      <FixedBillsBoard itens={contasFixas} />
    </AppShell>
  );
}
