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

### `F04` - Resumo Visual Mensal - Feature principal migrada para implementada

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