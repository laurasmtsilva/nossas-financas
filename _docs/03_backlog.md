# Backlog do Projeto — Nossas Finanças

> Documento mantido pelo perfil Gerente do Produto. Toda funcionalidade segue o formato fixo de especificação definido no prompt de papel do PM. Fonte de verdade cruzada: `_docs/00_context.md` (filosofia), `_docs/features_implementadas/` (inventário confirmado por código) e o `03_backlog.md` anterior.
>
> **Nota de revisão (desta reconstrução):** o item F06 estava duplicado no backlog anterior (em "Finalizados" e em "Definidos", com texto ligeiramente diferente) — foi consolidado em uma única entrada, coerente com o que o código comprova. Os quatro itens antigos da seção "A DETALHAR" foram convertidos para o formato fixo, com IDs novos (F15–F18). Dois gaps não rastreados anteriormente foram identificados durante esta revisão e adicionados como propostas do PM, claramente sinalizadas como inferência pendente de validação (F21, F22). Ver seção "Observações da Revisão" ao final.

---

> **🔺 Prioridade atual do produto:** `F04` (Resumo Visual Mensal: Receitas x Despesas) é o item de maior prioridade do backlog neste momento, por decisão explícita da Laura. Justificativa de negócio: é a primeira funcionalidade do sistema que devolve uma resposta consolidada em vez de apenas registrar dados — endereça diretamente "Quanto ainda posso gastar este mês?" e "Estamos dentro do orçamento?". Pronta para handoff ao Arquiteto Responsável.

---

## Índice

| ID | Funcionalidade | Status | Complexidade |
|---|---|---|---|
| F02 | Painel de Faturas e Controle de Pagamento | ✅ Concluída | 🟡 Média |
| F06 | Lançamento Inteligente por Copiar/Colar (SMS) | ✅ Concluída | 🟡 Média |
| F07 | Gestão de Cartões de Crédito | ✅ Concluída | 🟡 Média |
| F10 | Navegação Principal | ✅ Concluída | 🟢 Baixa |
| F11 | Autenticação e Controle de Acesso | ✅ Concluída | 🟡 Média |
| F12 | Ícone do Aplicativo | ✅ Concluída | 🟢 Baixa |
| F13 | Layout Responsivo para Mobile | ✅ Concluída | 🟡 Média |
| **F04** | **Resumo Visual Mensal: Receitas x Despesas** | **Definida — 🔺 Prioridade Máxima** | 🟡 Média |
| F01 | Conciliação Bancária (OFX/PDF) | Definida | 🔴 Alta |
| F03 | Despesas Recorrentes | Definida | 🟡 Média |
| F05 | Detalhamento de Salário (Holerite) | A Detalhar | 🟢 Baixa |
| F04.1 | Filtro de Status no Resumo Mensal (dependente de F04) | A Detalhar | 🟢 Baixa |
| F04.2 | Filtro PF/PJ no Resumo Mensal (dependente de F04) | A Detalhar | 🟢 Baixa |
| F08 | Filtros Avançados e Paginação no Extrato | Definida | 🟡 Média |
| F09 | Transferências Internas entre Contas | Definida | 🟡 Média |
| F14 | Máscara Monetária no Input | Definida | 🟡 Média |
| F15 | Estado Inativo para Contas e Cartões | A Detalhar | 🟡 Média |
| F16 | Débito Automático da Conta ao Pagar Fatura | A Detalhar | 🟡 Média |
| F17 | Tema Claro/Escuro | A Detalhar | — (validação de necessidade pendente) |
| F18 | Notificações do Sistema | A Detalhar | — (proposta a ser desmembrada, ver nota) |
| F21 | Aviso de Impacto ao Excluir Categoria | A Detalhar (proposta do PM) | 🟢 Baixa |
| F22 | Edição de Categoria Existente | A Detalhar (proposta do PM) | 🟢 Baixa |

---

## FUNCIONALIDADES CONCLUÍDAS

### `F02` — Painel de Faturas e Controle de Pagamento

**Motivação / Problema**
O usuário paga compras parceladas no cartão e precisa saber quanto deve em cada fatura mensal, e sinalizar quando uma fatura foi paga. Conecta-se diretamente com "Quanto ainda posso gastar este mês?" e "Estamos dentro do orçamento?".

**User Story**
- Como Usuária A, eu quero ver o extrato consolidado de cada fatura do meu cartão, para que eu saiba exatamente quanto vou pagar naquele mês.
- Como Usuário B, eu quero marcar uma fatura como paga com um clique simples, para que eu não precise entender detalhes técnicos de cada transação individual.

**Critérios de Aceite**
- [x] Ao selecionar um cartão, suas faturas aparecem ordenadas da mais recente para a mais antiga.
- [x] Ao selecionar uma fatura, o sistema exibe todas as compras/parcelas vinculadas, com valor, categoria, quem lançou e data da compra original.
- [x] O sistema exibe o valor total consolidado da fatura selecionada.
- [x] É possível alternar o status da fatura entre "Aberta" e "Paga" com uma ação.
- [x] Ao marcar como paga, todas as transações vinculadas àquela fatura mudam de status automaticamente.

**Impacto por Persona**
- Usuária A: consegue auditar item a item o que compõe a fatura.
- Usuário B: só precisa entender "paguei" ou "não paguei" — não precisa entender parcelas ou categorias para usar a função principal.

