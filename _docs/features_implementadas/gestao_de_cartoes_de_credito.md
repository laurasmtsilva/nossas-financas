# Gestão de Cartões de Crédito

## O que o Usuário Consegue Fazer

O usuário consegue cadastrar seus cartões de crédito, informando nome, limite, dia de fechamento da fatura, dia de vencimento e qual conta bancária normalmente é usada para pagar a fatura. Também consegue ver a lista de cartões já cadastrados e editar os dados de qualquer um deles.

## Pontos de Entrada no Sistema

- `/cartoes`.

## Regras de Negócio Observadas

- O dia de fechamento e o dia de vencimento são validados no banco de dados para estarem sempre entre 1 e 31 (`cartoes_credito_dia_fechamento_check` e `cartoes_credito_dia_vencimento_check`).
- Ao salvar, se um cartão estiver em edição (`idEditando` preenchido), é feito um `update`; caso contrário, um `insert`.
- O limite é armazenado como número (`parseFloat(limite)`).
- A conta bancária padrão de pagamento é opcional na exibição, mas obrigatória no envio do formulário conforme o código atual (não há tratamento de valor vazio para `conta_pagamento_padrao_id` antes do insert/update).

## Limitações Observadas

- Não há função de exclusão de cartão em nenhum ponto do código analisado.
- Não há bloqueio de edição mesmo quando o cartão já possui faturas ou transações vinculadas — diferente do comportamento observado em **Gestão de Contas Bancárias**, que bloqueia a edição neste cenário.
- O campo `limite` é apenas armazenado; não há, nesta tela, nenhum cálculo ou exibição de quanto do limite já está comprometido por faturas em aberto.

## Relação com Outras Features

- Cartões cadastrados aqui são usados no **Registro de Lançamento** e no **Parcelamento de Compra no Cartão**.
- São a base de organização do **Painel de Faturas**.
- Referenciam uma **Conta Bancária** como conta padrão de pagamento.

## Pergunta Central Relacionada

Conecta-se com "Qual cartão é mais adequado para esta compra?", pois fornece o cadastro básico (limite, datas de fechamento e vencimento) que poderia sustentar essa decisão. Contudo, o sistema não compara cartões entre si nem sugere qual usar em nenhuma tela observada — essa é apenas a base de dados, sem lógica de recomendação.

## Relação com o Backlog

O item F07 ("Tela de Cadastro de Cartões de Crédito") está marcado como "✅ Concluída" em `03_backlog.md`. Isso é coerente com o observado: cadastro e edição de cartões estão implementados e funcionais. O item "A DETALHAR" sobre criar "estado inativo para contas e cartões" também é coerente com a ausência de exclusão observada aqui.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
