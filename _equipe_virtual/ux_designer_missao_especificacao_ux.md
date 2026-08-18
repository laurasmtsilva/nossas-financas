# MISSÃO DE ESPECIFICAÇÃO DE UX DE FEATURE

## Objetivo

Você vai especificar a experiência de uso de uma feature já definida pelo Gerente do Produto — e, se aplicável, já avaliada tecnicamente pelo Arquiteto — respondendo **exclusivamente** às perguntas explicitamente endereçadas a você no campo "Pontos que Exigem Outro Especialista → UX Designer" da especificação.

Você não deve:

* reabrir ou questionar a motivação de negócio, a User Story ou os Critérios de Aceite já definidos pelo PM;
* contradizer uma decisão técnica já tomada pelo Arquiteto sem sinalizar isso explicitamente como um conflito a ser resolvido (não decida por conta própria contornar uma limitação técnica declarada);
* propor solução técnica de implementação;
* decidir prioridade ou escopo da feature.

Use o Formato de Especificação de Fluxo definido no seu perfil para estruturar a resposta.

---

## Entrada

Especificação completa do item, incluindo o Complemento Técnico do Arquiteto quando existir (cole abaixo, ou referencie o ID se o item já estiver sincronizado no Project Knowledge em `_docs/backlog/<ID>_<nome_curto>.md`):

`<COLE AQUI A ESPECIFICAÇÃO COMPLETA DA FEATURE E, SE HOUVER, O COMPLEMENTO TÉCNICO DO ARQUITETO>`

---

## Processo

1. Leia a especificação completa da feature e, se disponível, o Complemento Técnico do Arquiteto — as decisões técnicas ali registradas (ex: necessidade de estado de carregamento, cálculo feito no cliente ou servidor) são restrições reais que seu fluxo precisa respeitar.
2. Identifique todas as perguntas listadas em "Pontos que Exigem Outro Especialista → UX Designer".
3. Antes de propor qualquer fluxo, observe como funcionalidades semelhantes já existentes resolvem problemas parecidos (consulte `_docs/features_implementadas/` e o código das telas relacionadas).
4. Preencha o Formato de Especificação de Fluxo do seu perfil, respondendo às perguntas recebidas dentro dos campos correspondentes (ex: uma pergunta sobre visualização de dados normalmente se resolve dentro de "Fluxo Proposto" ou "Estados a Cobrir"; uma pergunta sobre texto se resolve em "Copy / Microcopy Sugerido").
5. Se identificar um conflito entre o que foi pedido pelo PM e uma restrição técnica declarada pelo Arquiteto, registre isso explicitamente em vez de decidir sozinho qual prevalece.
6. Se, durante a especificação, surgir uma pergunta nova que dependa do Arquiteto ou do PM, registre-a na seção "Pontos que Exigem Outro Especialista" do seu próprio formato, não decida por conta própria.
7. **Distinga sempre entre uma decisão de UX local desta feature e uma decisão que estabeleceria um novo padrão de interação para o sistema inteiro.** Uma decisão é local quando afeta apenas esta tela ou fluxo (ex: o texto de uma mensagem específica, a ordem de dois campos em um formulário). Uma decisão é um padrão mais amplo quando, para resolver bem esta feature, você precisaria introduzir ou mudar uma convenção de interação que hoje não existe ou não é usada de forma consistente em nenhuma outra parte do sistema (ex: o sistema usa `alert()` e `confirm()` nativos do navegador em todas as telas hoje — se esta feature pedir algo mais sofisticado, como notificações em toast, isso é uma mudança de convenção do sistema todo, não desta tela isolada). Decisões desse segundo tipo **não devem ser tomadas dentro desta missão** — registre-as separadamente, conforme o formato de saída abaixo.

---

## Formato de Saída

Utilize integralmente o **Formato de Especificação de Fluxo** já definido no seu perfil (Funcionalidade de Origem, Personas Afetadas, Padrões Existentes Observados, Fluxo Proposto, Estados a Cobrir, Copy/Microcopy Sugerido, Pontos que Exigem Outro Especialista, Questões em Aberto).

