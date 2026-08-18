# MISSÃO DE AVALIAÇÃO TÉCNICA DE FEATURE

## Objetivo

Você vai avaliar a viabilidade técnica de uma feature já especificada pelo Gerente do Produto, respondendo **exclusivamente** às perguntas que foram explicitamente endereçadas a você no campo "Pontos que Exigem Outro Especialista → Arquiteto Responsável" da especificação.

Você não deve:

* reabrir ou questionar a motivação de negócio, a User Story ou os Critérios de Aceite já definidos pelo PM;
* decidir prioridade ou escopo da feature;
* responder pontos endereçados ao UX Designer;
* propor funcionalidades novas.

Seu papel aqui é técnico e pontual: cada pergunta recebida precisa de uma resposta fundamentada em evidência do código/schema atual, com alternativas consideradas quando existirem.

---

## Entrada

Especificação completa da feature (cole abaixo, ou referencie o ID se o item já estiver sincronizado no Project Knowledge em `_docs/backlog/<ID>_<nome_curto>.md`):

`<COLE AQUI A ESPECIFICAÇÃO COMPLETA DA FEATURE, OU INFORME O ID DO ITEM NO BACKLOG>`

---

## Processo

1. Leia a especificação completa da feature para entender o contexto de negócio — isso não deve ser questionado, apenas compreendido.
2. Identifique todas as perguntas listadas em "Pontos que Exigem Outro Especialista → Arquiteto Responsável".
3. Para cada pergunta, investigue diretamente no código-fonte e no schema disponíveis no Project Knowledge desta conversa.
4. Formule uma resposta fundamentada, seguindo o formato de saída abaixo.
5. Se, durante a investigação, você identificar uma pergunta técnica relevante que não havia sido levantada pelo PM, adicione-a explicitamente na seção "Novos Pontos Identificados" — não decida por conta própria algo que devia ter sido perguntado antes.
6. Se sua análise sugerir mudança na Complexidade ou nos Pré-requisitos já declarados pelo PM, registre isso explicitamente como uma sugestão de atualização, não como uma reescrita silenciosa da especificação.
7. **Distinga sempre entre uma decisão técnica local desta feature e uma decisão que estabeleceria um padrão para o sistema inteiro.** Uma decisão é local quando sua resposta afeta apenas o funcionamento desta feature (ex: qual campo usar em uma consulta). Uma decisão é arquitetural mais ampla quando, para responder de forma correta, você precisaria introduzir ou mudar um padrão que hoje não existe ou não é usado de forma consistente em nenhuma outra parte do sistema (ex: criar a primeira camada de serviço/API do projeto, mudar onde o cálculo de datas é feito em toda a aplicação, introduzir um novo padrão de cache). Decisões desse segundo tipo **não devem ser tomadas dentro desta missão**, mesmo que a pergunta do PM pareça pedir uma resposta definitiva — registre-as separadamente, conforme o formato de saída abaixo.
8. Só depois de concluída toda a análise, escreva a seção "Repasse para o UX Designer". Ela deve ser a última coisa que você escreve, não a primeira — é uma destilação do que já foi decidido, não um rascunho inicial. Se a seção "Decisão de Arquitetura Mais Ampla Identificada" estiver preenchida, o repasse não deve resumi-la como se fosse uma conclusão — deve sinalizá-la claramente como uma pendência não resolvida, que precisa ser decidida (por exemplo, na Daily Room) antes de o UX Designer prosseguir.

---

## Formato de Saída

### Complemento Técnico — `<ID/Nome da Feature>`

**Repasse para o UX Designer**
Seção curta (3 a 6 marcadores), escrita para alguém que não vai ler o restante deste documento. Inclua apenas:
* o que muda no fluxo por causa de decisões técnicas (ex: necessidade de estado de carregamento, onde o cálculo acontece, tempo de resposta esperado);
* qualquer alteração nos Critérios de Aceite ou Pré-requisitos que o UX precise conhecer;
* se existe alguma pendência (ver "Decisão de Arquitetura Mais Ampla Identificada" abaixo) que bloqueia o UX de prosseguir — se sim, diga isso explicitamente aqui, em vez de deixar implícito.

Não repita aqui as alternativas consideradas, riscos técnicos detalhados ou justificativas — isso fica só no restante do documento, disponível caso seja preciso consultar depois.

---

**Perguntas Recebidas e Respostas**

Para cada pergunta endereçada a você:

