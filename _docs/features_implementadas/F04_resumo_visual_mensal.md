# `F04` — Resumo Visual Mensal: Receitas x Despesas (primeira fatia do Dashboard)

**Motivação / Problema**
Hoje a página inicial é um placeholder textual sem nenhum dado real, e nenhuma tela do sistema oferece uma visão consolidada da situação financeira — todas as funcionalidades existentes são de inserção de dados, nenhuma devolve uma resposta. Esta é a lacuna mais direta entre o propósito declarado em `00_context.md` e o que está construído. Este item é a primeira fatia entregável do dashboard (anteriormente um único item genérico "A Detalhar"), com escopo deliberadamente reduzido para viabilizar entrega rápida: conecta-se diretamente com **"Quanto ainda posso gastar este mês?"** e **"Estamos dentro do orçamento?"**, e indiretamente com "Quanto dinheiro realmente temos disponível?" (esta última pergunta, em sua forma completa — saldo acumulado de contas — permanece fora de escopo aqui; ver F04.3 abaixo).

**User Story**
- Como Usuária A, eu quero ver rapidamente o total de receitas e despesas do mês, com o saldo (sobra ou falta) já calculado, para que eu não precise somar manualmente para saber minha margem.
- Como Usuário B, eu quero ver, sem precisar interpretar números soltos, se ainda sobra dinheiro este mês ou se estamos gastando mais do que ganhamos, para que eu tome essa decisão com confiança mesmo sem entender de finanças.

**Critérios de Aceite**
- [ ] A página inicial exibe, para o mês atual, dois gráficos de rosca (donut) concêntricos: o anel externo representa o total de receitas do mês; o anel interno representa o total de despesas do mês. *(Nota: a escolha de "dois donuts concêntricos" é uma preferência de visualização da Laura, registrada aqui como intenção a ser validada pelo UX Designer — não é um critério travado; se o UX Designer identificar que essa forma não comunica bem, especialmente para o Usuário B, cabe a ele propor alternativa e justificar a mudança.)*
- [ ] **Receita do mês** = soma de `transacoes` cujo `tipo` seja `receita` e cuja `data_competencia` esteja dentro do mês/ano atual.
- [ ] **Despesa do mês** = soma de `transacoes` cujo `tipo` seja `despesa` e cuja `data_competencia` esteja dentro do mês/ano atual — isso inclui tanto despesas pagas diretamente por conta quanto parcelas de cartão cuja fatura vence neste mês, **independentemente do status** (`pago`/`pendente` da transação, ou `ABERTA`/`FECHADA`/`PAGA` da fatura) nesta primeira versão. Não há filtro de status nesta entrega — ver F04.1.
- [ ] Ambos os totais (receita e despesa) são calculados a partir da **mesma tabela** (`transacoes`, por `data_competencia`) — não a partir de `lancamentos` — para garantir que os dois lados do gráfico usem sempre o mesmo critério de período (competência), evitando que uma receita registrada em um mês apareça somada em um período diferente do das despesas.
- [ ] O sistema calcula uma variável de saldo do mês = (receita do mês) − (despesa do mês).
- [ ] Quando o saldo do mês é positivo, o sistema exibe isso em linguagem simples e direta (ex.: "Sobram R$ X este mês para gastar"), não apenas como um número isolado.
- [ ] Quando o saldo do mês é negativo, o sistema exibe isso também em linguagem simples (ex.: "Faltam R$ X este mês para fechar as contas"), evitando termos técnicos como "saldo negativo" ou "déficit" sem explicação — decisão final de texto cabe ao UX Designer, mas o requisito de negócio é: a mensagem deve ser compreensível sem conhecimento financeiro prévio.
- [ ] Quando receita e despesa do mês são iguais, o sistema indica que estão equilibradas.
- [ ] Nesta primeira versão, os valores somam lançamentos PF e PJ juntos, sem segmentação (visão única do casal) — ver F04.2 para o filtro futuro.
- [ ] Nesta primeira versão, o resumo é sempre referente ao mês atual (mês corrente do calendário); não há seletor de mês/ano diferente.

**Impacto por Persona**
- Usuária A: ganha, pela primeira vez no sistema, uma resposta direta e visual à pergunta "estou bem ou mal este mês?", sem precisar somar lançamentos manualmente.
- Usuário B: é o maior beneficiário direto desta feature — pela primeira vez, o sistema entrega uma resposta (não apenas dados brutos) em linguagem acessível. O maior risco de UX aqui é justamente para esta persona: se o gráfico não for acompanhado da frase em linguagem simples, dois círculos concêntricos sozinhos podem não comunicar nada por si só. Este ponto está refletido como critério de aceite explícito acima, não deve ser tratado como opcional pelo UX/Dev.

**Complexidade**
🟡 Média (estimativa de negócio). **Atenção declarada ao Arquiteto:** hoje não existe nenhum cálculo agregado em nenhuma tela do sistema, nem camada de serviço/API — toda consulta é feita diretamente da página ao Supabase. Somar `transacoes` por `data_competencia` e `lancamentos` por `data`, dentro do mês atual, é uma agregação nova. Peço avaliação técnica formal de complexidade antes de considerar este número definitivo.

**Pré-requisitos**
Nenhuma nova estrutura de dados identificada como necessária — os campos usados (`transacoes.tipo`, `transacoes.data_competencia`, `transacoes.valor`) já existem no schema atual. **A confirmar com o Arquiteto:** se essa suposição se sustenta ou se há necessidade de ajuste — em especial, confirmar que toda receita lançada via conta de fato gera uma linha correspondente em `transacoes` (aparenta ser o caso, conforme o fluxo observado em `registro_de_lancamento.md`, mas cabe validação técnica formal).

