# 01_system_overview.md

# Visão Geral do Sistema

> Este documento foi reconstruído inteiramente a partir da observação direta do código-fonte, do schema do banco de dados e dos arquivos de configuração do projeto disponíveis no Project Knowledge, sincronizados a partir do repositório `laurasmtsilva/nossas-financas`.
>
> A única exceção é `_docs/00_context.md`, utilizado exclusivamente como base filosófica — para situar a terminologia de domínio (lançamentos, categorias, contas, cartões, faturas) — e não como fonte de fatos sobre a implementação.
>
> Nenhum outro arquivo de `_docs/` foi utilizado como fonte de conteúdo nesta reconstrução.

---

## Objetivo

Este documento descreve a arquitetura observável do sistema **Nossas Finanças** conforme evidenciada diretamente pelo código-fonte, pelo schema do banco de dados e pelos arquivos de configuração disponíveis no momento desta análise.

Ele não avalia a qualidade da implementação, não propõe melhorias e não emite opiniões sobre decisões técnicas. Seu propósito é apresentar, de forma consolidada, o que pôde ser observado sobre tecnologias, modelo de dados, autenticação, organização do projeto, fluxo de funcionamento e padrões arquiteturais recorrentes.

Conforme `00_context.md`, o sistema existe para permitir que os membros de uma família tomem decisões financeiras a partir de uma visão consolidada, respondendo perguntas práticas do dia a dia (ex.: quanto ainda pode ser gasto, qual cartão é mais adequado). Esse objetivo de produto é citado aqui apenas como referência de domínio, não como fonte de conclusões técnicas.

---

## Visão Geral

O sistema é uma aplicação web construída em Next.js (App Router), com React e TypeScript, que se comunica diretamente com o Supabase — tanto para autenticação quanto para persistência de dados — sem camada de API própria observável no código disponível.

O domínio financeiro (contas bancárias, cartões de crédito, categorias, lançamentos, transações, faturas e recorrências) é modelado diretamente no schema PostgreSQL gerenciado pelo Supabase (`supabase/schema.sql`), com Row Level Security habilitado em todas as tabelas.

---

## Tecnologias e Dependências

### Framework e linguagem

* **Next.js** `16.2.9`, utilizando o App Router (`src/app/`), observado em `package.json` e na estrutura de diretórios.
* **React** `19.2.4` e **react-dom** `19.2.4`.
* **TypeScript** `^5`, com `strict: true` habilitado em `tsconfig.json`.

### Configuração do TypeScript

`tsconfig.json` define: `target: ES2017`, `moduleResolution: bundler`, `jsx: react-jsx`, alias de caminho `@/*` apontando para `./src/*`, e inclusão do plugin `next`.

### Estilização

* **Tailwind CSS** `^4`, integrado via `@tailwindcss/postcss` (`postcss.config.mjs`).
* `src/app/globals.css` importa `tailwindcss`, define variáveis CSS (`--background`, `--foreground`) com suporte a `prefers-color-scheme: dark`, e mapeia `--font-sans`/`--font-mono` para variáveis de fonte Geist. O seletor `body`, entretanto, define `font-family: Arial, Helvetica, sans-serif` diretamente, sem referenciar a variável `--font-sans`.
* As fontes **Geist** e **Geist Mono** são carregadas via `next/font/google` em `src/app/layout.tsx`, aplicadas como classes CSS (`geistSans.variable`, `geistMono.variable`) ao elemento `<html>`.
* Todas as páginas observadas utilizam classes utilitárias do Tailwind diretamente no JSX; não foram observados arquivos `.css` ou `.module.css` adicionais além de `globals.css`.

### Ícones

* **lucide-react** `^1.21.0`, utilizado em `Navbar.tsx`, `IconeCategorias.tsx`, `login/page.tsx` e nas páginas de domínio (`cartoes`, `categorias`, `contas`, `faturas`, `lancamentos`).

### Integração com Supabase

* `@supabase/supabase-js` `^2.110.0`;
* `@supabase/ssr` `^0.12.0`, utilizado tanto em `src/lib/supabase.ts` (`createBrowserClient`) quanto em `middleware.ts` (`createServerClient`);
* `@supabase/auth-ui-react` `^0.4.7` e `@supabase/auth-ui-shared` `^0.1.8` estão declarados como dependências em `package.json`, mas não foi observado nenhum uso desses pacotes no código disponível — a tela de login (`src/app/login/page.tsx`) implementa um formulário próprio, chamando diretamente `supabase.auth.signInWithPassword()` e `supabase.auth.signUp()`, sem componentes de UI dessas bibliotecas.

