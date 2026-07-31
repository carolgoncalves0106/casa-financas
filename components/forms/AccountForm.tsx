"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { inputClass } from "@/components/ui/FormField";
import {
  ContaBancaria,
  CorConta,
  tiposContaBancaria,
  iconesContaDisponiveis,
  coresContaDisponiveis,
} from "@/lib/types";

interface AccountFormProps {
  modo: "criar" | "editar";
  contaExistente?: ContaBancaria;
}

export default function AccountForm({ modo, contaExistente }: AccountFormProps) {
  const [emoji, setEmoji] = useState(contaExistente?.emoji ?? iconesContaDisponiveis[0]);
  const [cor, setCor] = useState<CorConta>(contaExistente?.cor ?? coresContaDisponiveis[0].value);
  const [salvo, setSalvo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Nesta etapa não há gravação real — apenas confirmação visual.
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados da conta">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome da conta"
              id="nome"
              placeholder="Ex: Nubank"
              defaultValue={contaExistente?.nome}
            />
            <Input
              label="Banco ou instituição"
              id="banco"
              placeholder="Ex: Nu Pagamentos"
              defaultValue={contaExistente?.banco}
            />
          </div>

          <Select
            label="Tipo da conta"
            id="tipoConta"
            defaultValue={contaExistente?.tipoConta ?? "corrente"}
            options={tiposContaBancaria.map((t) => ({ value: t.value, label: t.label }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Saldo inicial"
              id="saldoInicial"
              inputMode="decimal"
              placeholder="R$ 0,00"
              defaultValue={contaExistente ? String(contaExistente.saldoInicial) : undefined}
            />
            <DatePicker label="Data do saldo inicial" id="dataSaldoInicial" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Aparência" description="Só pra ajudar a identificar a conta rapidinho">
        <div className="flex flex-col gap-4">
          <IconPicker label="Ícone" options={iconesContaDisponiveis} value={emoji} onChange={setEmoji} />
          <ColorPicker label="Cor" options={coresContaDisponiveis} value={cor} onChange={setCor} />
        </div>
      </FormSection>

      <FormSection title="Observação">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="observacao" className="text-sm font-medium text-ink-soft">
            Observação (opcional)
          </label>
          <textarea
            id="observacao"
            rows={3}
            placeholder="Ex: Reserva para a viagem de fim de ano"
            defaultValue={contaExistente?.observacao}
            className={inputClass}
          />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> {modo === "criar" ? "Conta criada" : "Alterações salvas"} (modo de demonstração)
          </span>
        )}
        <SecondaryButton href="/contas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit">
          {modo === "criar" ? "Adicionar conta" : "Salvar alterações"}
        </PrimaryButton>
      </div>
    </form>
  );
}
