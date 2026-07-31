"use client";

import { useState } from "react";
import { Download, Upload, Archive, Trash2 } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { UsuarioCasa, CorConta } from "@/lib/types";

interface PerfilCasa {
  nome: string;
  subtitulo: string;
  moeda: string;
  primeiroDiaSemana: string;
  formatoData: string;
}

const corBg: Record<CorConta, string> = {
  peach: "bg-peach", sage: "bg-sage", butter: "bg-butter", plum: "bg-plum",
  slate2: "bg-slate2", bloom: "bg-bloom", clay: "bg-clay",
};

function PreferenceToggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: "sim" | "nao";
  onChange: (v: "sim" | "nao") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-faint mt-0.5">{hint}</p>}
      </div>
      <Toggle value={value} onChange={onChange} options={[{ value: "nao", label: "Não" }, { value: "sim", label: "Sim" }]} />
    </div>
  );
}

export default function SettingsPage({ perfil, usuarios }: { perfil: PerfilCasa; usuarios: UsuarioCasa[] }) {
  const [lembretes, setLembretes] = useState<"sim" | "nao">("sim");
  const [alertasVencimento, setAlertasVencimento] = useState<"sim" | "nao">("sim");
  const [contasProximas, setContasProximas] = useState<"sim" | "nao">("sim");
  const [reduzirAnimacoes, setReduzirAnimacoes] = useState<"sim" | "nao">("nao");
  const [aparencia, setAparencia] = useState<"clara" | "escura">("clara");

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <FormSection title="Perfil da casa">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome da casa" id="nome-casa" defaultValue={perfil.nome} />
            <Input label="Subtítulo" id="subtitulo-casa" defaultValue={perfil.subtitulo} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Moeda principal"
              id="moeda"
              defaultValue={perfil.moeda}
              options={[{ value: perfil.moeda, label: perfil.moeda }]}
            />
            <Select
              label="Primeiro dia da semana"
              id="primeiro-dia"
              defaultValue={perfil.primeiroDiaSemana}
              options={["Domingo", "Segunda-feira"].map((v) => ({ value: v, label: v }))}
            />
            <Select
              label="Formato de data"
              id="formato-data"
              defaultValue={perfil.formatoData}
              options={["dd/mm/aaaa", "mm/dd/aaaa"].map((v) => ({ value: v, label: v }))}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Usuários" description="Carol e Mitch podem ver e editar tudo — sem divisão de gastos entre os dois">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {usuarios.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-cream-soft/40 px-4 py-3">
              <span className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg text-white shrink-0 ${corBg[u.cor]}`}>
                {u.emoji}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{u.nome}</p>
                <p className="text-xs text-ink-faint">Acesso completo</p>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Preferências">
        <div className="flex flex-col divide-y divide-black/5">
          <PreferenceToggle label="Lembretes" hint="Avisos gerais do app" value={lembretes} onChange={setLembretes} />
          <PreferenceToggle label="Alertas de vencimento" value={alertasVencimento} onChange={setAlertasVencimento} />
          <PreferenceToggle label="Avisar sobre contas próximas do vencimento" value={contasProximas} onChange={setContasProximas} />
          <div className="flex items-center justify-between gap-3 py-2.5">
            <p className="text-sm text-ink">Aparência da interface</p>
            <Toggle
              value={aparencia}
              onChange={setAparencia}
              options={[{ value: "clara", label: "Clara" }, { value: "escura", label: "Escura" }]}
            />
          </div>
          <PreferenceToggle
            label="Reduzir animações"
            hint="Deixa as transições mais discretas"
            value={reduzirAnimacoes}
            onChange={setReduzirAnimacoes}
          />
        </div>
      </FormSection>

      <FormSection title="Dados" description="Nesta etapa, os botões abaixo são só interface — nenhuma ação é executada de verdade ainda">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SecondaryButton type="button" fullWidthOnMobile={false}>
            <Download size={15} /> Exportar dados
          </SecondaryButton>
          <SecondaryButton type="button" fullWidthOnMobile={false}>
            <Upload size={15} /> Importar dados
          </SecondaryButton>
          <SecondaryButton type="button" fullWidthOnMobile={false}>
            <Archive size={15} /> Arquivar dados antigos
          </SecondaryButton>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-bloom-soft/40 border border-bloom/20 text-bloom font-semibold text-sm px-6 py-3 shadow-softer hover:bg-bloom-soft/70 transition-all duration-200"
          >
            <Trash2 size={15} /> Apagar conta
          </button>
        </div>
      </FormSection>
    </div>
  );
}