### Outras dependências declaradas

* `clipboardy` `^5.3.1` e `inquirer` `^14.0.2` estão listadas em `package.json`, mas não foram observadas sendo importadas em nenhum arquivo de `src/`. O código de leitura da área de transferência em `src/app/lancamentos/page.tsx` utiliza a API nativa do navegador (`navigator.clipboard.readText()`), não a biblioteca `clipboardy`.

### Scripts e ferramentas de build/lint

`package.json` define os scripts:
* `dev`: `next dev`;
* `build`: `next build`;
* `start`: `next start`;
* `lint`: `eslint`;
* `ai`: `tsx tools/ai-context/index.ts`.

O projeto é declarado como módulo ES (`"type": "module"`).

`eslint.config.mjs` estende `eslint-config-next/core-web-vitals` e `eslint-config-next/typescript`, com ignore explícito para `.next/**`, `out/**`, `build/**` e `next-env.d.ts`.

O script `ai` referencia o arquivo `tools/ai-context/index.ts`, que utiliza `tsx` como executor; esse arquivo não está disponível no Project Knowledge no momento desta análise, portanto seu conteúdo e função não puderam ser observados (ver Questões em Aberto).

### Hospedagem e bootstrap do projeto

O arquivo `README.md`, na raiz do repositório, indica que o projeto foi inicializado com `create-next-app` e documenta a Vercel como plataforma de deploy sugerida ("The easiest way to deploy your Next.js app is to use the Vercel Platform"). Não foi observado, no código ou nas configurações disponíveis, nenhum arquivo de configuração específico de hospedagem (ex.: `vercel.json`) que confirme o uso efetivo da Vercel em produção — apenas a menção no README.

### Arquivos de orientação para agentes de IA

Foram observados dois arquivos na raiz do projeto relacionados a agentes de codificação assistida por IA: `AGENTS.md`, que instrui agentes a consultar `node_modules/next/dist/docs/` antes de escrever código devido a supostas mudanças de comportamento no Next.js utilizado; e `CLAUDE.md`, que apenas referencia `AGENTS.md` (`@AGENTS.md`). Esses arquivos não influenciam o funcionamento do sistema em tempo de execução; documentam apenas instruções operacionais para ferramentas de desenvolvimento assistido.

---

## Banco de Dados

O banco de dados é definido em `supabase/schema.sql`, um schema PostgreSQL gerenciado pelo Supabase.

### Extensões habilitadas

`pg_stat_statements`, `pgcrypto`, `supabase_vault`, `uuid-ossp`.

### Tipos enumerados customizados

* `frequencia_recorrencia`: `semanal`, `mensal`, `anual`;
* `status_transacao`: `pendente`, `pago`;
* `tipo_pessoa_enum`: `PF`, `PJ`;
* `tipo_transacao`: `receita`, `despesa` (minúsculo).

### Entidades

O schema define sete tabelas: `cartoes_credito`, `categorias`, `contas_bancarias`, `faturas`, `lancamentos`, `recorrencias`, `transacoes`.

