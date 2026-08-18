# Gestão de Contas Bancárias

## O que o Usuário Consegue Fazer

O usuário consegue cadastrar as contas bancárias da família (ex.: conta corrente, poupança), informando o banco, um apelido, se é uma conta pessoal ou de empresa, se é individual ou conjunta, e um saldo inicial. Também consegue ver a lista de todas as contas cadastradas e editar os dados de uma conta — desde que ela ainda não tenha nenhuma movimentação registrada.

## Pontos de Entrada no Sistema

- `/contas`.

## Regras de Negócio Observadas

- Antes de permitir a edição de uma conta, o sistema verifica se existe alguma transação vinculada a ela (`transacoes` com `conta_bancaria_id` igual, usando contagem `count: 'exact', head: true`). Se houver pelo menos uma, a edição é bloqueada e é exibida a mensagem "⚠️ Bloqueado: Esta conta já possui movimentações."
- Ao salvar, se uma conta estiver em edição, é feito um `update`; caso contrário, é feito um `insert`.
- O saldo inicial é convertido para número; se o campo estiver vazio ou inválido, assume `0` (`parseFloat(saldoInicial) || 0`).
- A titularidade aceita apenas "Individual" ou "Conjunta" (mapeados para `I`/`C`), e o tipo de pessoa aceita apenas "PF" ou "PJ" — ambos validados também por constraints no banco de dados.
- A listagem é ordenada da conta cadastrada mais recentemente para a mais antiga (`criado_em` decrescente).

## Limitações Observadas

- Não há função de exclusão de conta bancária em nenhum ponto do código analisado.
- Uma conta com movimentações não pode ser editada de forma alguma através desta tela — mesmo para corrigir um simples erro de digitação no apelido.
- Não há validação contra duplicidade de apelido ou banco.

## Relação com Outras Features

- Contas bancárias cadastradas aqui aparecem como opção de pagamento no **Registro de Lançamento** (quando o meio de pagamento é "Saldo/Dinheiro").
- Também podem ser escolhidas como conta de pagamento padrão na **Gestão de Cartões de Crédito**.

## Pergunta Central Relacionada

Conecta-se com "Quanto dinheiro realmente temos disponível?", pois as contas bancárias e seus saldos iniciais são a base declarada de dinheiro disponível no sistema. Vale notar que esta tela exibe apenas o `saldo_inicial` estático cadastrado manualmente — não há nenhum cálculo de saldo atual consolidado (somando receitas e despesas já lançadas) observado nesta página.

## Relação com o Backlog

Não há item específico em `03_backlog.md` chamado "Contas Bancárias". O item "A DETALHAR" — "Criar estado inativo para contas e cartões, uma vez que a exclusão prejudica o banco de dados" — é coerente com o que se observa: de fato não existe exclusão implementada para contas.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