**Status**
Concluída.

**Pontos que Exigem Outro Especialista**
- **Arquiteto Responsável:** (1) como implementar a agregação de receitas/despesas do mês atual dado que não há camada de serviço hoje — query direta na página, função no banco, ou outra abordagem; (2) confirmar se "mês atual" deve ser calculado no cliente (fuso horário do navegador) ou no servidor, para evitar inconsistência perto da virada do mês; (3) avaliar impacto de performance de somar todas as `transacoes` do mês sem paginação, à medida que o volume de dados cresce.
- **UX Designer:** (1) validar se dois gráficos de rosca concêntricos comunicam bem a diferença entre dois totais de escalas possivelmente muito diferentes, sobretudo para o Usuário B; (2) desenhar a frase de saldo/falta com destaque visual adequado; (3) decidir onde esta seção se posiciona na página inicial, que hoje é inteiramente um placeholder (`src/app/page.tsx`).

# Complemento Técnico — F04 (Resumo Visual Mensal: Receitas x Despesas)

Analisei exclusivamente os três pontos endereçados a mim, com base no código e schema já observados nas missões anteriores (System Overview e Database). Não reabri User Story, Critérios de Aceite ou motivação de negócio.

---

## Perguntas Recebidas e Respostas

### Pergunta 1
**Pergunta:** Como implementar a agregação de receitas/despesas do mês atual dado que não há camada de serviço hoje — query direta na página, função no banco, ou outra abordagem?

**Resposta/Decisão:**
Existe precedente direto no código atual para exatamente este tipo de cálculo. Em `src/app/faturas/page.tsx`, o total consolidado de uma fatura já é calculado dessa forma: os itens da fatura são trazidos via `.select(...)` filtrado por `fatura_id`, e a soma é feita no cliente com `parcelas.reduce((acc, curr) => acc + curr.valor, 0)`. Não há, em nenhuma página observada, uso de função de banco (`supabase.rpc(...)`) nem de rota de API própria — ambos ausentes do projeto inteiro, conforme já registrado no System Overview ("Ausência de camada de API própria").

Também existe um precedente parcial de deixar o Postgres/PostgREST computar algo em vez de trazer todas as linhas: em `src/app/contas/page.tsx`, a contagem de transações vinculadas a uma conta é feita com `.select('*', { count: 'exact', head: true })`, sem baixar as linhas — mas isso é uma contagem, não uma soma de valores.

**Alternativas Consideradas:**

| Alternativa | Descrição | Vantagens | Desvantagens |
|---|---|---|---|
| **A — Fetch + soma no cliente** | `.select('valor, tipo, data_competencia')` filtrado por intervalo de datas, soma feita em JS (`reduce`) | Réplica exata de um padrão já em produção (`totalFatura`); zero código novo de infraestrutura; menor risco de regressão | Todas as linhas do mês trafegam para o navegador antes de serem somadas |
| **B — Query agregada via PostgREST** | `.select('tipo, valor.sum()')` agrupado por `tipo`, com filtro de `data_competencia` | Menos dados trafegados; o Postgres faz a soma | Nunca usado neste projeto (só existe precedente de `count`, não de `sum()`); comportamento com RLS `USING(true)` não foi testado no código disponível |
| **C — Função Postgres / RPC** | Função no banco que recebe mês/ano e retorna os totais | Centraliza a lógica no banco; reutilizável | Não existe nenhuma função de banco no schema hoje — seria a primeira. Ver seção "Decisão de Arquitetura Mais Ampla" |
| **D — Rota de API Next.js** | `src/app/api/.../route.ts` fazendo a agregação no servidor | Centraliza lógica fora do componente de página | Não existe nenhuma rota de API no projeto hoje — seria a primeira. Ver seção "Decisão de Arquitetura Mais Ampla" |

**Recomendação:** Alternativa A. É a que introduz menos elementos novos ao sistema — reaproveita, ponto a ponto, o padrão já validado em produção no `faturas/page.tsx`. Dado o porte do sistema (uso familiar, conforme `00_context.md`), o volume mensal esperado de `transacoes` é presumivelmente baixo, o que reduz o peso da desvantagem de trafegar todas as linhas.

**Riscos Conhecidos:** Se o volume de `transacoes` por família crescer substancialmente ao longo do tempo, a Alternativa A deixa de escalar tão bem quanto a B — mas isso é uma condição futura, não um risco imediato observável hoje.

---

### Pergunta 2
**Pergunta:** Confirmar se "mês atual" deve ser calculado no cliente (fuso horário do navegador) ou no servidor, para evitar inconsistência perto da virada do mês.

**Resposta/Decisão:**
Todo o cálculo de datas hoje observado no sistema é feito no cliente. Em `src/app/lancamentos/page.tsx`, o campo de data do formulário é inicializado com `new Date().toISOString().split('T')[0]` (client-side), e a função `calcularMesAnoFatura` — que decide em qual mês/ano cada parcela de cartão entra — também executa inteiramente no navegador, sem qualquer cálculo de data feito no servidor ou no banco. Não existe Server Component, Server Action ou rota de API fazendo esse tipo de cálculo em nenhum lugar do código disponível.

Calcular "mês atual" no cliente é, portanto, consistente com o único padrão de cálculo de datas que o sistema já usa hoje.

**Alternativas Consideradas:**
* **Cliente (navegador):** consistente com o padrão 100% client-side já existente. Nenhuma infraestrutura nova necessária.
* **Servidor:** exigiria algum ponto de execução server-side que hoje não existe (Server Component, API route ou função de banco) — dependeria da mesma decisão arquitetural mais ampla da Pergunta 1.