**Complexidade**
🟡 Média (herdada do backlog anterior; não há registro de reavaliação técnica formal pelo Arquiteto nesta revisão).

**Pré-requisitos**
Lançamentos com parcelas ativos (ver histórico do parcelamento no cartão).

**Status**
✅ Concluída — confirmado por `painel_de_faturas.md` e `controle_de_pagamento_de_fatura.md`.

**Pontos que Exigem Outro Especialista**
Nenhum pendente — funcionalidade já construída e confirmada no código.

---

### `F06` — Lançamento Inteligente por Copiar/Colar (SMS)

**Motivação / Problema**
Digitar manualmente cada compra é uma fricção que desencoraja o registro consistente de gastos. Apoia indiretamente "Posso fazer esta compra?", ao reduzir o esforço de registrar rapidamente uma compra recém-feita.

**User Story**
Como Usuária A ou Usuário B, eu quero colar o texto de um SMS de notificação de compra, para que o sistema preencha automaticamente valor, data e descrição, sem eu precisar digitar tudo de novo.

**Critérios de Aceite**
- [x] O sistema lê o texto da área de transferência do dispositivo ao acionar o botão "Colar SMS".
- [x] O sistema extrai valor, data (padrão DD/MM) e descrição do texto colado, quando o texto segue um formato reconhecível.
- [x] Os campos extraídos preenchem automaticamente o formulário de lançamento.
- [x] Se a leitura da área de transferência falhar, o sistema exibe uma mensagem de erro sem quebrar o formulário.

**Impacto por Persona**
- Usuária A: economiza tempo em registro de rotina.
- Usuário B: reduz a chance de erro de digitação, mas precisa entender que o preenchimento é uma sugestão a ser conferida, não uma garantia.

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Formulário de lançamentos robusto (já existente).

**Status**
✅ Concluída — confirmado por `preenchimento_automatico_via_sms.md`. **Correção de backlog:** este item estava duplicado na versão anterior (também listado como "A Fazer" na seção "Definidos", com o texto "Lançamento Inteligente por Copiar/Copiar"). O código confirma que a funcionalidade existe e funciona; a entrada duplicada foi removida nesta revisão.

**Pontos que Exigem Outro Especialista**
Nenhum pendente para o que já está construído. Uma limitação observada (o parser não identifica parcelamento mesmo quando o SMS menciona "em X vezes") é um gap conhecido, não uma pendência de especificação — se vier a ser priorizado, será um novo item de backlog, não uma correção deste.

---

### `F07` — Gestão de Cartões de Crédito

**Motivação / Problema**
Sem cadastro dos cartões (limite, datas de fechamento/vencimento), nenhuma outra funcionalidade de cartão (parcelamento, faturas) tem como funcionar. Base de dados para "Qual cartão é mais adequado para esta compra?", embora o sistema não compare cartões nem recomende nada ainda.

**User Story**
Como Usuária A, eu quero cadastrar meus cartões de crédito com limite, dia de fechamento e vencimento, para que o sistema calcule corretamente em qual fatura cada compra parcelada deve entrar.

**Critérios de Aceite**
- [x] É possível cadastrar um cartão com nome, limite, dia de fechamento, dia de vencimento e conta padrão de pagamento.
- [x] É possível editar um cartão já cadastrado.
- [x] O dia de fechamento e o dia de vencimento são restritos a valores entre 1 e 31.

**Impacto por Persona**
- Usuária A: consegue manter o cadastro atualizado sem apoio.
- Usuário B: também consegue cadastrar, mas depende de saber onde encontrar "dia de fechamento" e "dia de vencimento" na fatura física/do banco — ponto de possível dúvida, não coberto por explicação na tela (observação, não item de ação automática deste PM).

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Banco de dados estruturado (já existente).

**Status**
✅ Concluída — confirmado por `gestao_de_cartoes_de_credito.md`.

**Pontos que Exigem Outro Especialista**
Nenhum pendente para o que já está construído.

---

### `F10` — Navegação Principal

**Motivação / Problema**
O usuário precisa se mover entre as áreas do sistema (lançamentos, faturas, contas, cartões, categorias) de forma previsível. Não se conecta diretamente a nenhuma das cinco perguntas centrais — é infraestrutura de uso, não uma resposta financeira.

**User Story**
Como Usuária A ou Usuário B, eu quero acessar qualquer área do sistema a partir de um menu consistente, para que eu não me perca dentro do aplicativo.

**Critérios de Aceite**
- [x] Existe um menu com links para todas as áreas principais do sistema, visível em todas as páginas autenticadas.
- [x] O menu tem uma versão adaptada para tela de celular (retrátil).
- [x] Existe opção de sair da conta a partir do menu.

**Impacto por Persona**
Impacto equivalente para as duas personas — é navegação estrutural, não depende de conhecimento financeiro.

**Complexidade**
🟢 Baixa (herdada).

**Pré-requisitos**
Nenhum.

**Status**
✅ Concluída — confirmado por observação direta de `src/components/Navbar.tsx`. Não há documento correspondente em `_docs/features_implementadas/` (o catálogo daquela missão focou em capacidades de negócio, não em componentes de navegação), o que é coerente — este item é de infraestrutura de interface.

**Pontos que Exigem Outro Especialista**
Nenhum pendente.

---

