# Aplicação

## Objetivo

A responsabilidade arquitetural da aplicação é definir a estrutura raiz compartilhada pelo sistema Next.js.

Esta responsabilidade concentra a configuração do documento HTML principal, carregamento de recursos globais da aplicação e composição do conteúdo das páginas através do layout raiz.

---

## O que Existe

A aplicação possui o arquivo:

- `src/app/layout.tsx`

Este arquivo exporta o componente `RootLayout`, que recebe uma propriedade `children` contendo o conteúdo React a ser renderizado dentro da estrutura principal da aplicação. 

O layout raiz define:

- configuração do elemento HTML principal;
- configuração do elemento body;
- carregamento de fontes;
- metadados da aplicação;
- referência aos estilos globais.

### Fontes

O arquivo utiliza as fontes:

- `Geist`
- `Geist_Mono`

provenientes de `next/font/google`. 

Essas fontes são configuradas com variáveis CSS:

- `--font-geist-sans`
- `--font-geist-mono` 

### Estilos Globais

O layout importa:

- ./globals.css

O arquivo `src/app/globals.css` importa Tailwind CSS e define variáveis globais de cor e fonte. 

Também existem regras globais aplicadas ao elemento `body`, incluindo:

- cor de fundo;
- cor do texto;
- família de fontes. 

### Metadados

A aplicação define metadados com:

- título: `Nossas Finanças`;
- descrição: `Gestão financeira familiar`;
- ícone da aplicação;
- configurações relacionadas ao comportamento Apple Web App. 

---

## Como Funciona

Quando a aplicação é carregada, o componente `RootLayout` cria a estrutura HTML raiz.

O elemento <html> é configurado com:

* idioma definido como `en`;
* classes relacionadas às fontes carregadas;
* classes de altura e antialiasing.

O elemento <body> recebe `min-h-full flex flex-col` e renderiza o conteúdo recebido através de `children`.

O fluxo observado é:

1. O Next.js carrega o layout raiz.
2. O layout aplica configurações globais da aplicação.
3. O conteúdo específico das páginas é inserido através de `children`.

---

## Relação com o Restante do Sistema

A aplicação funciona como camada superior de composição do sistema.

As relações observadas são:

### Páginas da aplicação

O layout recebe o conteúdo das páginas através da propriedade `children`.

Não foram identificadas chamadas diretas para páginas específicas dentro deste arquivo.

### Estilos globais

O layout depende de `globals.css`, que concentra definições globais de estilo.

### Recursos visuais

O layout referencia o arquivo `/icon.png` como ícone da aplicação.

Não foram observadas integrações diretas com:

* banco de dados;
* autenticação;
* serviços externos;
* componentes de domínio;
* regras financeiras.

---

## Questões em Aberto

* Não foi possível determinar, apenas pelo layout raiz, quais componentes ou páginas são responsáveis pelas funcionalidades específicas do sistema.
* Não foram identificados, neste escopo, mecanismos de autenticação, providers globais ou gerenciamento de estado compartilhado.
* Não foi possível determinar se existem outros layouts aninhados dentro da aplicação.