**Recomendação:** Calcular no cliente, por consistência com o padrão observado.

**Riscos Conhecidos:** Há uma sutileza já presente no código atual, não introduzida por esta feature: `new Date().toISOString()` retorna a data em UTC, não no fuso horário local do navegador. Isso significa que `.split('T')[0]` já pode divergir do "dia local" do usuário próximo à virada de dia, dependendo do fuso horário (ex.: no fuso de Brasília, UTC−3, entre 21h e 23h59 no horário local o `toISOString()` já reporta o dia seguinte em UTC). Essa mesma característica se propaga para o cálculo de "mês atual": perto da virada do mês, um usuário no Brasil pode, em teoria, ver o resumo referente a um mês diferente do que percebe estar vivendo, dependendo do horário exato. Esse comportamento já existe hoje em como `lancamentos.data` é preenchido por padrão — esta feature herda o risco, não o introduz.

---

### Pergunta 3
**Pergunta:** Avaliar impacto de performance de somar todas as `transacoes` do mês sem paginação, à medida que o volume de dados cresce.

**Resposta/Decisão:**
Duas evidências estruturais são relevantes aqui, ambas observadas diretamente:

1. **Ausência de índices adicionais no schema.** `supabase/schema.sql` define apenas chaves primárias, restrições `UNIQUE` e chaves estrangeiras. Não há nenhuma instrução `CREATE INDEX` no schema disponível — em particular, não há índice sobre `transacoes.data_competencia` nem sobre `transacoes.tipo`, os dois campos que este filtro usaria.
2. **Limite de linhas configurado no Supabase.** `supabase/config.toml` define `max_rows = 1000` na seção `[api]`, descrito como "the maximum number of rows returned from a view, table, or stored procedure." Isso significa que, independentemente da abordagem de query escolhida na Pergunta 1, uma consulta que traga linhas de `transacoes` está sujeita a esse teto — se o volume de transações de um mês algum dia ultrapassar 1000 linhas, o resultado seria truncado silenciosamente por essa configuração, não pela query em si.

Não há, no contexto disponível, nenhum dado real de volume de transações em produção — portanto não é possível quantificar o impacto de performance atual, apenas apontar os limites estruturais existentes.

**Alternativas Consideradas:** já cobertas na Pergunta 1 (A traz mais linhas, B/C/D trazem menos ou nenhuma linha bruta).

**Recomendação:** Nenhuma ação preventiva parece necessária agora — a Alternativa A (Pergunta 1) deve funcionar sem problema perceptível dado o porte de uso familiar declarado em `00_context.md`. Não estou recomendando adicionar índice ou mudar a abordagem preventivamente, pois isso seria uma proposta de melhoria fora do escopo desta missão.

**Riscos Conhecidos:** O teto de `max_rows = 1000` é um fato de configuração, não uma garantia de performance — uma consulta que se aproxime desse limite ainda precisaria transferir e somar até 1000 linhas no navegador a cada carregamento da página inicial. O Desenvolvedor deve estar ciente desse teto ao implementar, mesmo que o risco atual seja baixo.

---

## Sugestão de Atualização nos Campos do Backlog

**Pré-requisitos** — a especificação pede confirmação de que "toda receita lançada via conta de fato gera uma linha correspondente em `transacoes`". Confirmo essa suposição com evidência direta: em `src/app/lancamentos/page.tsx`, um `useEffect` força `meio_pagamento` para `'CONTA'` sempre que `tipo === 'RECEITA'` (`if (tipo === 'RECEITA') setMeioPagamento('CONTA')`), e o ramo `meioPagamento === 'CONTA'` de `handleSalvar` sempre insere exatamente um registro em `transacoes`, com `tipo: tipo.toLowerCase()` e `data_competencia: data`. Não há caminho no código atual em que uma receita seja registrada em `lancamentos` sem gerar a linha correspondente em `transacoes`. A suposição do PM se sustenta — nenhum novo pré-requisito de dados é necessário para esta feature.

**Complexidade** — não tenho evidência que justifique alterar a estimativa "Média" atribuída pelo PM; é uma estimativa de negócio, fora do meu escopo de decisão. Registro apenas, como dado técnico, que a existência de um precedente idêntico em produção (`totalFatura`) reduz o risco de implementação da agregação em si — o que pode ser útil ao PM/Dev ao refinar a estimativa, mas a decisão final de complexidade não me cabe.

---

## Novos Pontos Identificados

* **Ausência de índice em `transacoes.data_competencia`:** não é uma pergunta que exige resposta antes de implementar esta feature (o volume esperado é baixo), mas é um fato técnico que o Desenvolvedor deve conhecer, já que este é o primeiro filtro por intervalo de datas em uma consulta agregada no sistema. Não depende de UX ou de decisão de produto — é uma questão técnica pura, que registro apenas para visibilidade, sem recomendar ação.
* **Teto `max_rows = 1000` do Supabase:** aplicável a qualquer abordagem de implementação escolhida (Pergunta 1). Vale a pena o Desenvolvedor confirmar, no momento da implementação, se esse valor está de fato ativo no ambiente de produção (o arquivo `config.toml` reflete a configuração local/CLI, e pode ou não corresponder 1:1 ao projeto Supabase hospedado — não tenho evidência que confirme isso).

---

## Decisão de Arquitetura Mais Ampla Identificada

**O que a feature precisa, no mínimo, para funcionar:**
Uma consulta direta ao Supabase a partir de `src/app/page.tsx` (ou de um novo componente por ela importado), filtrando `transacoes` por `data_competencia` dentro do mês atual e somando os valores no cliente — replicando o padrão já usado em `faturas/page.tsx` para `totalFatura`. Isso não exige nenhuma estrutura nova no projeto.