### `F11` — Autenticação e Controle de Acesso

**Motivação / Problema**
O sistema lida com dados financeiros familiares sensíveis; sem controle de acesso, qualquer pessoa poderia ver ou alterar esses dados. Não se conecta diretamente às cinco perguntas centrais — é pré-requisito de segurança para todo o resto.

**User Story**
Como Usuária A ou Usuário B, eu quero criar uma conta, entrar, e ser automaticamente impedido de acessar o sistema sem estar logado, para que meus dados financeiros fiquem protegidos.

**Critérios de Aceite**
- [x] É possível criar uma conta com e-mail e senha.
- [x] É possível entrar com e-mail e senha já cadastrados.
- [x] É possível encerrar a sessão a partir de qualquer página.
- [x] Qualquer tentativa de acessar uma página sem estar autenticado redireciona para a tela de login.
- [x] Um usuário já autenticado que tente acessar a tela de login é redirecionado para a página inicial.

**Impacto por Persona**
Impacto equivalente para as duas personas.

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Middleware e SSR configurados (já existente).

**Status**
✅ Concluída — confirmado por quatro documentos: `criacao_de_conta.md`, `acesso_a_conta_login.md`, `encerramento_de_sessao_logout.md`, `redirecionamento_automatico_por_autenticacao.md`.

**Pontos que Exigem Outro Especialista**
Uma limitação observada no código é relevante para negócio, mas não é decisão minha resolver como: **não existe qualquer isolamento de dados entre usuários autenticados diferentes** (qualquer conta logada acessa os dados de qualquer outra família). Isso não é uma falha de UX nem uma nova feature — é uma questão de arquitetura de segurança. **Pergunta para o Arquiteto Responsável:** o modelo atual assume implicitamente "uma instância do sistema por família"? Se o produto pretende, no futuro, suportar múltiplas famílias na mesma instância, este é um risco estrutural que precisa ser avaliado antes de qualquer expansão de usuários — não é algo que o PM deva silenciosamente ignorar.

---

### `F12` — Ícone do Aplicativo

**Motivação / Problema**
Facilita o reconhecimento visual e o acesso rápido ao aplicativo a partir da tela inicial do celular. Não se conecta a nenhuma das cinco perguntas centrais.

**User Story**
Como Usuária A ou Usuário B, eu quero que o aplicativo tenha um ícone reconhecível quando adicionado à tela inicial do celular, para que eu o encontre com facilidade entre os demais aplicativos.

**Critérios de Aceite**
- [x] Existe um ícone definido para o aplicativo, usado como favicon e como ícone para dispositivos Apple.
- [ ] *(não confirmado)* O aplicativo se comporta como PWA instalável (com manifest e funcionamento offline).

**Impacto por Persona**
Impacto equivalente para as duas personas.

**Complexidade**
🟢 Baixa (herdada).

**Pré-requisitos**
Imagem em `public/icon.png` (já existente).

**Status**
✅ Concluída **quanto ao ícone**, mas com uma ressalva de nomenclatura. O nome do item no backlog anterior ("Ícone do App (PWA / Mobile)") sugere um comportamento de PWA completo, mas não encontrei `manifest.json` nem service worker no Project Knowledge — apenas metadados de ícone e `appleWebApp.capable` em `layout.tsx`.

**Pontos que Exigem Outro Especialista**
**Pergunta para o Arquiteto Responsável:** o sistema hoje se qualifica como PWA instalável (manifest + service worker), ou apenas como um ícone de atalho para navegador? Isso muda a expectativa que devo comunicar como PM sobre o que este item realmente entrega — não vou renomear ou reclassificar o item sem essa confirmação técnica.

---

### `F13` — Layout Responsivo para Mobile

**Motivação / Problema**
As duas personas usam o sistema no dia a dia, provavelmente incluindo o celular; uma interface que não funciona bem em telas pequenas aumenta a carga cognitiva e a fricção de uso — na contramão direta da filosofia do produto.

**User Story**
Como Usuária A ou Usuário B, eu quero usar o sistema no celular com a mesma clareza que no computador, para que eu possa registrar e consultar informações financeiras em qualquer lugar.

**Critérios de Aceite**
- [x] As telas principais se adaptam a larguras pequenas de tela (uso extensivo de breakpoints responsivos observado em todas as páginas).
- [x] A meta tag de viewport está configurada para adaptação correta em dispositivos móveis.

**Impacto por Persona**
Impacto equivalente para as duas personas.

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Meta-tags e CSS responsivo (já existente).

**Status**
✅ Concluída — confirmado por observação direta do código (classes responsivas presentes em todas as páginas de domínio).

**Pontos que Exigem Outro Especialista**
Nenhum pendente do ponto de vista de negócio. Qualidade visual/de usabilidade específica do layout mobile é escopo do UX Designer, não deste documento.

---

## FUNCIONALIDADES DEFINIDAS (AINDA NÃO CONSTRUÍDAS)

### `F01` — Conciliação Bancária (OFX/PDF)

**Motivação / Problema**
Hoje todo lançamento é digitado manualmente ou colado via SMS individual. Para famílias com volume real de movimentação bancária, isso é uma fonte de erro e de abandono do hábito de registro — o que compromete diretamente "Quanto dinheiro realmente temos disponível?", já que o sistema só é confiável se os dados nele estiverem completos.

