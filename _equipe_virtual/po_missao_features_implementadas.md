# MISSÃO DE LEVANTAMENTO DE FEATURES IMPLEMENTADAS

## Missão de Engenharia Reversa — Catálogo de Features (Visão de Negócio)

Sua missão é realizar a engenharia reversa de **tudo que o sistema Nossas Finanças já permite ao usuário fazer hoje**, a partir do zero, e produzir um catálogo de features baseado exclusivamente em evidências observáveis no código.

Esta missão é irmã do System Overview conduzido pelo Arquiteto, mas com um olhar diferente: o Arquiteto documenta **como o sistema é construído**; você documenta **o que o sistema entrega, do ponto de vista de quem usa**.

Não avalie qualidade técnica da implementação.
Não avalie qualidade de interface.
Não proponha melhorias.
Não sugira novas funcionalidades.

O foco desta missão é identificar, nomear e descrever, em linguagem de negócio, cada capacidade que já existe de fato no sistema.

---

## Regra Fundamental: Reconstrução do Zero

Este catálogo é construído **inteiramente a partir da observação direta do código-fonte**, não a partir de documentação ou do backlog já existentes.

Portanto:

* **Leia e utilize como base** apenas `/_docs/00_context.md` — ele contém o objetivo do produto, as personas e as perguntas centrais que o sistema existe para responder. Essa leitura serve para que você use a terminologia certa e consiga avaliar, ao final de cada feature, a qual pergunta central ela se conecta — não para presumir o que foi ou não implementado.
* **Não utilize `/_docs/backlog/` como fonte durante a investigação.** O status registrado nos itens de lá (ex: "Concluída") não deve influenciar sua conclusão sobre o que existe — você precisa confirmar cada capacidade diretamente no código, de forma independente. O objetivo desta missão é justamente permitir, depois, uma comparação confiável entre o que o backlog *diz* que existe e o que *de fato* existe.
* **Ignore qualquer outro arquivo de `/_docs`** durante a investigação, incluindo documentos de arquitetura já existentes.
* Somente depois de concluída a investigação sobre cada feature, você pode opcionalmente citar, na seção "Relação com o Backlog", se encontrou um item correspondente em `/_docs/backlog/` (pendente) ou já em `/_docs/features_implementadas/` (concluído) e se o status parece coerente com o que foi observado — mas isso é uma nota de cruzamento, não uma fonte de conteúdo.

---

## Escopo

Utilize exclusivamente o código-fonte disponível no Project Knowledge deste Project (sincronizado a partir do repositório GitHub `laurasmtsilva/nossas-financas`), além de `/_docs/00_context.md` conforme definido acima.

Como o sistema inteiro já está disponível no contexto desta conversa, a investigação não precisa se limitar a um ponto de entrada único — percorra sistematicamente as frentes abaixo.

### Frentes de Investigação

Cada página principal da aplicação (`src/app/*/page.tsx`) tende a corresponder a uma ou mais features de negócio. Investigue, no mínimo:

* **Autenticação** (`src/app/login`) — o que o usuário consegue fazer em relação à própria conta.
* **Lançamentos** (`src/app/lancamentos`) — o que o usuário consegue registrar, e o que o sistema faz automaticamente a partir disso.
* **Faturas** (`src/app/faturas`) — o que o usuário consegue visualizar e controlar em relação a cartões de crédito.
* **Contas Bancárias** (`src/app/contas`) — o que o usuário consegue gerenciar.
* **Cartões de Crédito** (`src/app/cartoes`) — o que o usuário consegue gerenciar.
* **Categorias** (`src/app/categorias`) — o que o usuário consegue organizar.
* Qualquer outra página ou fluxo observável no código que represente uma capacidade entregue ao usuário, mesmo que não esteja listada acima.

Para cada uma dessas frentes, não se limite à página principal — observe também componentes, utilitários e integrações que a página utiliza, na medida em que forem necessários para entender completamente a capacidade entregue (ex: o parser de SMS usado por Lançamentos, ou o componente de ícones usado por Categorias).

Uma mesma página pode conter mais de uma feature de negócio distinta (ex: dentro de Lançamentos, "registrar uma despesa" e "colar dados de um SMS automaticamente" são capacidades diferentes, ainda que estejam na mesma tela). Separe-as sempre que isso ajudar a tornar o catálogo mais claro para decisões de produto.

### Tratamento de Limitações

A única limitação real possível neste ambiente é: um arquivo necessário para compreender completamente uma feature não está presente no Project Knowledge desta conversa.

Nesse caso, não presuma o comportamento da feature. Registre a lacuna na seção "Questões em Aberto" do documento daquela feature, informando o caminho do arquivo ausente e por que ele é necessário. Continue a missão normalmente para as demais features.

---

## Objetivos da Análise

