"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { CartaoCredito, CorConta, iconesContaDisponiveis, coresContaDisponiveis } from "@/lib/types";
import { createCartao, updateCartao } from "@/lib/data/cartoes-actions";

interface CardFormProps {
  modo: "criar" | "editar";
  cartaoExistente?: CartaoCredito;
}

export default function CardForm({ modo, cartaoExistente }: CardFormProps) {
  const router = useRouter();
  const [emoji, setEmoji] = useState(cartaoExistente?.emoji ?? "💳");
  const [cor, setCor] = useState<CorConta>(cartaoExistente?.cor ?? coresContaDisponiveis[0].value);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const dados = new FormData(e.currentTarget);
    const input = {
      nome: String(dados.get("nome") ?? "").trim(),
      titular: String(dados.get("titular") ?? "").trim(),
      bandeira: String(dados.get("bandeira") ?? "").trim(),
      limite: String(dados.get("limite") ?? ""),
      fechamento: String(dados.get("fechamento") ?? ""),
      vencimento: String(dados.get("vencimento") ?? ""),
      emoji,
      cor,
    };

    const resultado =
      modo === "criar" ? await createCartao(input) : await updateCartao(cartaoExistente!.id, input);

    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
      return;
    }

    router.push("/cartoes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados do cartão">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do cartão" id="nome" name="nome" placeholder="Ex: Cartão Carol" defaultValue={cartaoExistente?.nome} required />
            <Input label="Titular" id="titular" name="titular" placeholder="Ex: Carol" defaultValue={cartaoExistente?.titular} />
          </div>
          <Input
            label="Bandeira (opcional)"
            id="bandeira"
            name="bandeira"
            placeholder="Ex: Mastercard, Visa..."
            defaultValue={cartaoExistente?.bandeira}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Limite (opcional)"
              id="limite"
              name="limite"
              inputMode="decimal"
              placeholder="R$ 0,00"
              defaultValue={cartaoExistente?.limite !== undefined ? String(cartaoExistente.limite) : undefined}
            />
            <Input
              label="Dia de fechamento (opcional)"
              id="fechamento"
              name="fechamento"
              type="number"
              min={1}
              max={31}
              placeholder="Ex: 20"
              defaultValue={cartaoExistente?.fechamento !== undefined ? String(cartaoExistente.fechamento) : undefined}
            />
            <Input
              label="Dia de vencimento (opcional)"
              id="vencimento"
              name="vencimento"
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

      {erro && (
        <p className="text-sm text-bloom bg-bloom-soft/50 rounded-2xl px-4 py-2.5 animate-fade-in">
          {erro}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        <SecondaryButton href="/cartoes">Cancelar</SecondaryButton>
        <PrimaryButton type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : modo === "criar" ? "Adicionar cartão" : "Salvar alterações"}
        </PrimaryButton>
      </div>
    </form>
  );
}