**User Story**
Como Usuária A, eu quero importar um extrato bancário (OFX ou PDF) e ter as transações reconhecidas automaticamente, para que eu não precise lançar manualmente dezenas de movimentações após o fechamento do mês.

**Critérios de Aceite**
*(A Detalhar — os critérios abaixo são um ponto de partida, não uma especificação fechada)*
- [ ] O usuário consegue enviar um arquivo OFX e/ou PDF de extrato bancário.
- [ ] O sistema identifica e propõe lançamentos a partir do conteúdo do arquivo.
- [ ] O usuário revisa e confirma (ou descarta) cada lançamento proposto antes de gravá-lo — nenhum lançamento é criado sem confirmação humana, para evitar duplicidade silenciosa.
- [ ] O sistema evita ou sinaliza duplicidade quando um lançamento já registrado manualmente coincide com um item do extrato importado.

**Impacto por Persona**
- Usuária A: reduz fortemente o esforço de manutenção de dados, mas exige que ela confie no reconhecimento automático — precisa de um passo de revisão claro.
- Usuário B: **risco de complexidade elevado**. Conciliação bancária é um conceito potencialmente confuso para quem tem conhecimento financeiro básico; a interface de revisão precisa ser desenhada para não exigir entendimento de termos como "conciliação", "duplicidade" ou "extrato OFX".

**Complexidade**
🔴 Alta (herdada do backlog anterior; compatível com a natureza do problema — leitura de formatos de arquivo variados e lógica de correspondência/duplicidade).

**Pré-requisitos**
Ajustar tipos de conta / lançamentos (conforme já registrado no backlog anterior — não sei precisar hoje qual ajuste específico é esse; **pergunta para o Arquiteto Responsável**: esse pré-requisito ainda é válido frente ao schema atual, ou já foi endereçado?).

**Status**
Definida (motivação e critérios de alto nível existem; especificação fina ainda pendente).

**Pontos que Exigem Outro Especialista**
- **Arquiteto Responsável:** viabilidade e desenho de como armazenar/processar arquivos importados, e como implementar a lógica de detecção de duplicidade sem comprometer a ausência atual de camada de API.
- **UX Designer:** como desenhar o fluxo de revisão de lançamentos importados de forma que a Usuária A tenha eficiência (revisão em lote) e o Usuário B tenha segurança (não lançar nada errado por engano).

---

### `F03` — Despesas Recorrentes

**Motivação / Problema**
Gastos fixos mensais (aluguel, assinaturas, mensalidades) hoje precisam ser lançados manualmente todo mês. Isso é fricção repetitiva e risco de esquecimento, o que compromete "Quanto ainda posso gastar este mês?" caso o usuário esqueça de lançar um gasto fixo já sabido.

**User Story**
Como Usuária A, eu quero cadastrar uma despesa recorrente uma única vez, para que o sistema me ajude a não esquecer de registrá-la todo mês.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O usuário consegue cadastrar uma despesa com frequência (semanal, mensal, anual) e dia de vencimento.
- [ ] O sistema apresenta, de alguma forma, as despesas recorrentes pendentes de lançamento no período atual.
- [ ] Fica definido se o lançamento da parcela recorrente é automático ou depende de confirmação do usuário (decisão de produto ainda em aberto — impacta diretamente a confiança do usuário nos dados, então não deve ser assumida silenciosamente).

**Impacto por Persona**
- Usuária A: ganho de eficiência claro.
- Usuário B: precisa entender a diferença entre "já foi lançado automaticamente" e "ainda preciso confirmar" — se essa distinção não for clara, pode gerar desconfiança nos números do sistema (na contramão do princípio de Transparência do produto).

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Categorias e contas prontas (já existente). **Observação de arquitetura:** a tabela `recorrencias` já existe no schema do banco, mas não há nenhuma leitura ou escrita observada no código hoje — ou seja, a estrutura de dados já foi pensada, mas a funcionalidade não foi construída. Isso é uma informação relevante de priorização (parte da fundação já existe), não uma conclusão sobre pronto para uso.

**Status**
Definida.

**Pontos que Exigem Outro Especialista**
- **Arquiteto Responsável:** a tabela `recorrencias` existente no schema atende ao que será necessário, ou precisa de ajustes?
- **UX Designer:** como comunicar de forma simples a diferença entre "lançamento automático" e "lançamento pendente de confirmação", se essa for a decisão de produto adotada.

---

### `F04` — Resumo Visual Mensal: Receitas x Despesas (primeira fatia do Dashboard)

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
Definida — pronta para avaliação do Arquiteto Responsável e, em seguida, do UX Designer.

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

### `F04.1` — Filtro de Status no Resumo Mensal (Planejado vs. Fluxo de Caixa)

**Motivação / Problema**
Na primeira versão (F04), todo valor previsto para o mês conta, pago ou não. A Laura identificou que, em um segundo momento, é útil alternar entre "visão geral do mês" (tudo que está planejado, pago ou não) e "visão de fluxo de caixa real" (somente o que já foi efetivamente pago/recebido). São duas perguntas de negócio diferentes, ambas válidas: a primeira ajuda a planejar ("Estamos dentro do orçamento?"), a segunda ajuda a saber a posição real de caixa ("Quanto dinheiro realmente temos disponível?").