**A decisão arquitetural mais ampla que essa necessidade expõe:**
Esta é a primeira feature do sistema que precisa de um valor agregado (soma) em vez de uma listagem de registros individuais. O próprio PM já sinaliza, na Motivação, que este é apenas "a primeira fatia entregável do dashboard" — e o backlog referenciado na especificação já aponta desdobramentos futuros (F04.2, F04.3) que provavelmente também exigirão agregação, possivelmente mais complexa (saldo consolidado de contas, orçamento, comparação entre períodos). Isso expõe uma pergunta que nenhuma feature isolada deveria responder sozinha: **o sistema deve continuar resolvendo toda agregação futura no cliente (buscando linhas e somando em JS), ou este é o momento de introduzir a primeira forma de cálculo do lado do servidor (função de banco ou rota de API)?** Hoje não existe nenhum dos dois no projeto.

**Duas rotas possíveis para não travar a feature agora:**

1. **Resolver localmente**, implementando apenas o necessário para F04 (fetch + soma no cliente, replicando `totalFatura`), registrando explicitamente que essa é uma solução pontual desta feature — não um padrão validado para agregações futuras e potencialmente mais pesadas do dashboard (F04.2, F04.3, orçamento, etc.). Risco: se a decisão mais ampla vier depois e apontar para função de banco ou API, o código desta feature precisará ser reescrito, e cada nova fatia do dashboard pode repetir o mesmo padrão client-side até que a inconsistência fique mais cara de corrigir.
2. **Pausar** a implementação desta fatia do dashboard até que a decisão sobre uma eventual camada de agregação (função de banco, rota de API, ou manter tudo no cliente como padrão deliberado) seja discutida separadamente, fora do escopo desta missão.

**Minha recomendação:** Rota 1 (resolver localmente para F04), pelos seguintes motivos técnicos: (a) já existe precedente idêntico em produção; (b) o volume de dados esperado para esta feature específica é baixo; (c) a especificação do PM já demonstra deliberadamente escopo reduzido ("primeira fatia"), sugerindo que travar a entrega por uma decisão arquitetural maior contrariaria essa intenção de negócio, que não me cabe questionar. Ainda assim, sinalizo que essa recomendação vale **apenas para F04** — não deve ser lida como validação de que agregações futuras e mais complexas (F04.2, F04.3) também devem ser resolvidas da mesma forma sem nova avaliação. A decisão final sobre qual rota seguir cabe a você.

---

## Questões em Aberto

* Não há, no Project Knowledge disponível, nenhuma evidência sobre o volume real de dados em produção (quantidade de `transacoes` por família/mês). A avaliação de performance na Pergunta 3 é necessariamente estrutural (índices, `max_rows`), não empírica.
* Não foi possível confirmar se o valor `max_rows = 1000` de `supabase/config.toml` (configuração local/CLI) corresponde exatamente à configuração do projeto Supabase hospedado usado em produção — o arquivo disponível reflete apenas a configuração declarada para desenvolvimento local.

# `F04` — Resumo Visual Mensal: Receitas x Despesas — Especificação de UX

**Funcionalidade de Origem**
F04 (backlog / especificação do Gerente do Produto), com Complemento Técnico do Arquiteto Responsável já registrado. Esta especificação responde exclusivamente às três perguntas endereçadas ao UX Designer em "Pontos que Exigem Outro Especialista":
1. Validar se dois donuts concêntricos comunicam bem a diferença entre dois totais de escalas possivelmente muito diferentes, sobretudo para o Usuário B.
2. Desenhar a frase de saldo/falta com destaque visual adequado.
3. Decidir onde esta seção se posiciona na página inicial (`src/app/page.tsx`).

Não reabro User Story, Critérios de Aceite, motivação de negócio, nem as decisões técnicas já tomadas pelo Arquiteto (cálculo client-side, fonte única `transacoes`, ausência de filtro de status na v1).

---

**Personas Afetadas**

- **Usuária A**: quer o número exato rapidamente — precisa que os totais brutos (Receitas do mês / Despesas do mês) estejam visíveis e legíveis por si só, sem depender apenas da leitura de uma forma gráfica. Também é quem mais provavelmente vai questionar *por que* a despesa inclui parcelas ainda não pagas (critério de aceite explícito do PM: sem filtro de status na v1) — isso precisa estar visível, não escondido.
- **Usuário B**: é quem essa feature prioriza, conforme o próprio PM registrou. Precisa de uma resposta em frase, não de números soltos nem de um gráfico que exija interpretação. É também a persona mais vulnerável a um gráfico que, sem querer, comunique algo diferente do que os números realmente dizem (ver Fluxo Proposto, item 1).
- Nota de contexto: `00_context.md` descreve os usuários iniciais como um casal neurodivergente. Isso reforça — não introduz — os princípios já declarados de clareza, redução de ambiguidade e ausência de julgamento no tom das mensagens, especialmente nas de saldo negativo.

---

**Padrões Existentes Observados**

