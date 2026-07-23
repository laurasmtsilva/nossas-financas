# 01_system_overview.md

# Visão Geral do Sistema

> Documento de visão arquitetural do estado atual do sistema.
>
> Este documento descreve como o sistema está organizado atualmente, com base exclusivamente nas análises realizadas sobre a implementação existente. Seu objetivo é fornecer uma visão consolidada da estrutura da solução, servindo como referência para documentos arquiteturais mais específicos, como o `02_legacy_assessment.md`, `architecture.md` e futuros ADRs.

---

# Objetivo

Este documento descreve a organização geral do sistema conforme observada na implementação atual.

Seu foco é registrar:

- organização da solução;
- principais componentes;
- modelo de dados;
- fluxo geral dos dados;
- responsabilidades dos módulos;
- decisões arquiteturais observadas.

Este documento não avalia a qualidade da arquitetura nem propõe melhorias.

---

# Visão Geral

O sistema **Nossas Finanças** é uma aplicação web para gestão financeira familiar.

Conforme definido no `00_context.md`, sua finalidade é apoiar a tomada de decisões financeiras por meio de uma visão consolidada da situação financeira da família.

A implementação atualmente observada utiliza:

- Next.js (App Router);
- React;
- TypeScript;
- Supabase para autenticação e persistência;
- Tailwind CSS para estilização.

A solução possui uma arquitetura centrada no frontend, utilizando o Supabase como backend para autenticação e persistência de dados.

O domínio financeiro encontra-se modelado diretamente no banco de dados por meio de entidades específicas para contas bancárias, cartões de crédito, categorias, lançamentos, transações, faturas e recorrências.

---

# Arquitetura Geral

Com base nas análises realizadas até o momento, observa-se uma arquitetura composta por três elementos principais:

- interface construída com Next.js e React;
- acesso direto ao Supabase para autenticação e persistência;
- modelo de domínio persistido no banco de dados.

As páginas da aplicação concentram:

- renderização da interface;
- gerenciamento do estado local;
- coordenação dos casos de uso;
- chamadas diretas ao Supabase.

Não foram observadas camadas intermediárias como APIs próprias, serviços de aplicação ou repositórios.

Também não foram identificadas triggers, procedures, funções SQL ou views responsáveis por regras de negócio no banco de dados.

---

# Organização do Projeto

A estrutura conhecida do projeto está organizada da seguinte forma.

## `src/app`

Contém as rotas da aplicação.

Cada funcionalidade principal possui sua própria página, organizada segundo o modelo do App Router do Next.js.

Também abriga o layout global da aplicação.

---

## `src/components`

Contém componentes reutilizados entre páginas.

Os componentes analisados possuem responsabilidades relacionadas principalmente à interface e navegação.

---

## `src/lib`

Centraliza integrações de infraestrutura.

Até o momento foi identificado o cliente responsável pelo acesso ao Supabase.

---

## `src/utils`

Contém funções auxiliares independentes da interface.

Foi identificado um módulo responsável pela transformação de texto proveniente de SMS em dados estruturados para lançamento financeiro.

---

# Componentes Principais

## Interface das funcionalidades

Responsável por:

- interação com o usuário;
- renderização das telas;
- coordenação dos casos de uso;
- comunicação com o backend.

Dependências principais:

- React;
- Supabase;
- componentes compartilhados.

---

## Componentes compartilhados

Responsáveis pela reutilização de elementos comuns da interface.

Até o momento foram identificados componentes relacionados à navegação e representação visual de categorias.

Dependências principais:

- React;
- biblioteca de ícones.

---

## Infraestrutura de persistência

Responsável por disponibilizar o cliente Supabase utilizado pela aplicação.

Dependência principal:

- Supabase.

---

## Utilitários

Responsáveis por funções auxiliares sem dependência direta da interface.

Até o momento foi observado um módulo de transformação de texto para dados estruturados.

---

## Modelo de domínio persistido

O banco de dados modela explicitamente as principais entidades do domínio financeiro.

As entidades identificadas são:

- contas bancárias;
- cartões de crédito;
- categorias;
- lançamentos;
- transações;
- faturas;
- recorrências.

Cada entidade possui responsabilidade própria e relacionamentos definidos por chaves estrangeiras e restrições de integridade.

---

# Fluxo Geral dos Dados

O fluxo observado pode ser resumido da seguinte forma:

```text
Usuário

↓

Interface

↓

Estado React

↓

Supabase

↓

Banco de Dados

↓

Retorno dos dados

↓

Atualização do estado

↓

Atualização da interface
```

Na funcionalidade de lançamentos, o fluxo observado é:

```text
Entrada do usuário

↓

Validação

↓

Processamento do caso de uso

↓

Persistência no Supabase

↓

Nova consulta aos dados

↓

Atualização da interface
```

Também foi observado um fluxo de importação de dados provenientes da área de transferência:

```text
SMS

↓

Parser

↓

Objeto estruturado

↓

Preenchimento do formulário
```

---

# Fluxo das Requisições

O comportamento observado é:

1. A página inicia o carregamento.
2. São realizadas consultas diretamente ao Supabase.
3. Os resultados alimentam o estado local.
4. A interface é renderizada.
5. As ações do usuário executam operações diretamente sobre o banco.
6. Após alterações, os dados são recarregados.