**User Story**
Como Usuária A, eu quero alternar entre ver tudo que está planejado para o mês e ver somente o que já foi pago ou recebido de fato, para que eu consiga tanto planejar quanto conferir minha posição real de caixa.

**Critérios de Aceite**
*(A Detalhar em uma próxima rodada — não deve bloquear o desenvolvimento de F04)*
- [ ] Existe um controle que alterna a base de cálculo do resumo mensal entre "tudo" (comportamento atual do F04) e "somente pago/recebido" (`status = 'pago'` em `transacoes`, e critério equivalente a definir para `lancamentos` de receita).
- [ ] Fica claro para o usuário, a qualquer momento, qual dos dois modos está ativo.

**Impacto por Persona**
Usuária A é a principal usuária deste filtro (uso mais analítico); para o Usuário B, o modo padrão ("tudo") provavelmente deve continuar sendo o mais simples e visível, com o filtro como uma opção secundária, não o comportamento de entrada.

**Complexidade**
🟢 Baixa (estimativa de negócio, assumindo que a estrutura de agregação de F04 já existir).

**Pré-requisitos**
F04 (deve ser construído primeiro).

**Status**
A Detalhar — explicitamente não bloqueia F04.

**Pontos que Exigem Outro Especialista**
**UX Designer:** onde e como apresentar essa alternância sem adicionar complexidade visual à tela para o Usuário B.

---

### `F04.2` — Filtro PF/PJ no Resumo Mensal

**Motivação / Problema**
Na primeira versão (F04), a visão soma tudo (PF + PJ) junto. A Laura sinalizou que pode ser relevante, no futuro, segmentar essa visão por tipo de pessoa — o sistema já rastreia esse dado em cada lançamento (`tipo_pessoa`).

**User Story**
Como Usuária A, eu quero poder ver o resumo mensal filtrado só por movimentações PF ou só PJ, para que eu consiga separar a análise financeira pessoal da análise financeira da empresa quando for útil.

**Critérios de Aceite**
*(A Detalhar em uma próxima rodada — não deve bloquear o desenvolvimento de F04)*
- [ ] Existe um filtro que restringe o cálculo do resumo mensal a `tipo_pessoa = 'PF'`, `'PJ'`, ou ambos (comportamento padrão de F04).

**Impacto por Persona**
Impacto equivalente entre as personas, mas uso provavelmente mais frequente pela Usuária A dado o contexto de PJ mencionado no cadastro do produto.

**Complexidade**
🟢 Baixa (estimativa de negócio — o campo `tipo_pessoa` já existe em `lancamentos`; a mesma informação precisaria estar acessível a partir de `transacoes` para o cálculo de despesas, o que depende de confirmação do Arquiteto).

**Pré-requisitos**
F04 (deve ser construído primeiro).

**Status**
A Detalhar — explicitamente não bloqueia F04. Conforme sua própria observação, se a complexidade se mostrar alta, este item pode ser adiado sem prejuízo à entrega do resumo mensal básico.

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** confirmar se `transacoes` carrega (direta ou indiretamente, via `lancamento_id`) a informação de `tipo_pessoa` necessária para este filtro funcionar também sobre despesas de cartão.

---

### `F08` — Filtros Avançados e Paginação no Extrato

**Motivação / Problema**
A lista de lançamentos hoje mostra sempre e apenas os 15 mais recentes, sem filtro nem forma de ver o histórico completo. Isso limita a capacidade do usuário de responder "Estamos dentro do orçamento?" olhando para um período específico (ex: o mês passado inteiro).

**User Story**
Como Usuária A, eu quero filtrar e paginar meu histórico de lançamentos, para que eu consiga analisar períodos específicos sem depender apenas dos itens mais recentes.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O usuário consegue ver lançamentos além dos 15 mais recentes.
- [ ] O usuário consegue filtrar por pelo menos um critério relevante (a definir: período, categoria, conta, cartão).

**Impacto por Persona**
- Usuária A: uso ativo esperado, provavelmente com múltiplos filtros combinados.
- Usuário B: **risco de complexidade** — filtros avançados podem intimidar; talvez baste, para esta persona, um filtro simples de "mês atual / mês passado". Esta divergência de necessidade entre personas deve ser considerada explicitamente na especificação de UX, não resolvida com uma única interface genérica.

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Tela de lançamentos funcional (já existente).

**Status**
Definida.

**Pontos que Exigem Outro Especialista**
**UX Designer:** definir se a mesma interface de filtro atende as duas personas ou se é necessário simplificar a experiência para o Usuário B (ex: atalhos pré-definidos como "este mês" vs. um construtor de filtro livre).

---

### `F09` — Transferências Internas entre Contas

**Motivação / Problema**
Hoje, mover dinheiro entre duas contas bancárias da própria família (ex: da conta corrente para a poupança) não tem um fluxo dedicado — provavelmente exigiria lançar uma despesa em uma conta e uma receita em outra manualmente, o que é passível de erro e polui o histórico com lançamentos artificiais. Conecta-se com "Quanto dinheiro realmente temos disponível?", pois transferências mal registradas distorcem o saldo de cada conta individualmente.

**User Story**
Como Usuária A, eu quero registrar uma transferência entre duas contas da família com uma única ação, para que o saldo de ambas as contas reflita corretamente o dinheiro movimentado, sem depender de lançar dois registros manuais como se fossem receita e despesa separadas.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O usuário escolhe uma conta de origem e uma conta de destino, e um valor.
- [ ] O sistema não classifica a transferência como receita ou despesa "de verdade" (ela não deveria distorcer indicadores de quanto a família ganhou ou gastou no período).