* **`cartoes_credito`**: `id`, `nome`, `dia_fechamento` (1–31), `dia_vencimento` (1–31), `conta_pagamento_padrao_id`, `limite`.
* **`categorias`**: `id`, `nome`, `tipo` (`RECEITA`/`DESPESA` via `CHECK`, texto em maiúsculo), `parent_id`, `icone` (default `'Folder'`), `criado_em`. Possui restrições de unicidade sobre (`id`, `tipo`) e sobre (`nome`, `parent_id`).
* **`contas_bancarias`**: `id`, `banco`, `tipo_pessoa` (`tipo_pessoa_enum`), `titularidade` (`I`/`C` via `CHECK`), `apelido`, `saldo_inicial`, `criado_em`.
* **`faturas`**: `id`, `cartao_credito_id`, `ano`, `mes`, `status` (texto, default `'ABERTA'`, sem `CHECK` no schema), `data_pagamento`, `conta_pagamento_id`, `created_at`. Possui restrição de unicidade sobre (`cartao_credito_id`, `ano`, `mes`).
* **`lancamentos`**: `id`, `descricao`, `valor`, `data` (default `CURRENT_DATE`), `tipo_pessoa` (`PF`/`PJ` via `CHECK`), `conta_id`, `categoria_id`, `criado_em`, `tipo` (`RECEITA`/`DESPESA` via `CHECK`, texto em maiúsculo), `meio_pagamento` (`CONTA`/`CARTAO` via `CHECK`), `parcelas` (default 1), `criado_por_nome`.
* **`recorrencias`**: `id`, `descricao`, `valor`, `categoria_id`, `frequencia` (`frequencia_recorrencia`, default `'mensal'`), `dia_vencimento` (1–31), `ativa` (boolean, default `true`), `criado_por`, `criado_em`.
* **`transacoes`**: `id`, `descricao`, `valor`, `tipo` (`tipo_transacao`), `status` (`status_transacao`, default `'pago'`), `data_competencia`, `data_pagamento`, `categoria_id`, `conta_bancaria_id`, `cartao_credito_id`, `recorrencia_origem_id`, `numero_parcela` (default 1), `total_parcelas` (default 1), `criado_por`, `criado_em`, `atualizado_em`, `lancamento_id`, `fatura_id`, `criado_por_nome`.

### Relacionamentos (chaves estrangeiras) observados

* `cartoes_credito.conta_pagamento_padrao_id` → `contas_bancarias.id` (`ON DELETE SET NULL`);
* `faturas.cartao_credito_id` → `cartoes_credito.id` (`ON DELETE CASCADE`);
* `faturas.conta_pagamento_id` → `contas_bancarias.id` (`ON DELETE SET NULL`);
* `categorias.parent_id` (combinado com `tipo`) → `categorias.(id, tipo)` (`ON DELETE CASCADE`);
* `lancamentos.categoria_id` → `categorias.id` (`ON DELETE CASCADE`);
* `transacoes.cartao_credito_id` → `cartoes_credito.id` (`ON DELETE SET NULL`);
* `transacoes.categoria_id` → `categorias.id` (`ON DELETE SET NULL`);
* `transacoes.conta_bancaria_id` → `contas_bancarias.id` (`ON DELETE SET NULL`);
* `transacoes.fatura_id` → `faturas.id` (`ON DELETE SET NULL`);
* `transacoes.lancamento_id` → `lancamentos.id` (`ON DELETE CASCADE`);
* `transacoes.recorrencia_origem_id` → `recorrencias.id` (`ON DELETE SET NULL`).

Não há, no schema, chave estrangeira para `lancamentos.conta_id` nem para `recorrencias.categoria_id`.

### Row Level Security (RLS)

RLS está habilitado (`ENABLE ROW LEVEL SECURITY`) nas sete tabelas. Para cada tabela, o schema define duas políticas com nomes diferentes (`"Acesso total autenticado"` e `"Acesso total para usuários autenticados"`), ambas para o papel `authenticated`, com `USING (true)` e `WITH CHECK (true)` — ou seja, qualquer usuário autenticado tem acesso irrestrito de leitura e escrita a todas as linhas de todas as tabelas. Não foi observada nenhuma política que restrinja acesso por usuário, família ou qualquer outro critério de propriedade dos dados.

### Grants de tabela

Os `GRANT` não são uniformes: `categorias`, `lancamentos` e `recorrencias` recebem `GRANT ALL` para os papéis `anon`, `authenticated` e `service_role`; já `cartoes_credito`, `contas_bancarias`, `faturas` e `transacoes` recebem `GRANT ALL` apenas para `authenticated` e `service_role` (sem grant para `anon`).

---

## Autenticação e Autorização

### Mecanismo de sessão

A autenticação é fornecida pelo serviço de auth do Supabase, acessado de duas formas distintas no código:

* No servidor, `middleware.ts` cria um cliente Supabase com `createServerClient` (`@supabase/ssr`), configurado para ler e escrever cookies da requisição/resposta usando as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
* No navegador, `src/lib/supabase.ts` exporta uma instância única criada com `createBrowserClient` (`@supabase/ssr`), usando as mesmas variáveis de ambiente. Essa instância é importada por todas as páginas que acessam dados (`login`, `lancamentos`, `contas`, `cartoes`, `faturas`, `categorias`) e pelo `Navbar.tsx`.