Não foram observadas camadas intermediárias entre interface e persistência.

---

# Gerenciamento de Estado

Até o momento foi observado gerenciamento de estado exclusivamente através de estado local do React (`useState`).

O estado mantém informações como:

- formulário;
- listas carregadas;
- mensagens;
- indicadores de carregamento;
- controles da interface.

Não foram identificadas bibliotecas de gerenciamento de estado global.

Ainda não é possível concluir se outros módulos utilizam mecanismos adicionais.

---

# Persistência de Dados

O sistema utiliza o Supabase como mecanismo de persistência.

As páginas analisadas realizam operações diretamente sobre o banco de dados utilizando o cliente Supabase.

O modelo de dados é composto pelas seguintes entidades principais:

- contas bancárias;
- cartões de crédito;
- categorias;
- lançamentos;
- transações;
- faturas;
- recorrências.

As responsabilidades observadas são:

| Entidade | Responsabilidade observada |
|----------|----------------------------|
| Contas bancárias | Representam contas financeiras utilizadas nas movimentações e no pagamento de faturas. |
| Cartões de crédito | Representam instrumentos de pagamento com regras de fechamento, vencimento e limite. |
| Categorias | Classificam receitas e despesas em estrutura hierárquica. |
| Lançamentos | Representam o registro realizado pelo usuário. |
| Transações | Representam as movimentações financeiras persistidas do sistema. |
| Faturas | Agrupam mensalmente as transações realizadas por cartão de crédito. |
| Recorrências | Representam modelos para geração de movimentações recorrentes. |

Não foram identificadas regras de negócio implementadas diretamente no banco de dados.

---

# Autenticação e Autorização

Foi observado uso da autenticação do Supabase.

A aplicação utiliza o cliente Supabase para recuperar o usuário autenticado e realizar logout.

As políticas RLS encontram-se habilitadas para todas as tabelas analisadas.

As políticas atualmente observadas permitem acesso irrestrito a qualquer usuário autenticado (`USING (true)` e `WITH CHECK (true)`).

Ainda não foi analisado o fluxo completo de autenticação nem o mecanismo utilizado para isolamento de dados entre usuários.

---

# Principais Dependências

As dependências com papel arquitetural identificado até o momento são:

| Dependência | Papel |
|-------------|-------|
| Next.js | Framework da aplicação |
| React | Interface e ciclo de vida dos componentes |
| TypeScript | Linguagem utilizada |
| Supabase | Persistência de dados e autenticação |
| Tailwind CSS | Estilização da interface |

---

# Convenções Arquiteturais Observadas

Foram observadas as seguintes convenções.

## Organização por funcionalidades

As páginas são organizadas conforme as funcionalidades acessíveis ao usuário.

---

## Componentes reutilizáveis

Elementos compartilhados da interface são centralizados em `components`.

---

## Infraestrutura isolada

A criação do cliente Supabase está concentrada em um módulo específico dentro de `lib`.

---

## Funções auxiliares

Lógicas independentes da interface permanecem em `utils`.

---

## Coordenação do caso de uso na página

Na funcionalidade de lançamentos, a própria página concentra:

- gerenciamento de estado;
- chamadas ao backend;
- coordenação do fluxo;
- processamento do caso de uso.

Padrão observado em múltiplos módulos analisados.

---

# Decisões Arquiteturais Identificadas

As seguintes decisões encontram-se confirmadas pela implementação analisada.

- utilização do App Router do Next.js;
- comunicação direta entre frontend e Supabase;
- centralização do acesso ao Supabase em um módulo específico;
- organização do projeto em páginas, componentes, infraestrutura e utilitários;
- utilização de componentes compartilhados para elementos comuns da interface;
- modelagem explícita do domínio financeiro por meio das entidades `contas_bancarias`, `cartoes_credito`, `categorias`, `lancamentos`, `transacoes`, `faturas` e `recorrencias`;
- separação entre o registro realizado pelo usuário (`lancamentos`) e as movimentações financeiras persistidas (`transacoes`);
- persistência das faturas como entidade própria do domínio;
- organização hierárquica das categorias;
- ausência de lógica de negócio implementada diretamente no banco de dados.

---

# Limitações do Conhecimento Atual

A análise ainda não contempla todo o sistema.

Permanecem pendentes, entre outros, os seguintes aspectos:

- organização interna das funcionalidades `contas`, `cartões`, `categorias`, `faturas` e demais módulos da aplicação;
- comportamento completo das recorrências;
- definição dos tipos customizados do banco (`tipo_transacao`, `status_transacao`, `frequencia_recorrencia` e `tipo_pessoa_enum`);
- estratégia completa de autenticação;
- proteção de rotas;
- mecanismo de isolamento de dados entre usuários e famílias;
- utilização de Server Components, Server Actions ou APIs do Next.js;
- existência de módulos adicionais de serviços, hooks ou infraestrutura ainda não analisados.

Este documento representa o entendimento consolidado da arquitetura obtido até o momento e deverá ser atualizado à medida que novas análises confirmem ou ampliem esse conhecimento.