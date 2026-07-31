import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import SettingsPage from "@/components/configuracoes/SettingsPage";
import { perfilCasa, usuariosCasa } from "@/lib/mock";

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <PageHeader title="Configurações" subtitle="Ajustes da casa e do app" showAddButton={false} />
      <div className="max-w-3xl">
        <SettingsPage perfil={perfilCasa} usuarios={usuariosCasa} />
      </div>
    </AppShell>
  );
}