- **Card de total consolidado com destaque visual**: `src/app/faturas/page.tsx`, banner "Fatura em Detalhe" — label em caixa alta (`text-xs font-bold uppercase text-slate-500`) seguido de valor grande em `font-mono font-black text-[#9D4EDD]`. É o precedente mais próximo de "mostrar um valor agregado com destaque" no sistema.
- **Badges de status coloridos**: `src/app/faturas/page.tsx` (badges `PAGA`/`ABERTA`) e `src/app/lancamentos/page.tsx` (badge `PF`/`PJ`) — fundo translúcido + borda da mesma cor + texto em caixa alta, negrito, pequeno.
- **Paleta semântica já em uso**: emerald para receita/positivo (`ArrowUpRight`, ícone e cor em `lancamentos/page.tsx`), vermelho para despesa (`ArrowDownLeft`), âmbar para pendente/atenção (badge `ABERTA` em `faturas/page.tsx`, alerta de bloqueio em `contas/page.tsx`).
- **Estados de carregamento como texto narrativo curto**: "Buscando histórico..." (`lancamentos`), "Estruturando painel de crédito..." (`faturas`), "Separando parcelas..." (`faturas`) — sempre `text-sm font-mono text-slate-400/500`, nunca um spinner.
- **Estado vazio com ícone + mensagem centralizada**: `faturas/page.tsx`, bloco "Nenhum cartão cadastrado no sistema ainda", com `AlertCircle` e texto em `slate-400` — este é o padrão de referência para qualquer estado vazio novo.
- **Mensagens de status inline com emoji**: `✅`/`❌`/`⚠️` em `lancamentos/page.tsx` e `contas/page.tsx` — usado para feedback de ações do usuário (submeter formulário), não para leitura passiva de dados. Avalio abaixo se esse padrão deve ou não se estender a esta feature.
- **Ausência total de gráficos/visualização de dados**: nenhuma página, componente ou dependência do projeto (`package.json`) inclui biblioteca de charting. Esta feature será a primeira do sistema a introduzir uma representação visual não-textual de dados. Tratado separadamente na seção "Padrão de Interação Mais Amplo Identificado".
- **`src/app/page.tsx` (estado atual)**: página inicial hoje é inteiramente um placeholder estático — card centralizado com ícone, texto descritivo e dois links de atalho (`/lancamentos`, `/contas`). Não há nenhum dado real renderizado.

---

**Fluxo Proposto**

*1. Sobre a forma visual (Pergunta 1 — donuts concêntricos)*

Recomendo **não seguir a proposta de dois donuts concêntricos como registrada**, e explico o motivo, já que o PM deixou essa validação explicitamente a meu cargo.

Um gráfico de rosca (donut) codifica proporção através do comprimento do arco em relação a uma volta completa (360°) — ele é adequado quando os valores representam partes de um mesmo todo (ex.: "40% categoria A, 60% categoria B"). Aqui, receita e despesa **não são partes de um todo comum** — são dois totais independentes, sendo comparados entre si. Ao colocar cada um em um anel de raio diferente (concêntrico), surge um problema concreto de transparência: **um anel externo tem perímetro maior que um anel interno mesmo representando o mesmo valor numérico.** Ou seja, se receita e despesa forem exatamente iguais (o caso "equilibrado" previsto nos critérios de aceite), o anel externo (receita) tenderia a parecer visualmente "maior" que o interno (despesa), mesmo os dois números sendo idênticos — o gráfico contradiria a própria mensagem de texto que o acompanha ("estão equilibradas"). Isso fere diretamente o princípio de Transparência de `00_context.md` ("todo valor apresentado pelo sistema deve poder ser explicado") e é um risco maior justamente para o Usuário B, que tem menos repertório para desconfiar da forma gráfica e mais tendência a confiar no que vê primeiro.

**Alternativa proposta: duas barras horizontais na mesma escala, partindo da mesma base**, uma para receita (verde) e uma para despesa (vermelho/laranja), com o comprimento proporcional ao valor real — ou, alternativa ainda mais direta, **uma única barra "gangorra"**: um ponto central com uma extensão verde para um lado (receita) e uma extensão vermelha para o outro (despesa), onde a barra mais longa "vence" visualmente e empurra o resultado para o lado do saldo (sobra/falta).

| Opção | Vantagens | Desvantagens |
|---|---|---|
| **A — Duas barras horizontais, mesma escala** | Comparação direta e sem distorção; fácil de entender sem legenda; simples de construir sem biblioteca de gráficos | Menos "visualmente rico" que um gráfico circular; ainda exige rótulo por barra |
| **B — Barra única "gangorra" (divergente, a partir do centro)** | Comunica intuitivamente "quem está ganhando" sem precisar ler números — a barra maior é visualmente óbvia; conecta-se naturalmente com a frase de saldo | É uma metáfora visual nova no sistema; pode exigir teste com o Usuário B para confirmar que a leitura é intuitiva na primeira vez |
| **C — Donuts concêntricos (proposta original)** | Visualmente distintivo | Risco de comunicar proporção incorretamente, especialmente no caso "equilibrado"; nenhum precedente no sistema |
| **D — Apenas dois números grandes (sem forma gráfica), estilo `totalFatura`** | Mínimo risco de má interpretação; reaproveita padrão já validado em produção | Menos "resposta visual imediata" — o PM pede algo que comunique sem interpretação de número, e dois números soltos ainda exigem alguma leitura |

**Minha recomendação é a Opção B** (barra única divergente), por comunicar a relação entre os dois valores de forma direta e sem a distorção de proporção que os donuts introduziriam, e por se conectar naturalmente com a frase de saldo (que é, segundo o próprio PM, o elemento que não pode ser tratado como opcional). A Opção A é uma alternativa igualmente válida e mais conservadora, caso se prefira não introduzir uma metáfora visual nova. Ambas evitam o problema estrutural da Opção C.

*Isso é uma proposta de UX que diverge do que foi registrado como intenção pela Laura no critério de aceite — e o próprio critério autoriza essa divergência caso justificada. Sinalizo, ainda assim, que a decisão final sobre seguir ou não essa recomendação cabe à Laura/PM, não a mim.*

*2. Fluxo de tela*