Para cada feature identificada, o documento correspondente deverá responder, com base apenas em evidências observáveis no código atual:

* O que o usuário consegue fazer, em linguagem de negócio (não técnica)?
* Quais regras de negócio o sistema já aplica de fato (validações, restrições, cálculos automáticos)?
* O que a feature claramente ainda não cobre, com base no que se observa no código (não em suposição)?
* A qual pergunta central do produto (`00_context.md`) esta feature está mais diretamente conectada?

---

## Processo de Trabalho

### 1. Leitura de Contexto

Leia `/_docs/00_context.md` antes de qualquer outra coisa, exclusivamente para compreender a filosofia, as personas e as perguntas centrais do produto.

### 2. Levantamento por Frente

Percorra sistematicamente as frentes de investigação listadas acima, observando o código diretamente. Não consulte `03_backlog.md` nem outros documentos de `/_docs` neste momento.

Para cada frente, identifique quantas features de negócio distintas ela contém.

### 3. Verificação de Suficiência

Antes de escrever os documentos finais, avalie se há evidências suficientes para descrever cada feature identificada com confiança.

Se existir uma lacuna que impeça descrever uma feature inteira (não apenas um detalhe), registre isso na seção "Questões em Aberto" daquela feature e prossiga com as demais.

### 4. Cruzamento com o Backlog (opcional, ao final)

Somente depois de concluído o levantamento independente, você pode consultar `/_docs/backlog/` (índice e itens) para anotar, em cada documento de feature, se existe um item correspondente e se o status declarado ali parece coerente com o que foi observado no código. Registre isso apenas como uma nota factual — não como avaliação.

### 5. Construção do Catálogo

Produza um documento por feature identificada, seguindo a estrutura abaixo, e um índice consolidado listando todas as features encontradas.

---

## Estrutura de Cada Documento de Feature

### Nome da Feature
Nome curto, em linguagem de negócio (não o nome técnico do arquivo ou componente).

### O que o Usuário Consegue Fazer
Descrição em linguagem simples, pensando em como explicaria isso para o Usuário B (baixo conhecimento financeiro/técnico).

### Pontos de Entrada no Sistema
Onde essa feature vive — páginas, botões, fluxos observados no código.

### Regras de Negócio Observadas
Validações, restrições e cálculos automáticos que o código de fato aplica (ex: "o valor da parcela é calculado dividindo o valor total pelo número de parcelas, com arredondamento de duas casas").

### Limitações Observadas
O que o código evidencia que a feature **não** faz — apenas o que pode ser confirmado pela ausência de tratamento no código, não suposição sobre o que "deveria" fazer.

### Relação com Outras Features
Outras features do catálogo com as quais esta se conecta ou depende, observadas no código (ex: Lançamentos gera Faturas quando o meio de pagamento é cartão).

### Pergunta Central Relacionada
Qual pergunta de `00_context.md` esta feature ajuda a responder, se houver uma conexão clara. Se não houver, declare isso explicitamente.

### Relação com o Backlog
Preenchido apenas na etapa 4. Item correspondente em `/_docs/backlog/`, se houver, e se o status declarado parece coerente com o observado.

### Questões em Aberto
Lacunas que impediram compreender totalmente a feature, incluindo arquivos ausentes do contexto.

---

## Estrutura do Índice

Produza também um arquivo de índice (`00_indice.md`) contendo uma tabela com todas as features encontradas:

| Feature | Página(s) de Origem | Pergunta Central Relacionada | Item Correspondente no Backlog |
|---|---|---|---|

Esse índice serve como visão rápida do catálogo completo, sem repetir o conteúdo de cada documento individual.

---

## Entrega

Produza cada documento de feature como um arquivo Markdown independente, com nome de arquivo baseado no nome da feature (ex: `registro_de_lancamento.md`), além do arquivo de índice `00_indice.md`.

Todos os arquivos são destinados a compor a nova pasta `_docs/features_implementadas/` no repositório.

Ao final, lembre ao usuário que os arquivos só terão efeito real após serem adicionados ao repositório no GitHub e o Project Knowledge ser sincronizado novamente.

---

## Critérios de Qualidade

Antes de concluir a missão, confirme que:

* `/_docs/00_context.md` foi lido antes da investigação, e usado apenas como base de terminologia e critério de conexão com as perguntas centrais;
* `03_backlog.md` e outros documentos de `/_docs` não influenciaram a identificação do que existe, apenas a nota final de cruzamento;
* toda afirmação sobre o que a feature faz é baseada em evidência observável no código;
* a linguagem usada em "O que o Usuário Consegue Fazer" é acessível para a persona de baixo conhecimento técnico/financeiro;
* fatos e dúvidas estão claramente separados;
* não existem opiniões, avaliações de qualidade ou recomendações;
* o índice reflete corretamente todas as features documentadas.