**Impacto por Persona**
Impacto equivalente — ambas as personas se beneficiam de não precisar simular a transferência com dois lançamentos manuais.

**Complexidade**
🟡 Média (herdada).

**Pré-requisitos**
Contas bancárias prontas (já existente).

**Status**
Definida.

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** como uma transferência deve ser modelada de forma a não ser contada como receita/despesa em relatórios futuros (ex: no Dashboard, F04) — esta é uma decisão estrutural que precisa ser resolvida antes de qualquer relatório agregado ser construído, para não exigir retrabalho.

---

### `F14` — Máscara Monetária no Input

**Motivação / Problema**
O campo de valor no formulário de lançamento é um input numérico simples, sem formatação como "R$ 1.234,56" durante a digitação. Isso aumenta o risco de erro de digitação (ex: digitar 150 quando a intenção era 1,50), o que compromete diretamente a confiabilidade dos dados usados para responder qualquer uma das cinco perguntas centrais.

**User Story**
Como Usuário B, eu quero ver o valor sendo formatado como dinheiro enquanto digito, para que eu perceba imediatamente se cometi um erro de digitação antes de salvar.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O campo de valor exibe formatação monetária (separador de milhar e decimal) durante a digitação.
- [ ] O valor final salvo no banco continua sendo um número, sem símbolos de moeda ou separadores.

**Impacto por Persona**
- Usuária A: reduz risco de erro, mas ela já tem familiaridade suficiente para conferir valores mesmo sem máscara.
- Usuário B: **maior beneficiário direto** — para quem tem menos intimidade com o sistema, a confirmação visual imediata do valor digitado é uma proteção real contra erro silencioso.

**Complexidade**
🟡 Média (herdada; nota: tecnicamente costuma ser considerada baixa complexidade em outros contextos — **sinalizo divergência potencial para confirmação do Arquiteto/Desenvolvedor**, já que o rótulo herdado do backlog anterior classifica como Média).

**Pré-requisitos**
Formulário de lançamentos (já existente).

**Status**
Definida.

**Pontos que Exigem Outro Especialista**
Nenhum ponto de negócio pendente — é majoritariamente uma decisão técnica de implementação (Arquiteto/Desenvolvedor) sobre qual abordagem usar para a máscara.

---

## FUNCIONALIDADES A DETALHAR

### `F15` — Estado Inativo para Contas e Cartões

**Motivação / Problema**
Hoje não existe nenhuma forma de excluir (nem desativar) uma conta bancária ou cartão de crédito no sistema — mesmo um cadastrado por engano permanece para sempre na lista. Isso não está ligado diretamente a nenhuma das cinco perguntas centrais, mas fere o princípio de Clareza da filosofia do produto: cadastros obsoletos ou incorretos poluem a experiência e podem gerar escolhas erradas (ex: lançar em um cartão que na verdade não é mais usado).

**User Story**
Como Usuária A, eu quero marcar uma conta ou cartão como inativo em vez de precisar excluí-lo, para que eu limpe minha lista de opções ativas sem perder o histórico de lançamentos já vinculados a ele.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O usuário consegue marcar uma conta ou cartão como "inativo" sem apagar os dados históricos vinculados.
- [ ] Contas/cartões inativos deixam de aparecer como opção em novos lançamentos.
- [ ] Contas/cartões inativos continuam visíveis no histórico de lançamentos e faturas já existentes.
- [ ] Fica definido se é possível reativar uma conta/cartão marcado como inativo.

**Impacto por Persona**
Impacto equivalente — ambas as personas se beneficiam de uma lista de opções mais limpa ao lançar uma nova movimentação.

**Complexidade**
🟡 Média (estimativa de negócio; não sei se é tecnicamente simples ou não — depende de como o Arquiteto avaliar o impacto sobre as consultas existentes).

**Pré-requisitos**
Nenhum funcional; é uma extensão do modelo de dados de contas e cartões já existente.

**Status**
A Detalhar.

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** qual é a forma correta de modelar esse estado (ex: campo booleano `ativo`) e se isso teria impacto em consultas hoje existentes, que atualmente listam todas as contas/cartões sem distinção de status.

---

### `F16` — Débito Automático da Conta ao Pagar Fatura

**Motivação / Problema**
Hoje, marcar uma fatura como "Paga" (F02) apenas muda o status da fatura e das transações — não debita o valor de nenhuma conta bancária, nem registra qual conta pagou ou quando. Isso significa que o saldo exibido em "Gestão de Contas Bancárias" nunca reflete o pagamento de faturas de cartão, o que compromete diretamente "Quanto dinheiro realmente temos disponível?".

**User Story**
Como Usuária A, eu quero que, ao marcar uma fatura como paga, o valor correspondente seja debitado da conta escolhida, para que o saldo da minha conta reflita a realidade sem eu precisar lançar esse débito manualmente em outro lugar.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] Ao marcar uma fatura como paga, o usuário informa (ou confirma) qual conta está pagando aquela fatura.
- [ ] O valor da fatura é refletido no saldo da conta escolhida.
- [ ] As colunas `data_pagamento` e `conta_pagamento_id`, já existentes na tabela `faturas` mas não preenchidas hoje, passam a ser utilizadas.
- [ ] Fica definido o comportamento ao reverter uma fatura de "Paga" para "Aberta" (o débito deve ser desfeito?).

