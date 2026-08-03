# Nossa Casa — Finanças da Família 🏡

Sistema de finanças domésticas, com identidade visual aconchegante. As telas
ainda usam dados fictícios (mock) — a integração com o banco (Supabase) está
sendo feita aos poucos, tela por tela. **Autenticação já está ligada:** só
quem tem login cadastrado consegue acessar o app.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- lucide-react (ícones)
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`) — autenticação ligada;
  dados ainda mockados, sendo migrados tela por tela

## Rodando localmente

```bash
# 1. entrar na pasta do projeto
cd casa-financas

# 2. instalar as dependências
npm install

# 3. configurar as variáveis de ambiente
cp .env.local.example .env.local
# edite .env.local com a URL e a anon key do projeto Supabase (Project Settings → API)

# 4. rodar em modo desenvolvimento
npm run dev
```

Depois é só abrir **http://localhost:3000**. Como a autenticação já está
ativa, a primeira tela será **/login** — use um e-mail/senha já cadastrado em
**Authentication → Users** no Supabase e vinculado em `casa_usuarios`
(ver `schema-casa-financas.sql`).

## Publicando na Vercel

1. Suba esta pasta para um repositório novo no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Clique em **Deploy**.

## Estrutura do projeto

**Novo nesta etapa (autenticação):**

```
middleware.ts                    → protege as rotas e renova a sessão a cada requisição
.env.local.example               → variáveis de ambiente necessárias
lib/supabase/client.ts           → cliente Supabase para Client Components
lib/supabase/server.ts           → cliente Supabase para Server Components
lib/supabase/actions.ts          → server action de logout (signOut)
app/login/page.tsx               → tela de login
components/auth/LoginForm.tsx    → formulário de login
components/auth/LogoutButton.tsx → botão de sair (hoje só na sidebar do desktop)
```

O restante do projeto (abaixo) continua com dados mockados — a migração tela
por tela vem nas próximas etapas.

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
