"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  TipoContaBancaria,
  tiposContaBancaria,
  iconesContaDisponiveis,
  coresContaDisponiveis,
} from "@/lib/types";
import { createConta, updateConta } from "@/lib/data/contas-actions";

interface AccountFormProps {
  modo: "criar" | "editar";
  contaExistente?: ContaBancaria;
}

/** dataSaldoInicial vem como dd/mm/aaaa (pt-BR) — <input type="date"> precisa de aaaa-mm-dd */
function paraDataInput(valor?: string): string | undefined {
  if (!valor) return undefined;
  const [dia, mes, ano] = valor.split("/");
  if (!dia || !mes || !ano) return undefined;
  return `${ano}-${mes}-${dia}`;
}

export default function AccountForm({ modo, contaExistente }: AccountFormProps) {
  const router = useRouter();
  const [emoji, setEmoji] = useState(contaExistente?.emoji ?? iconesContaDisponiveis[0]);
  const [cor, setCor] = useState<CorConta>(contaExistente?.cor ?? coresContaDisponiveis[0].value);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const dados = new FormData(e.currentTarget);
    const valorSaldo = String(dados.get("saldoInicial") ?? "0").replace(",", ".");

    const input = {
      nome: String(dados.get("nome") ?? "").trim(),
      banco: String(dados.get("banco") ?? "").trim(),
      tipoConta: String(dados.get("tipoConta")) as TipoContaBancaria,
      saldoInicial: parseFloat(valorSaldo) || 0,
      dataSaldoInicial: String(dados.get("dataSaldoInicial") ?? ""),
      emoji: String(dados.get("emoji") ?? emoji),
      cor: String(dados.get("cor") ?? cor) as CorConta,
      observacao: String(dados.get("observacao") ?? "").trim(),
    };

    const resultado =
      modo === "criar" ? await createConta(input) : await updateConta(contaExistente!.id, input);

    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
      return;
    }

    router.push("/contas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados da conta">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome da conta"
              id="nome"
              name="nome"
              placeholder="Ex: Nubank"
              defaultValue={contaExistente?.nome}
              required
            />
            <Input
              label="Banco ou instituição"
              id="banco"
              name="banco"
              placeholder="Ex: Nu Pagamentos"
              defaultValue={contaExistente?.banco}
            />
          </div>

          <Select
            label="Tipo da conta"
            id="tipoConta"
            name="tipoConta"
            defaultValue={contaExistente?.tipoConta ?? "corrente"}
            options={tiposContaBancaria.map((t) => ({ value: t.value, label: t.label }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Saldo inicial"
              id="saldoInicial"
              name="saldoInicial"
              inputMode="decimal"
              placeholder="R$ 0,00"
              defaultValue={contaExistente ? String(contaExistente.saldoInicial) : undefined}
            />
            <DatePicker
              label="Data do saldo inicial"
              id="dataSaldoInicial"
              name="dataSaldoInicial"
              defaultValue={paraDataInput(contaExistente?.dataSaldoInicial)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Aparência" description="Só pra ajudar a identificar a conta rapidinho">
        <div className="flex flex-col gap-4">
          <IconPicker label="Ícone" options={iconesContaDisponiveis} value={emoji} onChange={setEmoji} />
          <ColorPicker label="Cor" options={coresContaDisponiveis} value={cor} onChange={setCor} />
          <input type="hidden" name="emoji" value={emoji} />
          <input type="hidden" name="cor" value={cor} />
        </div>
      </FormSection>

      <FormSection title="Observação">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="observacao" className="text-sm font-medium text-ink-soft">
            Observação (opcional)
          </label>
          <textarea
            id="observacao"
            name="observacao"
            rows={3}
            placeholder="Ex: Reserva para a viagem de fim de ano"
            defaultValue={contaExistente?.observacao}
            className={inputClass}
          />
        </div>
      </FormSection>

      {erro && (
        <p className="text-sm text-bloom bg-bloom-soft/50 rounded-2xl px-4 py-2.5 animate-fade-in">
          {erro}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        <SecondaryButton href="/contas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : modo === "criar" ? "Adicionar conta" : "Salvar alterações"}
        </PrimaryButton>
      </div>
    </form>
  );
}
