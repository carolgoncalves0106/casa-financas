"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { CartaoCredito, CorConta, iconesContaDisponiveis, coresContaDisponiveis } from "@/lib/types";

interface CardFormProps {
  modo: "criar" | "editar";
  cartaoExistente?: CartaoCredito;
}

export default function CardForm({ modo, cartaoExistente }: CardFormProps) {
  const [emoji, setEmoji] = useState(cartaoExistente?.emoji ?? "💳");
  const [cor, setCor] = useState<CorConta>(cartaoExistente?.cor ?? coresContaDisponiveis[0].value);
  const [salvo, setSalvo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados do cartão">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do cartão" id="nome" placeholder="Ex: Cartão Carol" defaultValue={cartaoExistente?.nome} />
            <Input label="Titular" id="titular" placeholder="Ex: Carol" defaultValue={cartaoExistente?.titular} />
          </div>
          <Input
            label="Bandeira (opcional)"
            id="bandeira"
            placeholder="Ex: Mastercard, Visa..."
            defaultValue={cartaoExistente?.bandeira}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Limite (opcional)"
              id="limite"
              inputMode="decimal"
              placeholder="R$ 0,00"
              defaultValue={cartaoExistente?.limite !== undefined ? String(cartaoExistente.limite) : undefined}
            />
            <Input
              label="Dia de fechamento (opcional)"
              id="fechamento"
              type="number"
              min={1}
              max={31}
              placeholder="Ex: 20"
              defaultValue={cartaoExistente?.fechamento !== undefined ? String(cartaoExistente.fechamento) : undefined}
            />
            <Input
              label="Dia de vencimento (opcional)"
              id="vencimento"
              type="number"
              min={1}
              max={31}
              placeholder="Ex: 27"
              defaultValue={cartaoExistente?.vencimento !== undefined ? String(cartaoExistente.vencimento) : undefined}
            />
          </div>
          <p className="text-xs text-ink-faint -mt-1">
            Limite, fechamento e vencimento são opcionais — deixe em branco se preferir não informar.
          </p>
        </div>
      </FormSection>

      <FormSection title="Aparência">
        <div className="flex flex-col gap-4">
          <IconPicker label="Ícone" options={["💳", ...iconesContaDisponiveis]} value={emoji} onChange={setEmoji} />
          <ColorPicker label="Cor" options={coresContaDisponiveis} value={cor} onChange={setCor} />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> {modo === "criar" ? "Cartão criado" : "Alterações salvas"} (modo de demonstração)
          </span>
        )}
        <SecondaryButton href="/cartoes">Cancelar</SecondaryButton>
        <PrimaryButton type="submit">{modo === "criar" ? "Adicionar cartão" : "Salvar alterações"}</PrimaryButton>
      </div>
    </form>
  );
}