**Impacto por Persona**
- Usuária A: fecha uma lacuna de confiabilidade que ela, com maior conhecimento financeiro, provavelmente já percebe hoje.
- Usuário B: passa a ter um número de saldo mais confiável sem precisar entender por que ele estava "errado" antes.

**Complexidade**
🟡 Média (estimativa de negócio).

**Pré-requisitos**
F02 (já concluída) e existência de conta padrão de pagamento vinculada ao cartão (já existente no cadastro de cartões).

**Status**
A Detalhar.

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** as colunas necessárias (`data_pagamento`, `conta_pagamento_id`) já existem no schema — a pergunta é se a lógica de "debitar" deve gerar um registro de transação normal na conta bancária, ou um mecanismo separado. Isso tem implicação direta sobre como o saldo da conta é calculado (hoje o saldo exibido em "Contas" é apenas o `saldo_inicial` estático — ver F04).

---

### `F17` — Tema Claro/Escuro

**Motivação / Problema**
*(nota do PM, antes de qualquer critério)*: este item precisa de validação antes de virar uma especificação de verdade. A pergunta que preciso fazer é: **este problema é real, ou é apenas uma ideia interessante?** Hoje o sistema usa uma paleta escura fixa (`slate-950`, `#9D4EDD`) em todas as telas, independentemente da preferência do dispositivo — inclusive, `globals.css` já define variáveis de claro/escuro que não são usadas de fato pelas páginas. Isso não está ligado a nenhuma das cinco perguntas centrais, e não tenho, até este momento, um relato de fricção real vindo de uso do produto — apenas o registro histórico do item no backlog anterior.

**User Story**
*(a confirmar após validação da motivação)* Como usuário do sistema, eu quero escolher entre tema claro e escuro, para que a interface se adapte à minha preferência visual ou às condições de luminosidade do ambiente.

**Critérios de Aceite**
Não detalhado — depende da resposta à pergunta de motivação acima.

**Impacto por Persona**
Não avaliado ainda — item de preferência visual, provavelmente de impacto equivalente entre as duas personas, mas isso não substitui a necessidade de confirmar se o problema é real.

**Complexidade**
Não estimada — depende do escopo (ex: alternância manual simples vs. sincronizar com o tema do sistema operacional).

**Pré-requisitos**
Nenhum identificado até o momento.

**Status**
A Detalhar — **recomendo explicitamente que este item não avance para especificação completa antes de uma conversa sobre a motivação real por trás dele.** Se a motivação for confirmada (ex: uso em ambientes muito claros dificulta a leitura), sigo com a especificação completa.

**Pontos que Exigem Outro Especialista**
**UX Designer:** se confirmado como necessidade real, caberá a esse especialista decidir como a alternância deve funcionar (automática por sistema operacional vs. escolha manual) — não é uma decisão deste documento.

---

### `F18` — Notificações do Sistema

**Motivação / Problema**
O item original do backlog agrupava três notificações de natureza muito diferente sob um único rótulo: "atualização de versão", "gastos atingindo % do orçamento" e "lembrete semanal de cadastro". Como PM, preciso sinalizar que **isso não deveria ser um único item** — cada um tem motivação, complexidade e pré-requisitos diferentes. Estou desmembrando abaixo, sem avançar a especificação completa de nenhum deles ainda.

#### F18.1 — Notificação de Atualização de Versão do App
**Motivação:** garantir que o usuário está usando a versão mais recente do sistema. Não se conecta a nenhuma das cinco perguntas centrais — é uma necessidade operacional, não financeira. **Observação do PM:** este é, dos três, o que menos parece alinhado à filosofia central do produto; antes de detalhar, vale perguntar se o valor de negócio justifica a complexidade de implementar um mecanismo de notificação de versão.

#### F18.2 — Alerta de Orçamento (% do limite atingido)
**Motivação:** avisar a família quando os gastos se aproximam de um limite definido. Conecta-se diretamente com "Estamos dentro do orçamento?" — potencialmente o item de maior valor de negócio dos três. **Bloqueio real:** não existe hoje, em nenhum lugar do sistema, o conceito de "orçamento" (nenhuma tabela, nenhuma tela). Este item **depende da existência prévia de uma funcionalidade de definição de orçamento**, que não está em nenhum outro lugar do backlog atual. Antes de detalhar este item, é necessário decidir se "Definir Orçamento" deve ser criado como uma nova funcionalidade própria — não posso especificar um alerta para algo que ainda não existe para ser alertado.

#### F18.3 — Lembrete Semanal de Registro de Lançamentos
**Motivação:** incentivar o hábito de registro consistente, o que sustenta indiretamente a confiabilidade de todas as cinco perguntas centrais (um sistema com dados incompletos não responde nenhuma delas corretamente). É o único dos três com uma motivação comportamental clara e vinculável, ainda que indiretamente, à filosofia do produto.

**Status (dos três)**
A Detalhar — nenhum dos três deve avançar para especificação completa como está hoje; recomendo tratá-los como três itens de backlog separados a partir da próxima revisão, com F18.2 explicitamente bloqueado até a definição de uma funcionalidade de orçamento.

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** viabilidade técnica de qualquer mecanismo de notificação (push, e-mail, in-app) — nenhum canal de notificação foi observado no código atual, então esta pode ser uma capacidade de infraestrutura nova para o sistema.