### Controle de acesso a rotas

`middleware.ts` executa `supabase.auth.getUser()` a cada requisição correspondente ao `matcher` configurado (todas as rotas, exceto arquivos estáticos internos do Next.js, favicon e imagens). O comportamento observado:

* se não há usuário autenticado e a rota não é `/login`, a requisição é redirecionada para `/login`;
* se há usuário autenticado e a rota é `/login`, a requisição é redirecionada para `/`;
* em qualquer outro caso, a resposta padrão (`NextResponse.next()`) é retornada sem alteração.

### Fluxo de login e registro

`src/app/login/page.tsx` mantém estados locais para e-mail, senha e modo (login/registro). No modo login, chama `supabase.auth.signInWithPassword({ email, password })` e, em caso de sucesso, redireciona via `window.location.href = '/'`. No modo registro, chama `supabase.auth.signUp({ email, password })` e, em caso de sucesso, exibe um alerta e retorna ao modo login.

### Logout

`src/components/Navbar.tsx` implementa `handleLogout`, que chama `supabase.auth.signOut()` e, em seguida, `router.push('/login')`.

### Uso da identidade do usuário autenticado

Em `src/app/lancamentos/page.tsx`, ao salvar um lançamento, o código chama `supabase.auth.getUser()` e deriva um nome de exibição a partir da parte local do e-mail (`userData?.user?.email?.split('@')[0]`), armazenado no campo `criado_por_nome` de `lancamentos` e `transacoes`. Não foi observado, nesse fluxo, uso do `id` do usuário autenticado para vincular os registros a um usuário específico de forma que restrinja a visibilidade dos dados a ele.

### O que as políticas de RLS revelam sobre isolamento de dados

Conforme descrito na seção de Banco de Dados, todas as políticas RLS observadas concedem acesso irrestrito (`USING (true)`, `WITH CHECK (true)`) a qualquer usuário autenticado, sem distinção entre usuários. Isso significa que, com base apenas no schema e no código disponíveis, não há evidência de mecanismo de isolamento de dados entre diferentes usuários ou núcleos familiares autenticados — qualquer usuário autenticado no projeto Supabase tem acesso de leitura e escrita a todos os registros de todas as tabelas.

---

## Organização do Projeto

A estrutura de diretórios e arquivos observada diretamente no conteúdo disponível é:

```text
/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── middleware.ts
├── .gitignore
├── supabase/
│   ├── schema.sql
│   ├── config.toml
│   └── .gitignore
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── login/page.tsx
│   │   ├── lancamentos/page.tsx
│   │   ├── contas/page.tsx
│   │   ├── cartoes/page.tsx
│   │   ├── categorias/page.tsx
│   │   ├── faturas/page.tsx
│   │   └── teste-parser/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── IconeCategorias.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── utils/
│       └── parser.ts
```

Responsabilidades observadas diretamente no código, por diretório:

* **`src/app`**: cada subdiretório representa uma rota do App Router e corresponde a uma área funcional do domínio financeiro (lançamentos, contas, cartões, categorias, faturas), além da rota raiz (`page.tsx`, um placeholder de dashboard com links de navegação) e do layout raiz (`layout.tsx`, responsável por fontes, metadados e estrutura HTML). `teste-parser/page.tsx` é uma página que exibe, em uma tabela, o resultado da função `parseClipboard` aplicada a exemplos fixos de texto.
* **`src/components`**: contém dois componentes reutilizados entre páginas — `Navbar.tsx` (navegação e logout, importado por todas as páginas de domínio observadas) e `IconeCategorias.tsx` (resolve dinamicamente um ícone da biblioteca `lucide-react` a partir de um nome em string, com fallback para o ícone `Folder`; também exporta a constante `ICONES_DISPONIVEIS`).
* **`src/lib`**: contém `supabase.ts`, único ponto de criação do cliente Supabase do navegador.
* **`src/utils`**: contém `parser.ts`, com a função `parseClipboard`, que extrai data, descrição e valor de um texto (formato de SMS de notificação de compra) usando expressões regulares.
* **Raiz do projeto**: arquivos de configuração de build/lint/TypeScript, o middleware de autenticação (`middleware.ts`, na raiz, fora de `src/`, conforme convenção do Next.js), e o schema do banco de dados em `supabase/`.

