"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import UploadField from "@/components/ui/UploadField";
import Toggle from "@/components/ui/Toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ContaFixa } from "@/lib/types";
import { origensDisponiveis } from "@/lib/mock";
import { formatBRL } from "@/lib/utils";

export default function MarkFixedBillPaidForm({ conta }: { conta: ContaFixa }) {
  const [valorPago, setValorPago] = useState(String(conta.valorPrevisto));
  const [usarProximosMeses, setUsarProximosMeses] = useState<"nao" | "sim">("nao");
  const [salvo, setSalvo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title={`Marcar como paga — ${conta.nome}`}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Valor previsto</label>
              <div className="rounded-2xl border border-black/5 bg-cream-soft/40 px-4 py-3 text-sm text-ink-soft">
                {formatBRL(conta.valorPrevisto)}
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
            <DatePicker label="Data do pagamento" id="data-pagamento" />
            <Select
              label="Origem usada"
              id="origem-usada"
              defaultValue={conta.origem}
              options={origensDisponiveis.map((o) => ({ value: o.nome, label: `${o.emoji} ${o.nome}` }))}
            />
          </div>

          <UploadField />

          <Toggle
            label="Usar este novo valor nos próximos meses?"
            value={usarProximosMeses}
            onChange={setUsarProximosMeses}
            options={[
              { value: "nao", label: "Não" },
              { value: "sim", label: "Sim" },
            ]}
          />

          <Input label="Observação (opcional)" id="observacao" placeholder="Ex: Valor com desconto de pontualidade" />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> Pagamento registrado (modo de demonstração)
          </span>
        )}
        <SecondaryButton href="/contas-fixas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit">Confirmar pagamento</PrimaryButton>
      </div>
    </form>
  );
}
