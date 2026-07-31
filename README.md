# Nossa Casa — Finanças da Família 🏡

Front-end de um sistema de finanças domésticas, com identidade visual aconchegante
e dados **fictícios**. Esta é a primeira etapa do projeto: só layout e navegação,
sem Supabase, sem autenticação e sem lógica financeira real.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (gráfico de rosquinha)
- lucide-react (ícones)

## Rodando localmente

```bash
# 1. entrar na pasta do projeto
cd casa-financas

# 2. instalar as dependências
npm install

# 3. rodar em modo desenvolvimento
npm run dev
```

Depois é só abrir **http://localhost:3000** no navegador (a rota inicial
redireciona para `/painel`).

## Publicando na Vercel

1. Suba esta pasta para um repositório novo no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Mantenha as configurações padrão (Next.js é detectado automaticamente) e clique em **Deploy**.

Nenhuma variável de ambiente é necessária nesta etapa (sem Supabase ainda).

## Estrutura do projeto

```
casa-financas/
├─ app/
│  ├─ layout.tsx              → layout raiz + fontes (Quicksand + Plus Jakarta Sans)
│  ├─ globals.css             → estilos globais, cor de fundo, foco de acessibilidade
│  ├─ page.tsx                → redireciona "/" para "/painel"
│  ├─ painel/page.tsx          → tela principal (Painel) — foco desta etapa
│  ├─ lancamentos/page.tsx     → placeholder
│  ├─ lancamentos/novo/page.tsx→ placeholder do formulário de novo lançamento
│  ├─ contas/page.tsx          → placeholder
│  ├─ cartoes/page.tsx         → placeholder
│  ├─ contas-fixas/page.tsx    → placeholder
│  ├─ relatorios/page.tsx      → placeholder
│  ├─ categorias/page.tsx      → placeholder
│  └─ configuracoes/page.tsx   → placeholder
│
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx          → estrutura geral (sidebar + conteúdo + nav mobile)
│  │  ├─ Sidebar.tsx           → menu lateral (desktop)
│  │  ├─ MobileNav.tsx         → barra inferior + botão flutuante (mobile)
│  │  └─ TopBar.tsx            → título da página + seletor de mês + botão adicionar
│  │
│  ├─ dashboard/
│  │  ├─ SummaryCard.tsx           → cards de saldo/entradas/saídas
│  │  ├─ BillCard.tsx              → cards de fatura (Carol/Mitch), visual diferenciado
│  │  ├─ BillsList.tsx             → listas de contas vencidas/próximas
│  │  ├─ CategoryDonutChart.tsx    → gráfico de rosquinha (Recharts)
│  │  ├─ CategorySummaryList.tsx   → lista "Onde foi nosso dinheiro este mês?"
│  │  └─ RecentTransactions.tsx    → lista de últimos lançamentos
│  │
│  └─ ui/
│     ├─ StatusBadge.tsx        → selo colorido de status (vencida/paga/etc.)
│     ├─ SectionCard.tsx        → cartão branco genérico com título
│     └─ EmptyPlaceholder.tsx   → placeholder das páginas ainda não desenvolvidas
│
├─ lib/
│  ├─ types.ts       → tipos TypeScript (ContaItem, Lancamento, CategoriaGasto...)
│  ├─ mock-data.ts   → todos os dados fictícios usados no Painel
│  ├─ nav-items.ts   → itens do menu (desktop e mobile)
│  └─ utils.ts       → formatBRL() e helper de classes (cn)
│
├─ tailwind.config.ts → paleta de cores da identidade visual (creme, pêssego, manteiga, sálvia...)
└─ app/globals.css    → fundo, foco de acessibilidade, scrollbar
```

## O que foi feito nesta etapa

- Layout completo do **Painel**, com dados fictícios.
- Menu principal funcionando visualmente (desktop: sidebar; mobile: barra inferior + botão flutuante).
- Responsividade do Painel do celular ao desktop.
- Páginas placeholder para os demais itens do menu (Lançamentos, Contas, Cartões,
  Contas fixas, Relatórios, Categorias, Configurações).
- **Nenhuma integração externa, autenticação, banco de dados ou lógica financeira real.**

## Próximos passos (fora desta etapa)

- Desenvolver as telas internas de cada item do menu.
- Conectar Supabase (banco de dados e autenticação).
- Implementar as regras de negócio reais.