Não foram observados, no conteúdo disponível, diretórios `src/hooks`, `src/services`, `src/types`, nem qualquer diretório `src/app/api`.

---

## Como o Sistema Funciona

### Padrão geral de acesso a dados

Em todas as páginas observadas (`lancamentos`, `contas`, `cartoes`, `categorias`, `faturas`, `login`), a diretiva `'use client'` está presente no topo do arquivo, e o componente da página importa diretamente `supabase` de `@/lib/supabase`, chamando métodos como `.from(...).select(...)`, `.insert(...)`, `.update(...)`, `.delete(...)` dentro de funções assíncronas definidas na própria página. Não foi observada nenhuma camada intermediária (API route, serviço, repositório) entre a interface e o Supabase.

### Fluxo: criação de um lançamento e seu desdobramento

Observado em `src/app/lancamentos/page.tsx`, função `handleSalvar`:

1. É inserido um registro em `lancamentos` com os dados do formulário.
2. O nome do usuário autenticado é obtido via `supabase.auth.getUser()` e usado como `criado_por_nome`.
3. Se `meio_pagamento === 'CONTA'`, é inserido um único registro em `transacoes`, com `status: 'pago'`, vinculado à conta bancária escolhida e ao `lancamento_id` recém-criado.
4. Se `meio_pagamento === 'CARTAO'`, o valor é dividido pelo número de parcelas (`numeroParcelas`). Para cada parcela, a função `calcularMesAnoFatura` determina o mês/ano de competência com base no `dia_fechamento` do cartão selecionado; em seguida, o código verifica se já existe uma fatura para aquele cartão/ano/mês (`faturas`) e, caso não exista, cria uma nova com `status: 'ABERTA'`; por fim, insere um registro em `transacoes` com `status: 'pendente'`, vinculado ao `cartao_credito_id`, ao `fatura_id` e ao `lancamento_id`.
5. Após a operação, `carregarDados()` é chamado novamente para recarregar categorias, contas, cartões e lançamentos a partir do Supabase.

### Fluxo: importação via área de transferência

Observado em `src/app/lancamentos/page.tsx` (`handleColarSMS`) e `src/utils/parser.ts`: o texto da área de transferência é obtido via `navigator.clipboard.readText()`, passado para `parseClipboard`, que usa expressões regulares para extrair data (padrão `DD/MM`), descrição (texto entre `"em "` e `,` ou `" R$"`) e valor (`R$` seguido de dígitos, com conversão de formato brasileiro para número). Os campos do formulário são preenchidos com o resultado.

### Fluxo: visualização e pagamento de faturas

Observado em `src/app/faturas/page.tsx`: ao selecionar um cartão, suas faturas são carregadas e ordenadas por ano/mês decrescente; ao selecionar uma fatura, suas transações associadas são carregadas com `select` aninhado, unindo `categoria:categoria_id(nome)` e `lancamento:lancamento_id(data)`. O botão de alternância de status atualiza `faturas.status` e, em seguida, atualiza em lote o campo `status` de todas as `transacoes` vinculadas àquela fatura (`pago` ou `pendente`, conforme o novo status da fatura).

### Fluxo: categorias hierárquicas

Observado em `src/app/categorias/page.tsx` e `src/components/IconeCategorias.tsx`: categorias são carregadas e filtradas por `tipo` (`RECEITA`/`DESPESA`) e por `parent_id` (categorias-pai têm `parent_id` nulo). Cada categoria-pai pode ser expandida/recolhida no estado local (`expandedParents`) para exibir suas categorias-filhas. O ícone de cada categoria é resolvido dinamicamente pelo nome armazenado no campo `icone`, via `IconeCategorias`, com fallback para o ícone `Folder`.

### Fluxo: bloqueio de edição de conta com movimentações

Observado em `src/app/contas/page.tsx`: antes de permitir a edição de uma conta bancária, o código consulta a contagem (`count: 'exact', head: true`) de registros em `transacoes` com aquele `conta_bancaria_id`; se maior que zero, a edição é bloqueada e uma mensagem de status é exibida.

### Gerenciamento de estado

Em todas as páginas observadas, o estado é gerenciado exclusivamente com `useState` e `useEffect` do React, local a cada componente de página. Não foi observada nenhuma biblioteca de gerenciamento de estado global, Context API customizado, nem uso de Server Components ou Server Actions do Next.js nos arquivos disponíveis — todas as páginas de domínio são Client Components (`'use client'`).

