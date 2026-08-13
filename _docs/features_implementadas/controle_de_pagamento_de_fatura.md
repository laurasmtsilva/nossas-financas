# Controle de Pagamento de Fatura

## O que o Usuário Consegue Fazer

O usuário consegue marcar uma fatura inteira como "Paga" (ou desmarcar, voltando para "Aberta") com um único clique. Ao fazer isso, todas as compras e parcelas que fazem parte daquela fatura têm seu status individual atualizado automaticamente entre "pago" e "pendente", sem que o usuário precise alterar cada item manualmente.

## Pontos de Entrada no Sistema

- `/faturas`, botão de status ("Marcar como Paga" / "Paga") no banner de detalhamento da fatura selecionada.

## Regras de Negócio Observadas

- A função `handleAlternarStatusFatura` alterna o campo `status` da fatura entre `'ABERTA'` e `'PAGA'`.
- Ao mudar o status da fatura, o sistema também atualiza, em lote, o campo `status` de todas as transações vinculadas àquela fatura (`fatura_id` igual): para `'pago'` quando a fatura passa a `'PAGA'`, e para `'pendente'` quando volta a `'ABERTA'`.
- O tipo `Fatura` definido no frontend prevê um terceiro status, `'FECHADA'`, mas nenhuma ação na interface observada define ou usa esse valor — a alternância disponível ao usuário é sempre binária, entre "Aberta" e "Paga".

## Limitações Observadas

- Não há registro de qual conta bancária efetivamente pagou a fatura, nem da data em que o pagamento ocorreu — apesar de as colunas `data_pagamento` e `conta_pagamento_id` existirem na tabela `faturas` no banco de dados, elas não são preenchidas por este fluxo.
- Marcar uma fatura como paga não gera nenhum lançamento de débito na conta bancária correspondente — o saldo da conta (tal como exibido em **Gestão de Contas Bancárias**) não é afetado por esta ação.
- Não existe, na interface, nenhuma forma de levar uma fatura ao status "FECHADA", mesmo que o cartão já tenha passado do seu dia de fechamento.

## Relação com Outras Features

- Opera sobre os dados exibidos pelo **Painel de Faturas**, que por sua vez depende do **Parcelamento de Compra no Cartão**.

## Pergunta Central Relacionada

Conecta-se com "Estamos dentro do orçamento?" e "Quanto dinheiro realmente temos disponível?", pois o pagamento de uma fatura afeta a percepção de quanto dinheiro resta disponível. No entanto, como observado nas limitações, o sistema não debita automaticamente o valor da fatura da conta bancária ao marcá-la como paga — a informação de "dinheiro disponível" em outras telas não é atualizada por esta ação.

## Relação com o Backlog

O item "A DETALHAR" em `03_backlog.md` — "Vincular o débito da conta à alteração do status da fatura entre ABERTA e PAGA" — é diretamente coerente com a limitação observada aqui: o código de fato altera apenas o status da fatura e das transações, sem qualquer débito automático em conta, confirmando que esse ponto específico permanece pendente.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