1. Usuário autenticado chega em `/` (já passou pelo middleware de autenticação).
2. `Navbar` é renderizada normalmente (padrão de todas as páginas).
3. Abaixo da Navbar, a seção de Resumo Mensal é a **primeira coisa visível na página** — ver Pergunta 3, abaixo.
4. Enquanto os dados carregam, o usuário vê o estado de carregamento (ver "Estados a Cobrir").
5. Quando os dados chegam, o usuário vê: os dois totais numéricos (Receitas do mês / Despesas do mês), a barra comparativa, e a frase de saldo em destaque.
6. Abaixo do resumo, os atalhos que já existem hoje na página (`Ver Lançamentos`, `Gerenciar Contas`) permanecem, como ações secundárias.

*3. Sobre a posição na página inicial (Pergunta 3)*

O card placeholder atual ("Central de Inteligência Financeira", com ícone `TrendingUp` e texto descritivo) deve ser **substituído** pelo Resumo Mensal — não deve conviver ao lado dele como um elemento a mais. Justificativa: o placeholder existe hoje precisamente para anunciar que "este espaço se tornará o dashboard"; com F04 implementado, ele deixa de ter função, e mantê-lo ao lado do resumo real adicionaria um elemento textual redundante logo acima do dado real, contrariando o princípio de Progressividade (mostrar primeiro o essencial).

Proposta de hierarquia da nova página inicial, de cima para baixo:
1. Navbar (padrão, inalterado).
2. Resumo Mensal (números + barra + frase de saldo) — ocupa o espaço de maior destaque visual da página, correspondendo à posição hoje ocupada pelo card placeholder.
3. Atalhos rápidos (`Ver Lançamentos`, `Gerenciar Contas`) — mantidos como ações secundárias, com o mesmo estilo de botão já existente hoje.

Isso é uma decisão local desta feature (reorganização de uma única página), não estabelece um padrão novo de interação.

---

**Estados a Cobrir**

| Estado | Descrição | Observação |
|---|---|---|
| **Carregando** | Enquanto a soma de receitas/despesas do mês é buscada | Seguir padrão narrativo curto já usado no sistema (ver Copy) |
| **Sucesso — saldo positivo** | Receita > Despesa | Barra pende para o lado verde; frase "sobra" |
| **Sucesso — saldo negativo** | Despesa > Receita | Barra pende para o lado vermelho/âmbar; frase "falta" — tom cuidadoso, sem alarme (ver Copy) |
| **Sucesso — saldo equilibrado** | Receita = Despesa, ambos > 0 | Barra com as duas metades iguais; frase neutra |
| **Vazio — sem lançamentos no mês** | Receita = 0 e Despesa = 0, porque o usuário ainda não lançou nada este mês | **Não deve reutilizar a mensagem de "equilibrado"** — tecnicamente os critérios de aceite do PM cobrem 0=0 como "equilibradas", mas isso pode confundir um usuário que simplesmente ainda não usou o sistema neste mês, fazendo-o achar que "está tudo certo" quando na verdade não há dado nenhum. Proponho um estado visualmente distinto (ver Copy). *Sinalizo esta distinção como um ponto a confirmar com o PM — ver "Pontos que Exigem Outro Especialista" abaixo, pois toca a interpretação de um critério de aceite já definido.* |
| **Erro** | Falha ao buscar os dados (ex.: falha de rede) | O sistema hoje trata isso de forma inconsistente entre telas — `faturas/page.tsx` falha silenciosamente (`console.error`, sem UI visível ao usuário), enquanto `contas/page.tsx` e `lancamentos/page.tsx` mostram mensagem inline. Para o Resumo Mensal, que é a primeira coisa que o usuário vê ao abrir o sistema, uma falha silenciosa seria pior do que em qualquer outra tela — o usuário nem saberia que o dado está ausente. Recomendo seguir o padrão de `contas`/`lancamentos` (mensagem visível), não o de `faturas`. |

---

**Copy / Microcopy Sugerido**

*Frase de saldo (Pergunta 2 — destaque visual e texto)*

- **Positivo**: "Sobram R$ [valor] este mês para gastar" — em destaque grande, tom emerald, seguindo o padrão de valor grande em negrito já usado em `faturas/page.tsx` (`text-2xl font-mono font-black`), mas com a cor trocada para `emerald-400` em vez de `#9D4EDD`, para reforçar semanticamente "positivo" de forma consistente com o resto do sistema.
- **Negativo**: "Faltam R$ [valor] este mês para fechar as contas" — tom âmbar (não vermelho). Justificativa: no sistema, vermelho já está associado a "despesa" como categoria de dado; usar vermelho aqui misturaria "despesa" com "alerta de saldo", dois conceitos diferentes. Âmbar já é usado no sistema para "atenção/pendente" (badge `ABERTA` em faturas, bloqueio de edição em contas) e comunica cuidado sem soar como falha ou julgamento — relevante dado que os usuários iniciais do produto são descritos em `00_context.md` como um casal neurodivergente, o que reforça (não introduz) a necessidade de um tom não-alarmista.
- **Equilibrado**: "Suas receitas e despesas se equilibraram este mês" — tom neutro, cor `#9D4EDD` (marca) em vez de emerald ou âmbar, para não sinalizar nem "bom" nem "ruim", apenas um fato.
- **Vazio (sem lançamentos no mês)**: "Você ainda não registrou nenhum lançamento este mês" — seguindo o padrão de estado vazio de `faturas/page.tsx` ("Nenhum cartão cadastrado no sistema ainda"), com ícone neutro (ex.: `AlertCircle` em `slate-600`) em vez de qualquer cor semântica de saldo.

*Rótulos dos totais (para a Usuária A, leitura direta sem depender da frase)*

