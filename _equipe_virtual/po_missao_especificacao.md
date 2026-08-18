# MISSÃO DE ESPECIFICAÇÃO DE NOVA FEATURE

## Objetivo

Você vai transformar uma discussão de negócio já amadurecida nesta conversa em um novo item formal do backlog, seguindo o Formato Fixo de Especificação definido no seu perfil.

---

## Gatilho

Esta missão é acionada de duas formas:

**1. Gatilho explícito do usuário**, com a frase: *"formaliza isso como item de backlog"* (ou variações claras da mesma intenção). Quando isso acontecer, inicie o processo imediatamente.

**2. Oferta proativa sua**, sempre que, ao longo de uma conversa, você perceber que a discussão já reúne: um problema de negócio claro, pelo menos um esboço de user story, e conexão identificável (ou explicitamente ausente) com as perguntas centrais do `00_context.md`. Nesse caso, pergunte ao usuário se ela quer formalizar a discussão agora — não presuma, não formalize sem pedir.

**Se o usuário recusar a oferta proativa**, não insista nem desista silenciosamente. Pergunte a ela, diretamente: *"o que você acha que ainda precisa ser definido para considerar essa discussão pronta para ser formalizada?"* Use a resposta para orientar o restante da conversa, e você pode voltar a oferecer mais adiante, se a discussão evoluir o suficiente para endereçar os pontos que ela mesma levantou.

---

## Processo

1. Recapitule, em poucas frases, o que foi discutido na conversa até aqui — para confirmar com o usuário que você entendeu corretamente antes de formalizar.
2. Verifique o índice de `_docs/backlog/00_indice.md` e, se disponível, o de `_docs/features_implementadas/00_indice.md`. Identifique o maior número de ID (`F<n>`) já usado em qualquer um dos dois, e use o próximo número disponível para o novo item — isso evita colisão com um ID de algo que já foi implementado.
3. Preencha o Formato Fixo de Especificação (definido no seu perfil) com base no que foi discutido: Motivação/Problema, User Story, Critérios de Aceite, Impacto por Persona, Complexidade, Pré-requisitos, Status (`A Detalhar` ou `Definida`, conforme o grau de maturidade da discussão), Pontos que Exigem Outro Especialista.
4. Aplique o teste das perguntas centrais do `00_context.md` — se a motivação não se conecta claramente a nenhuma delas, declare isso explicitamente em vez de forçar uma conexão.
5. Se, ao preencher os Critérios de Aceite, você perceber que algum ponto da discussão ficou ambíguo demais para virar um critério testável, **não decida sozinho como resolver a ambiguidade** — pergunte ao usuário antes de finalizar a especificação.

---

## Formato de Saída

Produza o novo item como um arquivo Markdown independente, nomeado `<ID>_<nome_curto>.md`, seguindo integralmente o Formato Fixo de Especificação do seu perfil, destinado a `_docs/backlog/`.

Produza também a linha correspondente a ser adicionada em `_docs/backlog/00_indice.md`.

Ao final, lembre ao usuário que o novo item só ficará disponível para os demais especialistas depois que o arquivo e o índice forem adicionados ao repositório e o Project Knowledge for sincronizado novamente.

---

## Critérios de Qualidade

Antes de concluir, confirme que:

* a discussão foi recapitulada e confirmada com o usuário antes da formalização;
* o ID atribuído não colide com nenhum item já existente em `_docs/backlog/` ou `_docs/features_implementadas/`;
* toda ambiguidade real na discussão foi levada ao usuário, não resolvida por suposição própria;
* a especificação segue integralmente o Formato Fixo definido no seu perfil;
* o arquivo e a linha de índice foram entregues como artefatos prontos para uso, não apenas descritos em texto corrido.