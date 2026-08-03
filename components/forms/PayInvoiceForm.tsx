"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { CartaoCredito, ContaBancaria } from "@/lib/types";
import { formatBRL } from "@/lib/utils";
import { marcarFaturaPaga } from "@/lib/data/cartoes-actions";

function competenciaAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function PayInvoiceForm({ cartao, contas }: { cartao: CartaoCredito; contas: ContaBancaria[] }) {
  const router = useRouter();
  const [valorPago, setValorPago] = useState(String(cartao.faturaAtual));
  const [data, setData] = useState("");
  const [contaId, setContaId] = useState(contas[0]?.id ?? "");
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const resultado = await marcarFaturaPaga({
      cartaoId: cartao.id,
      competencia: competenciaAtual(),
      valorFatura: cartao.faturaAtual,
      valorPago: parseFloat(valorPago.replace(",", ".")) || 0,
      data,
      contaId: cartao.afetaContaAoPagar ? contaId : undefined,
      observacao,
    });

    setSalvando(false);

    if (resultado.error) {
      setErro(resultado.error);
      return;
    }

    router.push(`/cartoes/${cartao.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <div className="flex items-start gap-2 rounded-2xl bg-butter-soft/70 border border-butter/20 px-4 py-3">
        <Info size={16} className="text-clay shrink-0 mt-0.5" />
        <p className="text-xs text-ink-soft leading-relaxed">
          {cartao.afetaContaAoPagar ? (
            <>
              Marcar como paga gera uma <strong>movimentação financeira</strong> que afeta o saldo
              da conta escolhida — mas não entra nos gráficos de despesas.
            </>
          ) : (
            <>
              O <strong>{cartao.nome}</strong> é só para controle: marcar como paga aqui não escolhe
              conta nem afeta o saldo de nenhuma conta.
            </>
          )}
        </p>
      </div>

      <FormSection title={`Pagar fatura — ${cartao.nome}`}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Valor da fatura</label>
              <div className="rounded-2xl border border-black/5 bg-cream-soft/40 px-4 py-3 text-sm text-ink-soft">
                {formatBRL(cartao.faturaAtual)}
              </div>
            </div>
            <Input
              label="Valor pago"
              id="valor-pago"
              inputMode="decimal"
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker label="Data do pagamento" id="data-pagamento" value={data} onChange={(e) => setData(e.target.value)} />
            {cartao.afetaContaAoPagar ? (
              <Select
                label="Conta usada para pagamento"
                id="conta-pagamento"
                value={contaId}
                onChange={(e) => setContaId(e.target.value)}
                options={contas.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-soft">Conta usada para pagamento</label>
                <div className="rounded-2xl border border-dashed border-black/10 bg-cream-soft/30 px-4 py-3 text-sm text-ink-faint">
                  Não aplicável — só controle
                </div>
              </div>
            )}
          </div>

          <Input
            label="Observação (opcional)"
            id="obs-pagamento"
            placeholder="Ex: Pago no débito automático"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>
      </FormSection>

      {erro && (
        <p className="text-sm text-bloom bg-bloom-soft/50 rounded-2xl px-4 py-2.5 animate-fade-in">
          {erro}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        <SecondaryButton href={`/cartoes/${cartao.id}`}>Cancelar</SecondaryButton>
        <PrimaryButton type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Marcar como paga"}
        </PrimaryButton>
      </div>
    </form>
  );
}
