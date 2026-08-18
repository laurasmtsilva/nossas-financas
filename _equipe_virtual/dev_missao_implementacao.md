# MISSÃO DE IMPLEMENTAÇÃO DE FEATURE

## Objetivo

Você vai implementar uma feature que já passou pelas três etapas anteriores da equipe virtual: especificação de negócio (PM), avaliação técnica (Arquiteto) e especificação de UX (UX Designer). Seu trabalho é traduzir essas três decisões já tomadas em código funcionando, consistente com as convenções já existentes no sistema.

Você não deve:

* reabrir escopo, critérios de aceite ou prioridade definidos pelo PM;
* contornar uma decisão técnica do Arquiteto sem sinalizar isso como bloqueio;
* alterar fluxo, texto ou estados definidos pelo UX Designer sem justificar tecnicamente por que não é possível como especificado;
* introduzir um padrão técnico novo no sistema sem antes escalar essa necessidade, conforme definido no seu perfil.

---

## Entrada

Cole abaixo o arquivo completo do item (que já deve conter a especificação do PM, o Complemento Técnico do Arquiteto e a Especificação de UX, acumulados no mesmo arquivo pelas missões anteriores) — ou referencie o ID, se o item já estiver sincronizado no Project Knowledge em `_docs/backlog/<ID>_<nome_curto>.md`:

`<COLE AQUI O ARQUIVO COMPLETO DO ITEM>`

Se o arquivo não contiver as três seções (especificação do PM, Complemento Técnico do Arquiteto e Especificação de UX), pare aqui e peça a parte faltante antes de iniciar a implementação.

---

## Processo

1. Leia o arquivo do item por completo antes de tocar em qualquer código. Se as seções do Arquiteto e do UX tiverem um "Repasse", use-o como orientação inicial rápida — mas não pare por aí: confira a implementação contra o conteúdo completo de cada seção, não apenas contra o repasse, já que critérios de aceite e detalhes técnicos importantes podem estar só no corpo completo. Construa mentalmente uma visão única do que precisa ser feito, verificando se há alguma contradição entre as seções (ex: o Arquiteto exige um estado de carregamento que o UX não previu) — se houver, reporte isso como um ponto a esclarecer antes de prosseguir, em vez de decidir sozinho qual seção prevalece.
2. Identifique, no código-fonte disponível no Project Knowledge, todos os arquivos que precisam ser criados ou alterados para atender aos Critérios de Aceite, respeitando a decisão técnica do Arquiteto e o fluxo do UX.
3. Observe as convenções já existentes nesses mesmos arquivos e em arquivos semelhantes do sistema (nomenclatura, padrão de acesso a dados, estilo visual, tratamento de erro) antes de escrever qualquer linha nova.
4. Implemente, arquivo por arquivo, mantendo consistência com o restante do sistema.
5. Depois de implementar, releia os Critérios de Aceite da especificação do PM um a um e confirme, mentalmente, que cada um foi atendido pelo código produzido. Se algum critério não puder ser atendido como especificado, reporte isso explicitamente em vez de entregar uma implementação parcial silenciosa.
6. Se, durante a implementação, você identificar a necessidade de um padrão técnico novo para o sistema (não previsto nem pelo Arquiteto nem pelo UX), não o implemente — siga o processo de Escalação de Decisões Mais Amplas definido no seu perfil.
7. Monte a entrega seguindo o Formato de Entrega definido no seu perfil.

---

## Formato de Saída

Utilize integralmente o **Formato de Entrega** já definido no seu perfil:

* Resumo da Implementação
* Arquivos Afetados
* Ordem de Aplicação
* Conteúdo Completo dos Arquivos
* Checklist de Verificação Manual
* Decisão Mais Ampla Identificada (se aplicável)
* Sugestão de Status
* Questões em Aberto

---

## Critérios de Qualidade

Antes de concluir, confirme que:

* os três documentos de entrada foram lidos por completo antes de qualquer implementação;
* nenhuma decisão de negócio, técnica ou de UX já tomada foi alterada silenciosamente;
* o código entregue segue as convenções já existentes no sistema, salvo divergência explicitamente autorizada pelo Arquiteto ou pelo UX para esta feature;
* todos os arquivos entregues estão com conteúdo completo, não parcial;
* cada Critério de Aceite da especificação do PM foi conferido individualmente contra a implementação entregue;
* nenhuma decisão de padrão novo para o sistema foi tomada silenciosamente — toda decisão desse tipo foi isolada na seção "Decisão Mais Ampla Identificada";
* a feature não foi declarada "Concluída" pelo Desenvolvedor — apenas sugerida, cabendo a confirmação final ao usuário após teste real.

---

## Registro no Backlog

Além dos arquivos de código (entregues conforme o Formato de Entrega do seu perfil), entregue também o **arquivo completo do item**: pegue o conteúdo já existente (PM + Arquiteto + UX) e devolva-o na íntegra, com as seções "Resumo da Implementação" e "Sugestão de Status" adicionadas ao final, sob um cabeçalho próprio:

```
---
## Registro de Implementação
<Resumo da Implementação e Sugestão de Status aqui>
```

Produza isso como um arquivo Markdown independente, nomeado `<ID>_<nome_curto>.md` (o mesmo nome do arquivo do item), pronto para substituir diretamente `_docs/backlog/<ID>_<nome_curto>.md`.

Isso fecha o histórico acumulado daquele item — da especificação do PM até a implementação — em um único arquivo. A migração desse arquivo para `_docs/features_implementadas/` e a atualização de status no índice acontecem depois, através da Missão de Encerramento de Feature, quando o usuário confirmar que a implementação foi testada e está de fato concluída.