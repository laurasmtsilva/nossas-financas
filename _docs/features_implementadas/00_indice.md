# Índice do Catálogo de Features Implementadas

> Catálogo construído por engenharia reversa, exclusivamente a partir da observação direta do código-fonte (`Project Knowledge`, sincronizado do repositório `laurasmtsilva/nossas-financas`), com `_docs/00_context.md` usado apenas como base de terminologia e critério de conexão com as perguntas centrais do produto. `_docs/03_backlog.md` foi consultado apenas ao final, como nota de cruzamento (ver seção "Relação com o Backlog" de cada documento).

| Feature | Página(s) de Origem | Pergunta Central Relacionada | Item Correspondente no Backlog |
|---|---|---|---|
| [Criação de Conta](./criacao_de_conta.md) | `/login` (modo Registro) | Nenhuma conexão direta | F11 — ✅ Concluída (coerente) |
| [Acesso à Conta (Login)](./acesso_a_conta_login.md) | `/login` (modo Login) | Nenhuma conexão direta | F11 — ✅ Concluída (coerente) |
| [Encerramento de Sessão (Sair)](./encerramento_de_sessao_logout.md) | `Navbar` (todas as páginas) | Nenhuma conexão direta | Implícito em F11 |
| [Redirecionamento Automático Conforme Autenticação](./redirecionamento_automatico_por_autenticacao.md) | `middleware.ts` (todas as rotas) | Nenhuma conexão direta | F11 — ✅ Concluída (coerente) |
| [Registro de Lançamento (Receita ou Despesa)](./registro_de_lancamento.md) | `/lancamentos` | Quanto ainda posso gastar / Quanto dinheiro realmente temos disponível | Sem item isolado; relacionado a F06 |
| [Parcelamento de Compra no Cartão de Crédito](./parcelamento_de_compra_no_cartao.md) | `/lancamentos` (meio de pagamento = Cartão) | Qual cartão é mais adequado / Quanto ainda posso gastar este mês | Implícito em F02 |
| [Preenchimento Automático a partir de SMS Colado](./preenchimento_automatico_via_sms.md) | `/lancamentos` (botão "Colar SMS") + `src/utils/parser.ts` | Apoia indiretamente "Posso fazer esta compra?" | F06 (inconsistência: aparece em "Finalizados" e "Definidos") |
| [Cadastro Rápido de Categoria Durante o Lançamento](./cadastro_rapido_de_categoria_durante_lancamento.md) | `/lancamentos` (dropdown de categoria) | Nenhuma conexão direta | Sem item específico |
| [Exclusão de Lançamento](./exclusao_de_lancamento.md) | `/lancamentos` (ícone de lixeira) | Nenhuma conexão direta | Sem item específico |
| [Histórico de Movimentações Recentes](./historico_de_movimentacoes.md) | `/lancamentos` (lista "Últimas Movimentações") | Apoia parcialmente "Quanto dinheiro temos" / "Estamos dentro do orçamento?" | F08 — A Fazer (coerente) |
| [Painel de Faturas de Cartão de Crédito](./painel_de_faturas.md) | `/faturas` | Quanto ainda posso gastar este mês / Estamos dentro do orçamento | F02 — ✅ Concluída (coerente) |
| [Controle de Pagamento de Fatura](./controle_de_pagamento_de_fatura.md) | `/faturas` (botão de status) | Estamos dentro do orçamento / Quanto dinheiro temos disponível | Item "A Detalhar" sobre débito automático (coerente) |
| [Gestão de Contas Bancárias](./gestao_de_contas_bancarias.md) | `/contas` | Quanto dinheiro realmente temos disponível | Item "A Detalhar" sobre estado inativo (coerente) |
| [Gestão de Cartões de Crédito](./gestao_de_cartoes_de_credito.md) | `/cartoes` | Qual cartão é mais adequado para esta compra | F07 — ✅ Concluída (coerente) |
| [Gestão de Categorias](./gestao_de_categorias.md) | `/categorias` | Nenhuma conexão direta | Sem item específico |
| [Ferramenta Interna de Teste do Parser de SMS](./ferramenta_interna_teste_parser.md) | `/teste-parser` | Nenhuma (ferramenta de apoio técnico) | Sem item correspondente |

## Observações sobre o Catálogo

* Total de features de negócio identificadas: **15** (mais uma ferramenta interna de apoio ao desenvolvimento, `Ferramenta Interna de Teste do Parser de SMS`, listada por completude mas sem caráter de entrega ao usuário final).
* Duas páginas (`/login` e `/lancamentos`) concentram mais de uma feature de negócio distinta, conforme esperado pela metodologia da missão.
* A inconsistência do item F06 no backlog (presente tanto em "Finalizados" quanto em "Definidos", com textos ligeiramente diferentes) foi confirmada durante o cruzamento e está detalhada no documento "Preenchimento Automático a partir de SMS Colado".
* Nenhuma feature ficou sem documentação por falta de arquivo no Project Knowledge — todas as seções "Questões em Aberto" foram registradas nos documentos individuais quando aplicável.