- "RECEITAS DO MÊS" / "DESPESAS DO MÊS" — label em caixa alta pequena, seguindo o padrão `text-xs font-bold uppercase text-slate-500` já usado em toda a interface (ex.: `faturas/page.tsx`, "Total Consolidado").

*Nota de transparência sobre a composição da despesa*

Como os critérios de aceite do PM definem que a despesa do mês inclui parcelas de cartão independentemente de status (pago/pendente), recomendo uma legenda estática pequena, sempre visível, abaixo do valor de despesa: **"Inclui compras já pagas e parcelas ainda não pagas"**. Escolho uma legenda estática — e não um ícone de informação com tooltip ao passar o mouse — porque o sistema não usa tooltips em nenhum outro lugar hoje; introduzir esse padrão de interação só para esta legenda seria desproporcional (ver "Padrão de Interação Mais Amplo Identificado" abaixo, onde trato separadamente a questão maior de visualização de dados). Uma legenda sempre visível resolve a necessidade de transparência sem depender de um padrão de interação novo.

*Estado de carregamento*

"Calculando o resumo do mês..." — seguindo o tom narrativo curto já em uso (`Buscando histórico...`, `Separando parcelas...`).

*Estado de erro*

"Não foi possível calcular o resumo deste mês agora." — tom direto, sem emoji de alarme (diferente do `❌` usado em mensagens de ação do usuário, que aqui poderia soar como se o *usuário* tivesse errado algo, quando na verdade é uma falha do sistema ao carregar).

---

**Pontos que Exigem Outro Especialista**

- **Gerente do Produto**: confirmar se a distinção entre "estado vazio (sem lançamentos no mês)" e "estado equilibrado (receita = despesa > 0)" deve de fato ter mensagens diferentes, como proponho, ou se o critério de aceite original ("quando receita e despesa são iguais, indicar equilíbrio") deve se aplicar literalmente também ao caso 0=0. Não decidi isso sozinho porque toca a interpretação de um critério de aceite já definido.
- **Arquiteto Responsável / Desenvolvedor**: a substituição dos donuts concêntricos por uma barra comparativa (Opções A ou B) não exige nenhuma biblioteca de gráficos — pode ser construída com elementos simples (`div`s com `width` proporcional, ou SVG básico), sem novas dependências. Isso é diferente de manter a proposta original de donuts, que normalmente pede uma biblioteca de charting (nenhuma está presente em `package.json` hoje). Se a decisão final for manter donuts, peço avaliação técnica de qual biblioteca introduzir — isso está fora do meu escopo.

---

**Questões em Aberto**

- Não há, no Project Knowledge disponível, nenhum exemplo anterior de "barra divergente" ou visualização comparativa no sistema — a Opção B (recomendada) seria, portanto, uma metáfora visual sem precedente direto no produto. Não tenho como validar com dados reais se ela é intuitiva para o Usuário B na primeira visualização; isso seria idealmente confirmado com teste de usuário fora do escopo desta missão.
- Não sei se o Project Knowledge está sincronizado com a versão mais recente de `src/app/page.tsx` — se a Laura já tiver alterado esse arquivo desde a última sincronização, a proposta de "substituir o card placeholder" pode não corresponder ao estado real do arquivo. Vale confirmar antes da implementação.

---

## Padrão de Interação Mais Amplo Identificado

**O que esta feature precisa, no mínimo, para funcionar bem:**
Uma representação visual simples (barra comparativa, conforme recomendado acima) construída com elementos básicos (CSS/SVG), sem depender de nenhuma biblioteca de gráficos — resolvendo apenas a necessidade pontual de F04.

**O padrão mais amplo que essa necessidade expõe:**
Esta é a **primeira feature do sistema inteiro a introduzir qualquer forma de visualização gráfica de dados** — hoje o sistema é inteiramente numérico e textual (números, badges, listas). O próprio PM já indica que F04 é "a primeira fatia entregável do dashboard", com F04.2 e F04.3 previstos como desdobramentos futuros. Isso expõe uma pergunta que esta feature isolada não deveria responder sozinha: o sistema vai continuar resolvendo visualização de dados com elementos simples feitos à mão (divs, SVG básico), ou este é o momento de adotar formalmente uma biblioteca de gráficos (ex.: recharts, chart.js) e definir uma linguagem visual de dashboard consistente para todas as fatias futuras? Hoje não existe nenhuma decisão tomada nesse sentido, e cada nova fatia do dashboard que resolver isso "do seu próprio jeito" corre o risco de o sistema acumular três ou quatro abordagens visuais diferentes para o mesmo tipo de problema (agregação + visualização), na mesma tela.

**Duas rotas possíveis para não travar a feature agora:**
1. **Resolver localmente**: implementar a barra comparativa de F04 com elementos simples (CSS/SVG), sem biblioteca nova, registrando explicitamente que essa é uma solução pontual — não uma validação de que todas as visualizações futuras do dashboard (F04.2, F04.3, orçamento, gráficos históricos) devem seguir o mesmo caminho artesanal.
2. **Pausar** a decisão sobre a linguagem visual do dashboard como um todo, discutindo com o Arquiteto se vale a pena introduzir uma biblioteca de charting antes de seguir adicionando fatias, para evitar retrabalho quando visualizações mais complexas (ex.: gráfico de linha comparando meses) forem necessárias.

