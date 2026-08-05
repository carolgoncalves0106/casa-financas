import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import TransactionCard from "@/components/ui/TransactionCard";
import SubscriptionsSection from "@/components/cartoes/SubscriptionsSection";
import { getCartao } from "@/lib/data/cartoes";
import { getLancamentosPorCartao } from "@/lib/data/lancamentos";
import { getAssinaturasPorCartao } from "@/lib/data/contas-fixas";
import { getCategorias } from "@/lib/data/categorias";
import { formatBRL, cn } from "@/lib/utils";

const statusFaturaStyles = {
  aberta: { label: "Aberta", bg: "bg-status-soonSoft", text: "text-status-soon" },
  fechada: { label: "Fechada", bg: "bg-status-futureSoft", text: "text-status-future" },
  paga: { label: "Paga", bg: "bg-status-paidSoft", text: "text-status-paid" },
};

export default async function CartaoDetalhePage({ params }: { params: { id: string } }) {
  const cartao = await getCartao(params.id);
  if (!cartao) notFound();

  const lancamentosCartao = await getLancamentosPorCartao(cartao.id, cartao.nome);
  const [assinaturas, categoriasDespesas] = await Promise.all([
    getAssinaturasPorCartao(cartao.id),
    getCategorias("despesa"),
  ]);
  const comprasFatura = lancamentosCartao.filter((l) => !l.previsto);
  const parceladas = comprasFatura.filter((l) => l.parcela);
  const proximasParcelas = lancamentosCartao.filter((l) => l.parcela && l.previsto);
  const totalProximaFatura = lancamentosCartao
    .filter((l) => l.previsto)
    .reduce((soma, l) => soma + l.valor, 0);

  return (
    <AppShell>
      <PageHeader
        title={`${cartao.emoji} ${cartao.nome}`}
        subtitle={`${cartao.titular}${cartao.bandeira ? ` · ${cartao.bandeira}` : ""}`}
        action={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/lancamentos/novo?origem=${cartao.id}`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-black/10 text-ink font-semibold text-sm px-4 py-2.5 shadow-softer hover:bg-cream-soft transition"
            >
              <ShoppingBag size={15} />
              Adicionar compra
            </Link>
            <Link
              href={`/cartoes/${cartao.id}/pagar`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-4 py-2.5 shadow-soft hover:brightness-[1.03] transition"
            >
              <CheckCircle2 size={15} />
              Marcar fatura como paga
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-ink-soft font-medium">Fatura atual</p>
            <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusFaturaStyles[cartao.statusFatura].bg, statusFaturaStyles[cartao.statusFatura].text)}>
              {statusFaturaStyles[cartao.statusFatura].label}
            </span>
          </div>
          <p className="font-display font-semibold text-3xl sm:text-4xl text-ink tracking-tight">
            {formatBRL(cartao.faturaAtual)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-ink-faint">
            {cartao.vencimento && <span>Vence dia {cartao.vencimento}</span>}
            {cartao.fechamento && <span>Fecha dia {cartao.fechamento}</span>}
            {cartao.limite !== undefined && (
              <span>Limite {formatBRL(cartao.limite)} · disponível {formatBRL(cartao.limite - cartao.faturaAtual)}</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/5 shadow-soft p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <label htmlFor="fatura-select" className="text-xs font-medium text-ink-soft">Ver fatura</label>
            <select
              id="fatura-select"
              defaultValue={cartao.faturas[0]?.id}
              className="w-full mt-1.5 rounded-2xl border border-black/5 bg-cream-soft/60 px-3 py-2.5 text-sm outline-none"
            >
              {cartao.faturas.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-ink-faint mt-3">
            Próximas faturas previstas: <span className="font-semibold text-ink">{formatBRL(totalProximaFatura)}</span>
          </p>
        </div>
      </section>

      <section className="mt-3 sm:mt-4 lg:mt-5">
        <SubscriptionsSection cartaoId={cartao.id} assinaturas={assinaturas} categorias={categoriasDespesas} />
      </section>

      <section className="mt-3 sm:mt-4 lg:mt-5">
        <SectionCard title="Compras da fatura">
          {comprasFatura.length === 0 ? (
            <p className="text-sm text-ink-faint py-4">Nenhuma compra registrada nesta fatura ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {comprasFatura.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </SectionCard>
      </section>

      {parceladas.length > 0 && (
        <section className="mt-3 sm:mt-4 lg:mt-5">
          <SectionCard title="Compras parceladas" subtitle="Parcelas em aberto nesta fatura">
            <ul className="flex flex-col gap-2">
              {parceladas.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))}
            </ul>
          </SectionCard>
        </section>
      )}

      {proximasParcelas.length > 0 && (
        <section className="mt-3 sm:mt-4 lg:mt-5">
          <SectionCard title="Próximas parcelas">
            <ul className="flex flex-col gap-2">
              {proximasParcelas.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))}
            </ul>
          </SectionCard>
        </section>
      )}
    </AppShell>
  );
}
