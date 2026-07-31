"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Toggle from "@/components/ui/Toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ContaFixa, frequenciasContaFixa } from "@/lib/types";
import { categoriasDespesas, origensDisponiveis } from "@/lib/mock";

interface FixedBillFormProps {
  modo: "criar" | "editar";
  contaExistente?: ContaFixa;
}

export default function FixedBillForm({ modo, contaExistente }: FixedBillFormProps) {
  const [valorFixo, setValorFixo] = useState<"fixo" | "estimado">(
    contaExistente ? (contaExistente.valorFixo ? "fixo" : "estimado") : "fixo"
  );
  const [lembrete, setLembrete] = useState<"sim" | "nao">(contaExistente?.lembrete ? "sim" : "nao");
  const [salvo, setSalvo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados da conta fixa">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome" id="nome" placeholder="Ex: Aluguel" defaultValue={contaExistente?.nome} />
            <Select
              label="Categoria"
              id="categoria"
              placeholder="Selecione uma categoria"
              defaultValue={contaExistente?.categoria ?? ""}
              options={categoriasDespesas.map((c) => ({ value: c.nome, label: `${c.emoji} ${c.nome}` }))}
            />
          </div>

          <Input label="Descrição (opcional)" id="descricao" placeholder="Detalhes adicionais" defaultValue={contaExistente?.descricao} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Valor"
              id="valor"
              inputMode="decimal"
              placeholder="R$ 0,00"
              defaultValue={contaExistente ? String(contaExistente.valorPrevisto) : undefined}
            />
            <Toggle
              label="Valor fixo ou estimado?"
              value={valorFixo}
              onChange={setValorFixo}
              options={[
                { value: "fixo", label: "Fixo" },
                { value: "estimado", label: "Estimado" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Conta ou cartão"
              id="origem"
              defaultValue={contaExistente?.origem}
              options={origensDisponiveis.map((o) => ({ value: o.nome, label: `${o.emoji} ${o.nome}` }))}
            />
            <Input
              label="Dia de vencimento"
              id="dia-vencimento"
              type="number"
              min={1}
              max={31}
              placeholder="Ex: 10"
              defaultValue={contaExistente ? String(contaExistente.diaVencimento) : undefined}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Frequência"
              id="frequencia"
              defaultValue={contaExistente?.frequencia ?? "mensal"}
              options={frequenciasContaFixa.map((f) => ({ value: f.value, label: f.label }))}
            />
            <Toggle
              label="Lembrete de vencimento?"
              value={lembrete}
              onChange={setLembrete}
              options={[
                { value: "nao", label: "Não" },
                { value: "sim", label: "Sim" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker label="Data de início" id="data-inicio" />
            <DatePicker label="Data de encerramento (opcional)" id="data-fim" />
          </div>

          <Input label="Observação (opcional)" id="observacao" placeholder="Ex: Reajusta todo mês de janeiro" defaultValue={contaExistente?.observacao} />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> {modo === "criar" ? "Conta fixa criada" : "Alterações salvas"} (modo de demonstração)
          </span>
        )}
        <SecondaryButton href="/contas-fixas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit">{modo === "criar" ? "Adicionar conta fixa" : "Salvar alterações"}</PrimaryButton>
      </div>
    </form>
  );
}