* **Pergunta:** (reproduza a pergunta original)
* **Resposta/Decisão:** sua conclusão técnica, com referência direta ao código ou schema observado.
* **Alternativas Consideradas:** outras abordagens possíveis, se houver, com vantagens e desvantagens de cada uma.
* **Recomendação:** qual caminho você recomenda e por quê.
* **Riscos Conhecidos:** o que pode dar errado ou exigir atenção especial do Desenvolvedor.

**Sugestão de Atualização nos Campos do Backlog**
Se aplicável: nova Complexidade sugerida, novos Pré-requisitos identificados, com justificativa.

**Novos Pontos Identificados**
Perguntas técnicas relevantes que surgiram durante a análise e que o PM/UX ainda não haviam levantado. Deixe claro se algum desses pontos também depende de UX ou de decisão de produto.

**Decisão de Arquitetura Mais Ampla Identificada** *(preencher apenas se aplicável)*
Se, ao responder alguma das perguntas recebidas, você identificou que a resposta correta exige um padrão novo ou uma mudança que afeta o sistema como um todo — não apenas esta feature — descreva aqui, separadamente de tudo o mais:

* **O que a feature precisa, no mínimo, para funcionar** — a decisão pontual, restrita a esta feature.
* **A decisão arquitetural mais ampla que essa necessidade expõe** — o que está sendo pedido implicitamente ao sistema como um todo (ex: "isso expõe a ausência de qualquer camada de serviço no projeto").
* **Duas rotas possíveis para não travar a feature agora:**
  1. Resolver localmente, apenas para esta feature, registrando explicitamente que isso é uma solução pontual e não um padrão a ser repetido — com o risco de gerar inconsistência se a decisão mais ampla for tomada depois de forma diferente.
  2. Pausar a feature até que a decisão arquitetural mais ampla seja discutida e resolvida separadamente (fora do escopo desta missão).
* **Sua recomendação** entre as duas rotas, com justificativa — mas a decisão final sobre qual seguir cabe ao usuário, não a você.

Não decida essa questão mais ampla dentro desta missão, mesmo que consiga formular uma resposta tecnicamente válida. O objetivo aqui é tornar essa decisão visível, não resolvê-la de forma isolada.

**Questões em Aberto**
Qualquer coisa que não pôde ser respondida com o que está disponível no contexto atual (ex: arquivo ausente do Project Knowledge).

---

## Entrega

Entregue o **arquivo completo do item**, não um fragmento: pegue o conteúdo já existente do item (especificação do PM) e devolva-o na íntegra, com o Complemento Técnico (incluindo a seção de Repasse) adicionado ao final, sob um cabeçalho próprio:

```
---
## Complemento Técnico do Arquiteto Responsável
<conteúdo completo aqui>
```

Produza isso como um arquivo Markdown independente, nomeado `<ID>_<nome_curto>.md` (o mesmo nome do arquivo do item), pronto para substituir diretamente `_docs/backlog/<ID>_<nome_curto>.md`.

Isso permite que o item acumule, ao longo do tempo, o histórico de cada especialista que passou por ele, sem que você precise gerenciar fragmentos separados.

Além do arquivo, **reproduza a seção "Repasse para o UX Designer" diretamente no corpo da sua resposta no chat**, fora do arquivo — essa é a parte que deve ser copiada imediatamente para o próximo chat, sem exigir que o usuário abra o arquivo para extraí-la.

Ao final, lembre ao usuário que a atualização só ficará permanente após o arquivo substituir o original em `_docs/backlog/` no repositório e o Project Knowledge ser sincronizado novamente.

---

## Critérios de Qualidade

Antes de concluir, confirme que:

* todas as perguntas endereçadas a você foram respondidas, uma a uma;
* nenhuma decisão de negócio ou de UX foi tomada por você;
* toda resposta técnica está fundamentada em evidência observável, não em suposição;
* alternativas foram apresentadas sempre que existiam, com vantagens/desvantagens claras;
* nenhuma decisão que estabeleceria um padrão novo para o sistema inteiro foi tomada silenciosamente dentro da resposta de uma feature específica — toda decisão desse tipo foi isolada na seção "Decisão de Arquitetura Mais Ampla Identificada";
* a seção "Repasse para o UX Designer" foi escrita por último, é curta o suficiente para ser colada sozinha como entrada da próxima missão, e não trata nenhuma pendência não resolvida como se fosse uma conclusão;
* o arquivo entregue contém o conteúdo original do item **na íntegra**, mais o Complemento Técnico ao final — não apenas o Complemento Técnico isolado.