**Minha recomendação**: Rota 1, pelo mesmo raciocínio de proporcionalidade que o Arquiteto já aplicou na decisão de agregação (Pergunta 1 do Complemento Técnico) — o escopo desta fatia é deliberadamente pequeno (uma barra com dois valores), não justifica introduzir uma dependência nova, e uma barra simples é implementável sem biblioteca. Ainda assim, sinalizo explicitamente que essa recomendação vale só para F04: se F04.2/F04.3 exigirem visualizações mais ricas (séries temporais, comparação entre meses), a decisão sobre biblioteca de charting deveria ser revisitada com o Arquiteto naquele momento, e não assumida como já resolvida por este precedente. A decisão final sobre qual rota seguir cabe à Laura.

---

# F04 - Resumo da Implementação - Desenvolvedor

Implementação da feature **F04 — Resumo Visual Mensal: Receitas x Despesas**. O placeholder estático de `src/app/page.tsx` foi substituído por um resumo real: totais de receita/despesa do mês atual (somados a partir de `transacoes`, filtrando por `data_competencia`), uma barra comparativa divergente (sem biblioteca de gráficos), e uma frase de saldo em linguagem simples, cobrindo os cinco estados especificados pelo UX (carregando, sucesso positivo/negativo/equilibrado, vazio, erro). Os atalhos rápidos existentes (`Ver Lançamentos`, `Gerenciar Contas`) foram mantidos como ações secundárias abaixo do resumo.

---

## Arquivos Afetados

| Arquivo | Tipo de mudança |
|---|---|
| `src/app/page.tsx` | Alterado (substituição integral do conteúdo) |

Nenhuma mudança de schema, nenhum arquivo novo, nenhuma dependência nova.

---

## Ordem de Aplicação

Único arquivo alterado — não há dependência de ordem. Basta substituir o conteúdo de `src/app/page.tsx` pelo arquivo abaixo.

---

## Checklist de Verificação Manual

- [ ] **Totais**: cadastrar receitas/despesas de teste (via `/lancamentos`) com `data_competencia` no mês atual e conferir manualmente (somando na mão ou no Supabase Studio) que `RECEITAS DO MÊS` e `DESPESAS DO MÊS` batem exatamente.
- [ ] **Estado vazio**: com um usuário/mês sem nenhum lançamento, confirmar que aparece "Você ainda não registrou nenhum lançamento este mês" — e **não** a frase de equilíbrio.
- [ ] **Estado equilibrado**: lançar receita e despesa de valores idênticos no mês e confirmar a frase "Suas receitas e despesas se equilibraram este mês" (cor roxa/marca) e a barra com as duas metades visualmente iguais.
- [ ] **Estado positivo**: receita > despesa — confirmar frase "Sobram R$ X..." em emerald e barra pendendo para o lado verde.
- [ ] **Estado negativo**: despesa > receita — confirmar frase "Faltam R$ X..." em âmbar (não vermelho) e barra pendendo para o lado vermelho.
- [ ] **Inclusão de parcelas pendentes**: lançar uma despesa parcelada no cartão com parcela cuja fatura vence no mês atual e confirmar que ela entra na soma de despesas mesmo com status `pendente` — critério de aceite explícito, sem filtro de status na v1.
- [ ] **Legenda de transparência**: confirmar que "Inclui compras já pagas e parcelas ainda não pagas" aparece sempre, em qualquer estado de sucesso, não apenas quando há despesa parcelada.
- [ ] **Erro visível**: simular falha de rede/RLS temporariamente e confirmar que a mensagem de erro aparece na tela (não apenas no console, diferente do comportamento hoje em `faturas/page.tsx`).
- [ ] **Virada de mês**: se possível, testar próximo à virada do mês (ex.: 31 às 23h) — o Arquiteto já sinalizou o risco herdado de `toISOString()`/fuso horário; não é um bug novo desta feature, mas vale confirmar comportamento aceitável.
- [ ] **Layout mobile**: verificar que a grade de totais empilha em 1 coluna em telas pequenas e que a barra/frase não estouram a largura.
- [ ] **Atalhos**: confirmar que "Ver Lançamentos" e "Gerenciar Contas" continuam navegando corretamente para `/lancamentos` e `/contas`.
- [ ] **Volume alto de transações**: não é esperado no uso atual, mas vale ter em mente o teto `max_rows = 1000` do Supabase (sinalizado pelo Arquiteto) caso um mês algum dia se aproxime desse volume — sem ação necessária agora.

---

## Decisão Mais Ampla Identificada

Não aplicável nesta entrega. As duas decisões mais amplas já haviam sido identificadas e resolvidas antecipadamente pela Laura antes desta implementação (rota local, sem biblioteca de charting, sem camada de agregação nova) — não introduzi nenhum padrão técnico novo além do que já estava autorizado.

---

## Sugestão de Status

Sugiro atualizar o Status de F04 no backlog de **"Definida"** para **"Em Desenvolvimento"**. A confirmação final para "Concluída" cabe à Laura, após rodar o app de verdade e validar os itens do checklist acima — em especial a leitura da barra divergente pelo Usuário B, que a própria Laura definiu como validação pendente com dados reais.

---

## Questões em Aberto

- Herdadas do Complemento Técnico do Arquiteto, sem solução no meu escopo:
  - Não há confirmação de que `max_rows = 1000` de `supabase/config.toml` (config local/CLI) reflete exatamente o projeto Supabase hospedado em produção.
  - O risco de fuso horário/UTC na virada do mês (`new Date()` no cliente) é herdado do padrão já existente no sistema, não introduzido por esta feature — mas passa a valer também para o "mês atual" do resumo, não só para o campo de data de `lancamentos`.
- Nova, desta implementação: não há, hoje, nenhuma exibição do nome do mês/ano de referência (ex.: "Agosto 2026") na tela — os critérios de aceite não pedem isso explicitamente, e optei por não adicionar escopo não especificado. Se a Laura quiser esse contexto visual, é um ajuste pequeno e posso incluir sob confirmação.