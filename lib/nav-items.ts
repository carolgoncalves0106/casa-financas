import {
  LayoutGrid,
  ListChecks,
  Landmark,
  CreditCard,
  CalendarClock,
  PieChart,
  Tags,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Painel", href: "/painel", icon: LayoutGrid },
  { label: "Lançamentos", href: "/lancamentos", icon: ListChecks },
  { label: "Contas", href: "/contas", icon: Landmark },
  { label: "Cartões", href: "/cartoes", icon: CreditCard },
  { label: "Contas fixas", href: "/contas-fixas", icon: CalendarClock },
  { label: "Relatórios", href: "/relatorios", icon: PieChart },
  { label: "Categorias", href: "/categorias", icon: Tags },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

// Itens de maior uso, exibidos na barra inferior no celular
export const mobileNavItems: NavItem[] = [
  { label: "Painel", href: "/painel", icon: LayoutGrid },
  { label: "Lançam.", href: "/lancamentos", icon: ListChecks },
  { label: "Contas", href: "/contas", icon: Landmark },
  { label: "Cartões", href: "/cartoes", icon: CreditCard },
  { label: "Mais", href: "/configuracoes", icon: Settings },
];