---

## PROPOSTAS DO PM (gaps identificados nesta revisão, pendentes de validação)

> Os dois itens abaixo não existiam no backlog anterior. Foram identificados por mim durante o cruzamento entre `_docs/features_implementadas/` e a filosofia do produto. São **inferências minhas, não relatos confirmados do usuário** — estou sinalizando explicitamente como tal, e recomendo validação antes de tratá-los como prioridade.

### `F21` — Aviso de Impacto ao Excluir Categoria

**Motivação / Problema**
*(inferência do PM)* `gestao_de_categorias.md` confirma que excluir uma categoria remove em cascata, automaticamente, todos os lançamentos vinculados a ela — e a caixa de confirmação hoje pergunta apenas "Excluir esta categoria?", sem mencionar esse efeito. Isso é uma violação direta do princípio de Transparência do produto ("todo valor apresentado pelo sistema deve poder ser explicado") e representa risco real de perda de dados sem entendimento por parte do usuário — especialmente do Usuário B, que pode não associar "excluir categoria" a "apagar lançamentos".

**User Story**
Como Usuária A ou Usuário B, eu quero ser avisado claramente que excluir uma categoria também vai apagar os lançamentos vinculados a ela, para que eu não perca dados financeiros por engano.

**Critérios de Aceite**
- [ ] A mensagem de confirmação de exclusão de categoria informa explicitamente que lançamentos vinculados também serão apagados.
- [ ] Fica definido se a mensagem deve informar a quantidade de lançamentos afetados antes da confirmação.

**Impacto por Persona**
- Usuária A: reduz risco de exclusão acidental de dados importantes mesmo para quem entende o sistema.
- Usuário B: **beneficiário principal** — sem este aviso, é o mais vulnerável a perder dados sem entender o motivo.

**Complexidade**
🟢 Baixa (estimativa de negócio — parece ser uma mudança de texto/confirmação, mas cabe ao Arquiteto/Desenvolvedor confirmar se buscar a contagem de lançamentos afetados antes de excluir tem custo adicional relevante).

**Pré-requisitos**
Nenhum.

**Status**
A Detalhar (proposta do PM — recomendo priorização alta dado que é um risco de perda de dados, não uma melhoria de conveniência).

**Pontos que Exigem Outro Especialista**
**UX Designer:** desenho da mensagem de confirmação (texto, e se deve incluir contagem de itens afetados).

---

### `F22` — Edição de Categoria Existente

**Motivação / Problema**
*(inferência do PM)* `gestao_de_categorias.md` confirma que hoje só é possível criar e excluir categorias — não há edição de nome, tipo, ícone ou categoria-pai. Um erro de digitação ou uma categoria mal organizada exige exclusão (com o risco descrito em F21) e recriação, em vez de correção simples. Não se conecta diretamente a nenhuma das cinco perguntas centrais, mas fere o princípio de Redução da Carga Cognitiva.

**User Story**
Como Usuária A ou Usuário B, eu quero corrigir o nome, ícone ou categoria-pai de uma categoria já existente, para que eu não precise excluir e recriar uma categoria só para corrigir um erro de digitação.

**Critérios de Aceite**
*(A Detalhar)*
- [ ] O usuário consegue editar nome, ícone e categoria-pai de uma categoria já existente.
- [ ] Fica definido se é possível mudar o tipo (RECEITA/DESPESA) de uma categoria já em uso por lançamentos existentes, dado que isso pode gerar inconsistência nos dados históricos.

**Impacto por Persona**
Impacto equivalente entre as personas.

**Complexidade**
🟢 Baixa (estimativa de negócio).

**Pré-requisitos**
Nenhum.

**Status**
A Detalhar (proposta do PM).

**Pontos que Exigem Outro Especialista**
**Arquiteto Responsável:** qual o comportamento correto ao editar o tipo de uma categoria que já tem lançamentos vinculados — a constraint composta (`parent_id` + `tipo`) hoje existente no schema pode impor restrições a essa mudança.

---

## Observações da Revisão

* **Correção aplicada:** duplicidade do item F06 (presente em "Finalizados" e "Definidos" no backlog anterior) foi resolvida — mantido como um único item concluído.
* **Não corrigido silenciosamente, apenas sinalizado:** nomenclatura de F12 como "PWA" pode não corresponder ao que o código de fato implementa — aguardando confirmação do Arquiteto.
* **Desmembrado, não decidido:** o antigo item único de "Notificações" (F18) foi dividido em três propostas distintas (F18.1, F18.2, F18.3), sendo que F18.2 está estruturalmente bloqueada até a existência de uma funcionalidade própria de definição de orçamento — que hoje não existe em nenhum lugar do sistema ou do backlog.
* **Dois itens novos propostos pelo PM** (F21, F22) nasceram da comparação entre o inventário de features implementadas e a filosofia do produto, não de um pedido direto do usuário — seguem sinalizados como inferência, aguardando validação.
* **Pendência de validação de necessidade real:** F17 (Tema Claro/Escuro) é o único item para o qual recomendo explicitamente pausar antes de detalhar, por falta de motivação de negócio confirmada.