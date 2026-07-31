"use client";

import { useState } from "react";
import { Info, Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Toggle from "@/components/ui/Toggle";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import UploadField from "@/components/ui/UploadField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import {
  categoriasDespesas,
  categoriasEntradas,
  tiposDeMovimentacao,
  contas,
  cartoes,
  origensDisponiveis,
} from "@/lib/mock";

type Tipo = "saida" | "entrada" | "movimentacao";
type SubtipoMovimentacao = (typeof tiposDeMovimentacao)[number]["id"];
type FormaPagamento = "avista" | "parcelado";
type PrevistoRealizado = "previsto" | "realizado";
type ComoInformar = "total" | "parcela";

export default function NewTransactionForm() {
  const [tipo, setTipo] = useState<Tipo>("saida");
  const [origemId, setOrigemId] = useState<string>("nubank");
  const [subtipoMov, setSubtipoMov] = useState<SubtipoMovimentacao>("transferencia");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("avista");
  const [comoInformar, setComoInformar] = useState<ComoInformar>("total");
  const [previstoRealizado, setPrevistoRealizado] = useState<PrevistoRealizado>("realizado");
  const [salvo, setSalvo] = useState(false);

  const categorias = tipo === "entrada" ? categoriasEntradas : categoriasDespesas;
  const opcoesOrigem = tipo === "entrada" ? contas : origensDisponiveis;
  const origem = origensDisponiveis.find((c) => c.id === origemId) ?? origensDisponiveis[0];
  const origemEhCartao = tipo !== "entrada" && origem.tipo === "cartao";
  const cartaoSelecionado = origemEhCartao ? cartoes.find((c) => c.id === origemId) : undefined;
  const parcelado = formaPagamento === "parcelado";

  function handleTipoChange(novoTipo: Tipo) {
    setTipo(novoTipo);
    setFormaPagamento("avista");
    if (novoTipo === "entrada") setOrigemId("nubank");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Nesta etapa não há gravação real — apenas confirmação visual.
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
      {/* Tipo de lançamento */}
      <FormSection title="Tipo de lançamento">
        <SegmentedControl
          value={tipo}
          onChange={handleTipoChange}
          className="w-full"
          options={[
            { value: "saida", label: "Saída", emoji: "📉" },
            { value: "entrada", label: "Entrada", emoji: "📈" },
            { value: "movimentacao", label: "Movimentação", emoji: "🔁" },
          ]}
        />
      </FormSection>

      {tipo === "movimentacao" ? (
        <>
          <FormSection title="Tipo de movimentação">
            <div className="flex items-start gap-2 rounded-2xl bg-butter-soft/70 border border-butter/20 px-4 py-3 mb-4">
              <Info size={16} className="text-clay shrink-0 mt-0.5" />
              <p className="text-xs text-ink-soft leading-relaxed">
                Movimentações não entram nos gráficos de despesas — elas representam
                transferências, ajustes ou pagamentos de fatura, não gastos reais.
              </p>
            </div>
            <SegmentedControl
              value={subtipoMov}
              onChange={(v) => setSubtipoMov(v)}
              className="w-full"
              options={tiposDeMovimentacao.map((t) => ({ value: t.id, label: t.label }))}
            />
          </FormSection>

          {/* A key força a pequena animação de entrada sempre que o subtipo muda */}
          <FormSection
            key={subtipoMov}
            title={tiposDeMovimentacao.find((t) => t.id === subtipoMov)?.label ?? ""}
            animated
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Valor" id="mov-valor" inputMode="decimal" placeholder="R$ 0,00" />
                <DatePicker label="Data" id="mov-data" />
              </div>

              {subtipoMov === "transferencia" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Conta de origem"
                    id="mov-origem"
                    options={origensDisponiveis.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                  />
                  <Select
                    label="Conta de destino"
                    id="mov-destino"
                    options={origensDisponiveis.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                  />
                </div>
              )}

              {subtipoMov === "ajuste" && (
                <Select
                  label="Conta a ajustar"
                  id="mov-conta-ajuste"
                  options={contas.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                />
              )}

              {subtipoMov === "fatura" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Cartão"
                    id="mov-cartao"
                    options={cartoes.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                  />
                  <Select
                    label="Conta de pagamento"
                    id="mov-conta-pag"
                    options={contas.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                  />
                </div>
              )}

              <Input
                label="Descrição (opcional)"
                id="mov-desc"
                placeholder="Ex: Transferência para poupança"
              />
            </div>
          </FormSection>
        </>
      ) : (
        <>
          <FormSection title={tipo === "saida" ? "Dados da saída" : "Dados da entrada"}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Valor" id="valor" inputMode="decimal" placeholder="R$ 0,00" />
                <Select
                  label="Categoria"
                  id="categoria"
                  placeholder="Selecione uma categoria"
                  options={categorias.map((c) => ({ value: c.nome, label: `${c.emoji} ${c.nome}` }))}
                  defaultValue=""
                />
              </div>

              <Input
                label="Descrição"
                id="descricao"
                placeholder={tipo === "saida" ? "Ex: Mercado da semana" : "Ex: Pagamento de trabalho"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Origem"
                  id="origem"
                  value={origemId}
                  onChange={(e) => setOrigemId(e.target.value)}
                  options={opcoesOrigem.map((c) => ({ value: c.id, label: `${c.emoji} ${c.nome}` }))}
                />
                <DatePicker label="Data" id="data" />
              </div>

              <UploadField />

              {tipo === "saida" && (
                <Toggle
                  tone="strong"
                  label="Previsto ou realizado?"
                  value={previstoRealizado}
                  onChange={setPrevistoRealizado}
                  options={[
                    { value: "realizado", label: "Realizado" },
                    { value: "previsto", label: "Previsto" },
                  ]}
                />
              )}
            </div>
          </FormSection>

          {/* A origem escolhida define o que aparece aqui: conta → parcelamento livre;
              cartão → fatura + parcelamento simplificado. Anima ao trocar de origem. */}
          {tipo === "saida" && (
            <FormSection
              key={origemEhCartao ? "cartao" : "conta"}
              title={origemEhCartao ? "Cartão" : "Pagamento"}
              description={origemEhCartao ? origem.nome : undefined}
              animated
            >
              <div className="flex flex-col gap-4">
                {origemEhCartao && (
                  <Select
                    label="Fatura"
                    id="qual-fatura"
                    placeholder="Selecione a fatura"
                    defaultValue=""
                    options={(cartaoSelecionado?.faturas ?? []).map((f) => ({ value: f.id, label: f.label }))}
                  />
                )}

                <Toggle
                  label="À vista ou parcelado"
                  value={formaPagamento}
                  onChange={setFormaPagamento}
                  options={[
                    { value: "avista", label: "À vista" },
                    { value: "parcelado", label: "Parcelado" },
                  ]}
                />

                {parcelado && origemEhCartao && (
                  <div className="animate-field-in">
                    <Input label="Número de parcelas" id="qtd-parcelas-cartao" type="number" min={2} placeholder="Ex: 12" />
                  </div>
                )}

                {parcelado && !origemEhCartao && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-field-in">
                    <Input label="Quantidade de parcelas" id="qtd-parcelas" type="number" min={2} placeholder="Ex: 12" />
                    <Select
                      label="Como prefere informar?"
                      id="como-informar"
                      value={comoInformar}
                      onChange={(e) => setComoInformar(e.target.value as ComoInformar)}
                      options={[
                        { value: "total", label: "Valor total" },
                        { value: "parcela", label: "Valor da parcela" },
                      ]}
                    />
                    <Input
                      label={comoInformar === "total" ? "Valor total" : "Valor da parcela"}
                      id="valor-parcelamento"
                      inputMode="decimal"
                      placeholder="R$ 0,00"
                    />
                    <DatePicker
                      label="Primeira parcela"
                      id="primeira-parcela"
                      containerClassName="sm:col-span-3 sm:max-w-xs"
                    />
                  </div>
                )}
              </div>
            </FormSection>
          )}
        </>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
        {salvo && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-sage animate-fade-in sm:mr-auto">
            <Check size={16} /> Lançamento salvo (modo de demonstração)
          </span>
        )}
        <SecondaryButton href="/lancamentos">Cancelar</SecondaryButton>
        <PrimaryButton type="submit">Salvar lançamento</PrimaryButton>
      </div>
    </form>
  );
}
