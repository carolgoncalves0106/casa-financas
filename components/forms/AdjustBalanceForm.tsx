"use client";

import { useMemo, useState } from "react";
import { Info, Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ContaBancaria } from "@/lib/types";
import { formatBRL, cn } from "@/lib/utils";

export default function AdjustBalanceForm({ conta }: { conta: ContaBancaria }) {
  const [saldoInformado, setSaldoInformado] = useState<string>("");
  const [salvo, setSalvo] = useState(false);

  const valorInformado = parseFloat(saldoInformado.replace(",", "."));
  const diferenca = useMemo(() => {
    if (isNaN(valorInformado)) return null;
    return valorInformado - conta.saldoAtual;
  }, [valorInformado, conta.saldoAtual]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <div className="flex items-start gap-2 rounded-2xl bg-butter-soft/70 border border-butter/20 px-4 py-3">
        <Info size={16} className="text-clay shrink-0 mt-0.5" />
        <p className="text-xs text-ink-soft leading-relaxed">
          Um ajuste de saldo é uma <strong>movimentação financeira</strong>, não uma despesa —
          no futuro ele não vai entrar nos gráficos de gastos, só corrige o saldo da conta.
        </p>
      </div>

      <FormSection title={`Ajustar saldo — ${conta.nome}`}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Saldo calculado pelo sistema</label>
              <div className="rounded-2xl border border-black/5 bg-cream-soft/40 px-4 py-3 text-sm text-ink-soft">
                {formatBRL(conta.saldoAtual)}
              </div>
            </div>
            <Input
              label="Saldo informado por você"
              id="saldo-informado"
              inputMode="decimal"
              placeholder="R$ 0,00"
              value={saldoInformado}
              onChange={(e) => setSaldoInformado(e.target.value)}
            />
          </div>

          {diferenca !== null && (
            <div className="animate-field-in flex items-center justify-between rounded-2xl border border-black/5 bg-cream-soft/40 px-4 py-3">
              <span className="text-sm font-medium text-ink-soft">Diferença</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  diferenca === 0 ? "text-ink-faint" : diferenca > 0 ? "text-sage" : "text-bloom"
                )}
              >
                {diferenca > 0 ? "+ " : diferenca < 0 ? "− " : ""}
                {formatBRL(Math.abs(diferenca))}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker label="Data do ajuste" id="data-ajuste" />
            <Input label="Observação (opcional)" id="obs-ajuste" placeholder="Ex: Conferência mensal" />
          </div>
        </div>
      </FormSection>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> Ajuste registrado (modo de demonstração)
          </span>
        )}
        <SecondaryButton href={`/contas/${conta.id}`}>Cancelar</SecondaryButton>
        <PrimaryButton type="submit">Confirmar ajuste</PrimaryButton>
      </div>
    </form>
  );
}
