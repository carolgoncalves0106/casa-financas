"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Toggle from "@/components/ui/Toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ContaFixa, CategoriaCompleta, frequenciasContaFixa } from "@/lib/types";
import { createContaFixa, updateContaFixa } from "@/lib/data/contas-fixas-actions";

interface OrigemOpcao {
  id: string;
  nome: string;
  emoji: string;
}

interface FixedBillFormProps {
  modo: "criar" | "editar";
  contaExistente?: ContaFixa;
  categorias: CategoriaCompleta[];
  origens: OrigemOpcao[];
}

export default function FixedBillForm({ modo, contaExistente, categorias, origens }: FixedBillFormProps) {
  const router = useRouter();
  const [valorFixo, setValorFixo] = useState<"fixo" | "estimado">(
    contaExistente ? (contaExistente.valorFixo ? "fixo" : "estimado") : "fixo"
  );
  const [lembrete, setLembrete] = useState<"sim" | "nao">(contaExistente?.lembrete ? "sim" : "nao");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const dados = new FormData(e.currentTarget);
    const input = {
      nome: String(dados.get("nome") ?? "").trim(),
      categoriaNome: String(dados.get("categoria") ?? ""),
      descricao: String(dados.get("descricao") ?? "").trim(),
      valor: String(dados.get("valor") ?? "0"),
      valorFixo: valorFixo === "fixo",
      origemNome: String(dados.get("origem") ?? ""),
      diaVencimento: String(dados.get("dia-vencimento") ?? "1"),
      frequencia: String(dados.get("frequencia") ?? "mensal") as ContaFixa["frequencia"],
      lembrete: lembrete === "sim",
      dataInicio: String(dados.get("data-inicio") ?? ""),
      dataFim: String(dados.get("data-fim") ?? ""),
      observacao: String(dados.get("observacao") ?? "").trim(),
    };

    const resultado =
      modo === "criar" ? await createContaFixa(input) : await updateContaFixa(contaExistente!.id, input);

    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
      return;
    }

    router.push("/contas-fixas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Dados da conta fixa">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome" id="nome" name="nome" placeholder="Ex: Aluguel" defaultValue={contaExistente?.nome} required />
            <Select
              label="Categoria"
              id="categoria"
              name="categoria"
              placeholder="Selecione uma categoria"
              defaultValue={contaExistente?.categoria ?? ""}
              options={categorias.map((c) => ({ value: c.nome, label: `${c.emoji} ${c.nome}` }))}
            />
          </div>

          <Input label="Descrição (opcional)" id="descricao" name="descricao" placeholder="Detalhes adicionais" defaultValue={contaExistente?.descricao} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Valor"
              id="valor"
              name="valor"
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
              name="origem"
              defaultValue={contaExistente?.origem}
              options={origens.map((o) => ({ value: o.nome, label: `${o.emoji} ${o.nome}` }))}
            />
            <Input
              label="Dia de vencimento"
              id="dia-vencimento"
              name="dia-vencimento"
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
              name="frequencia"
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
            <DatePicker label="Data de início" id="data-inicio" name="data-inicio" defaultValue={contaExistente?.dataInicio} />
            <DatePicker label="Data de encerramento (opcional)" id="data-fim" name="data-fim" defaultValue={contaExistente?.dataFim} />
          </div>

          <Input label="Observação (opcional)" id="observacao" name="observacao" placeholder="Ex: Reajusta todo mês de janeiro" defaultValue={contaExistente?.observacao} />
        </div>
      </FormSection>

      {erro && (
        <p className="text-sm text-bloom bg-bloom-soft/50 rounded-2xl px-4 py-2.5 animate-fade-in">
          {erro}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        <SecondaryButton href="/contas-fixas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : modo === "criar" ? "Adicionar conta fixa" : "Salvar alterações"}
        </PrimaryButton>
      </div>
    </form>
  );
}
