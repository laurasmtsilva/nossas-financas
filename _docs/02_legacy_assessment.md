# 02_legacy_assessment.md

# Avaliação do Sistema Legado (AS-IS)

> Este documento descreve o estado atual conhecido da arquitetura do sistema.
>
> Seu objetivo é registrar observações obtidas a partir da análise do código-fonte existente, sem assumir comportamentos não comprovados.
>
> Diferentemente do `00_context.md`, que descreve a filosofia e os objetivos do produto (TO-BE), este documento representa o estado atual da implementação (AS-IS).
>
> Este documento deve ser atualizado continuamente à medida que novas partes do sistema forem analisadas.

---

# Objetivo do Documento

Este documento tem como finalidade:

* registrar como o sistema legado está organizado atualmente;
* documentar decisões arquiteturais já existentes, mesmo que não tenham sido formalmente registradas;
* identificar pontos fortes, dívidas técnicas e riscos arquiteturais sustentados por evidências;
* registrar lacunas de conhecimento que ainda dependem de análise adicional.

Este documento não deve conter propostas de refatoração nem decisões futuras. Seu propósito é servir como referência técnica para compreender o sistema antes de sua evolução.

---

# Visão Geral da Arquitetura Atual

## Observações confirmadas

Até o momento, foi possível observar que o projeto é uma aplicação web desenvolvida utilizando:

* Next.js (App Router);
* React;
* TypeScript;
* Supabase como serviço de backend.

A organização do código indica uma separação entre:

* rotas e páginas (`app`);
* componentes reutilizáveis (`components`);
* infraestrutura (`lib`);
* funções auxiliares (`utils`).

A aplicação possui um layout global (`src/app/layout.tsx`) responsável por configurar:

* estrutura HTML;
* metadados da aplicação;
* fontes globais;
* CSS global.

A autenticação observada utiliza diretamente os serviços do Supabase.

## Hipóteses (não confirmadas)

Até o momento **não existem evidências suficientes** para afirmar que a aplicação utilize padrões arquiteturais específicos, como:

* Clean Architecture;
* MVC;
* Arquitetura Hexagonal;
* DDD.

Também não foi possível confirmar a existência de:

* camada de domínio;
* camada de serviços;
* gerenciamento global de estado;
* middleware de autenticação;
* Server Actions;
* estratégia de cache.

Esses aspectos permanecem desconhecidos até novas análises.

---

# Estrutura do Projeto

A estrutura conhecida atualmente é:

```text
src/
├── app/
│   ├── cartoes/
│   ├── categorias/
│   ├── contas/
│   ├── faturas/
│   ├── lancamentos/
│   ├── login/
│   ├── teste-parser/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Navbar.tsx
│   └── IconeCategorias.tsx
│
├── lib/
│   └── supabase.ts
│
└── utils/
    └── parser.ts
```

Até o momento, observa-se que:

* `app` concentra as funcionalidades da aplicação organizadas por área de negócio;
* `components` concentra componentes reutilizáveis;
* `lib` concentra integrações e infraestrutura;
* `utils` concentra funções auxiliares.

Não foi possível determinar se existem convenções adicionais de organização dentro dessas pastas.

---

# Decisões Arquiteturais Identificadas

## Organização por funcionalidades

**Observação**

Cada diretório em `app` representa uma funcionalidade do domínio financeiro.

Isso indica uma organização baseada no negócio, e não em tipos de arquivos.

---

## Cliente Supabase centralizado

**Observação**

O cliente Supabase é importado pela tela de login a partir de `lib/supabase`, indicando centralização da configuração da infraestrutura.

**Interpretação**

Essa decisão provavelmente busca evitar múltiplas configurações da conexão.

Essa motivação ainda não foi confirmada.

---

## Componentes compartilhados

**Observação**

Existe um componente `Navbar` reutilizado pela página principal.

Isso demonstra reutilização de interface.

---

## Uso de Tailwind CSS

Toda a interface analisada utiliza classes utilitárias do Tailwind CSS.

Até o momento não foram encontrados componentes estilizados por CSS específico além do arquivo global.