---

## Decisões Arquiteturais Observadas

As seguintes decisões são inferidas a partir de padrões que se repetem de forma consistente entre múltiplos módulos do código disponível, não de ocorrências isoladas:

* **Acesso direto ao Supabase a partir dos componentes de página**: em todas as seis páginas que manipulam dados (`lancamentos`, `contas`, `cartoes`, `categorias`, `faturas`, `login`), as chamadas `.from(...)` do Supabase ocorrem diretamente dentro do componente da página, sem abstração de serviço ou repositório.
* **Recarregamento de dados após mutação**: em todas as páginas de CRUD observadas, após uma operação de `insert`, `update` ou `delete`, a função de carregamento de dados (`carregarDados`, `carregarContas`, `carregarCategorias` etc.) é chamada novamente para atualizar o estado local, em vez de atualizar o estado diretamente a partir da resposta da mutação.
* **Organização por funcionalidade de domínio em `src/app`**: cada subdiretório de `src/app` corresponde a uma área do domínio financeiro, não a um tipo técnico de arquivo.
* **Componentização mínima e centralizada**: apenas dois componentes são compartilhados entre páginas (`Navbar`, `IconeCategorias`); a maior parte da interface é construída diretamente dentro de cada `page.tsx`.
* **Uso consistente de asserção de tipo (`as unknown as Tipo` / `as Tipo`) para resultados de consultas Supabase com `select` aninhado**: observado em `src/app/lancamentos/page.tsx` e `src/app/faturas/page.tsx`, onde os resultados de `select` com relacionamentos (`categoria:categoria_id(nome)`, `lancamento:lancamento_id(data)`) são convertidos via `as unknown as Tipo[]` antes de serem atribuídos ao estado.
* **Ausência de camada de API própria**: em nenhum dos arquivos disponíveis foi observada uma rota de API do Next.js (`src/app/api/**/route.ts`); toda comunicação com o backend ocorre via chamadas diretas ao cliente Supabase no navegador.
* **Client Components em todas as páginas de domínio**: todas as páginas que acessam dados declaram `'use client'` no topo do arquivo; não foi observado uso de Server Components para busca de dados nessas páginas.
* **Centralização da criação do cliente Supabase do navegador**: um único módulo (`src/lib/supabase.ts`) exporta a instância utilizada por todas as páginas e pelo `Navbar`.

---

## Questões em Aberto

* O arquivo `tools/ai-context/index.ts`, referenciado pelo script `"ai": "tsx tools/ai-context/index.ts"` em `package.json`, não está disponível no Project Knowledge no momento desta análise. Não foi possível observar sua função, e portanto não é possível descrever o que o comando `npm run ai` efetivamente faz.
* Não foi observado, no conteúdo disponível, nenhum diretório `src/app/api`. Não é possível confirmar com certeza a partir do contexto atual se rotas de API existem no repositório real e simplesmente não foram sincronizadas para este Project Knowledge, ou se de fato não existem.
* As bibliotecas `@supabase/auth-ui-react`, `@supabase/auth-ui-shared`, `clipboardy` e `inquirer` estão declaradas em `package.json`, mas não foi observado nenhum uso delas nos arquivos de `src/` disponíveis. Não é possível determinar, a partir do código disponível, se são utilizadas em algum arquivo fora do escopo sincronizado (por exemplo, dentro de `tools/ai-context/`) ou se são dependências não utilizadas pelo código atualmente visível.
* Não foi possível confirmar, a partir do código disponível, se o deploy em produção do sistema efetivamente ocorre na Vercel — essa informação está presente apenas como texto padrão do template `create-next-app` em `README.md`, sem arquivo de configuração específico de hospedagem observado.
* Não foi possível determinar, a partir do schema ou do código disponíveis, se existe algum mecanismo de isolamento de dados entre usuários ou núcleos familiares diferentes de RLS — e, conforme descrito na seção de Autenticação e Autorização, as políticas de RLS observadas não implementam esse isolamento.
* Não foi possível determinar a função exata dos arquivos `AGENTS.md` e `CLAUDE.md` além do texto neles contido (instruções para agentes de codificação); não há evidência de que influenciem o comportamento do sistema em tempo de execução.