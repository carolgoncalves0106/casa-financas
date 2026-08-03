"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import UploadField from "@/components/ui/UploadField";
import Toggle from "@/components/ui/Toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ContaFixa } from "@/lib/types";
import { formatBRL } from "@/lib/utils";
import { marcarContaFixaPaga } from "@/lib/data/contas-fixas-actions";

interface OrigemOpcao {
  id: string;
  nome: string;
  emoji: string;
}

export default function MarkFixedBillPaidForm({ conta, origens }: { conta: ContaFixa; origens: OrigemOpcao[] }) {
  const router = useRouter();
  const [valorPago, setValorPago] = useState(String(conta.valorPrevisto));
  const [data, setData] = useState("");
  const [origemUsada, setOrigemUsada] = useState(conta.origem);
  const [observacao, setObservacao] = useState("");
  const [usarProximosMeses, setUsarProximosMeses] = useState<"nao" | "sim">("nao");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const resultado = await marcarContaFixaPaga({
      contaFixaId: conta.id,
      valorPago: parseFloat(valorPago.replace(",", ".")) || 0,
      data,
      origemNome: origemUsada,
      observacao,
      usarNovoValorNosProximosMeses: usarProximosMeses === "sim",
    });

    setSalvando(false);

    if (resultado.error) {
      setErro(resultado.error);
      return;
    }

    router.push("/contas-fixas");
    router.refresh();
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
            <DatePicker label="Data do pagamento" id="data-pagamento" value={data} onChange={(e) => setData(e.target.value)} />
            <Select
              label="Origem usada"
              id="origem-usada"
              value={origemUsada}
              onChange={(e) => setOrigemUsada(e.target.value)}
              options={origens.map((o) => ({ value: o.nome, label: `${o.emoji} ${o.nome}` }))}
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

          <Input
            label="Observação (opcional)"
            id="observacao"
            placeholder="Ex: Valor com desconto de pontualidade"
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
        <SecondaryButton href="/contas-fixas">Cancelar</SecondaryButton>
        <PrimaryButton type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Confirmar pagamento"}
        </PrimaryButton>
      </div>
    </form>
  );
}