---

## Autenticação delegada ao Supabase

A lógica observada de autenticação consiste apenas na coleta das credenciais e chamada dos métodos do cliente Supabase.

Toda validação observada é delegada ao serviço externo.

---

## Página inicial provisória

A página inicial atual funciona como uma central de navegação enquanto o dashboard principal ainda não foi implementado.

---

# Pontos Fortes

Até o momento foram observados os seguintes aspectos positivos:

* organização simples e de fácil navegação;
* separação clara entre páginas, componentes, infraestrutura e utilitários;
* organização das rotas por funcionalidades do domínio;
* reutilização de componentes de interface;
* centralização da infraestrutura do Supabase;
* configuração TypeScript utilizando modo estrito;
* coerência entre a stack implementada e a stack definida no `00_context.md`.

Esses pontos representam observações do estado atual e não constituem avaliação sobre sua adequação futura.

---

# Dívidas Técnicas Identificadas

Até o momento **nenhuma dívida técnica pôde ser confirmada com evidências suficientes**.

Embora existam aspectos ainda desconhecidos da arquitetura, não há elementos que permitam classificá-los objetivamente como dívida técnica.

Este tópico deverá ser atualizado apenas quando houver comprovação de problemas que afetem manutenção, evolução, confiabilidade ou qualidade do sistema.

---

# Riscos Arquiteturais

## Conhecimento parcial da arquitetura

**Descrição**

A arquitetura ainda foi analisada apenas parcialmente.

**Evidência**

Ainda não foram examinados:

* infraestrutura completa;
* regras de negócio;
* persistência;
* fluxo dos dados;
* funcionalidades principais.

**Observação**

Este risco decorre da limitação da análise atual, não necessariamente da implementação.

---

# Informações Ainda Desconhecidas

Até o momento permanecem desconhecidos:

## Arquitetura

* existência de camada de domínio;
* existência de camada de serviços;
* estratégia geral da arquitetura.

## Persistência

* configuração do cliente Supabase;
* acesso ao banco de dados;
* organização das consultas.

## Estado da aplicação

* gerenciamento global de estado;
* Context API;
* Server Components;
* Server Actions.

## Autenticação

* controle de sessão;
* proteção de rotas;
* middleware.

## Domínio

* localização das regras de negócio;
* módulos responsáveis pelos cálculos financeiros.

## Funcionalidades

Ainda não foram analisadas as funcionalidades de:

* lançamentos;
* contas;
* cartões;
* categorias;
* faturas;
* parser de SMS.

Nenhuma conclusão deve ser inferida antes da análise desses módulos.

---

# Recomendações para Próximas Análises

Para ampliar a compreensão do sistema, recomenda-se analisar os seguintes módulos:

## 1. `src/lib/supabase.ts`

Objetivo:

Compreender a configuração da infraestrutura e a comunicação com o Supabase.

---

## 2. `src/components/Navbar.tsx`

Objetivo:

Compreender a estrutura de navegação da aplicação.

---

## 3. `src/app/lancamentos`

Objetivo:

Compreender o fluxo principal do sistema, desde a interface até a persistência.

---

## 4. `src/utils/parser.ts`

Objetivo:

Entender o funcionamento do parser utilizado na criação de lançamentos.

---

## 5. `src/components/IconeCategorias.tsx`

Objetivo:

Compreender a representação visual das categorias financeiras.

---

# Histórico de Evolução

## 2026-07-22

### Escopo analisado

* `00_context.md`
* estrutura de diretórios
* `package.json`
* `tsconfig.json`
* `next.config.ts`
* `src/app/layout.tsx`
* `src/app/page.tsx`
* `src/app/login/page.tsx`

### Principais descobertas

* identificação da stack tecnológica utilizada;
* identificação da organização geral do projeto;
* identificação da separação entre páginas, componentes, infraestrutura e utilitários;
* confirmação do uso do Supabase para autenticação;
* identificação da reutilização de componentes de interface;
* ausência de evidências suficientes para caracterizar padrões arquiteturais específicos;
* registro das principais áreas que ainda necessitam de investigação.