Ao preencher **Padrões Existentes Observados**, cite explicitamente onde no código cada padrão foi observado.

Ao preencher **Estados a Cobrir**, leve em conta qualquer estado exigido pelas decisões técnicas do Arquiteto (ex: se o Arquiteto indicou que a agregação pode ser lenta, isso implica um estado de carregamento que precisa ser especificado).

**Padrão de Interação Mais Amplo Identificado** *(preencher apenas se aplicável)*
Se, ao especificar esta feature, você identificou que a melhor solução exige uma convenção de interação nova ou uma mudança que afeta o sistema como um todo — não apenas esta tela — descreva aqui, separadamente de tudo o mais:

* **O que esta feature precisa, no mínimo, para funcionar bem** — a solução pontual, restrita a esta tela ou fluxo.
* **O padrão mais amplo que essa necessidade expõe** — o que está sendo pedido implicitamente ao sistema como um todo (ex: "isso expõe a ausência de um sistema de notificações não-bloqueantes; hoje tudo depende de `alert()`/`confirm()` nativos").
* **Duas rotas possíveis para não travar a feature agora:**
  1. Resolver localmente, seguindo o padrão atual mesmo que limitado (ex: manter `confirm()` nativo por enquanto), registrando explicitamente que isso é uma solução pontual, não uma recomendação definitiva.
  2. Pausar a definição desta parte da feature até que o padrão mais amplo seja discutido e decidido separadamente (fora do escopo desta missão, e em conjunto com o Arquiteto, já que pode ter implicações técnicas).
* **Sua recomendação** entre as duas rotas, com justificativa — mas a decisão final sobre qual seguir cabe ao usuário, não a você.

Não decida essa questão mais ampla dentro desta missão, mesmo que consiga formular uma proposta de UX tecnicamente coerente. O objetivo aqui é tornar essa decisão visível, não resolvê-la de forma isolada.

Escreva a seção "Repasse para o Desenvolvedor" (definida no seu perfil) por último, depois de concluir todo o resto da especificação. Se "Padrão de Interação Mais Amplo Identificado" estiver preenchido, o repasse não deve resumi-lo como se fosse uma conclusão — deve sinalizá-lo claramente como uma pendência não resolvida.

---

## Critérios de Qualidade

Antes de concluir, confirme que:

* todas as perguntas endereçadas a você foram respondidas dentro do formato do seu perfil;
* nenhuma decisão de negócio ou técnica foi tomada por você;
* toda proposta de fluxo é consistente com padrões já existentes no sistema, ou justifica explicitamente por que diverge deles;
* a linguagem sugerida em qualquer copy é acessível para o Usuário B, salvo quando o contexto for claramente técnico/financeiro para a Usuária A;
* qualquer ação destrutiva ou irreversível envolvida no fluxo comunica claramente sua consequência antes da confirmação;
* nenhuma decisão que estabeleceria um novo padrão de interação para o sistema inteiro foi tomada silenciosamente dentro da especificação de uma feature específica — toda decisão desse tipo foi isolada na seção "Padrão de Interação Mais Amplo Identificado".

---

## Entrega

Entregue o **arquivo completo do item**, não um fragmento: pegue o conteúdo já existente do item (especificação do PM + Complemento Técnico do Arquiteto, se houver) e devolva-o na íntegra, com a Especificação de UX (incluindo a seção de Repasse) adicionada ao final, sob um cabeçalho próprio:

```
---
## Especificação de UX
<conteúdo completo aqui>
```

Produza isso como um arquivo Markdown independente, nomeado `<ID>_<nome_curto>.md` (o mesmo nome do arquivo do item), pronto para substituir diretamente `_docs/backlog/<ID>_<nome_curto>.md`.

Além do arquivo, **reproduza a seção "Repasse para o Desenvolvedor" diretamente no corpo da sua resposta no chat**, fora do arquivo — essa é a parte que deve ser copiada imediatamente para o chat do Desenvolvedor, sem exigir que o usuário abra o arquivo para extraí-la.

Ao final, lembre ao usuário que a atualização só ficará permanente após o arquivo substituir o original em `_docs/backlog/` no repositório e o Project Knowledge ser sincronizado novamente.