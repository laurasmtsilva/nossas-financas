# Registro de Lançamento (Receita ou Despesa)

## O que o Usuário Consegue Fazer

O usuário consegue registrar uma entrada de dinheiro (receita) ou uma saída de dinheiro (despesa), informando: valor, data, descrição, categoria, se é um gasto pessoal (PF) ou de empresa (PJ), e como o pagamento foi feito — usando saldo/dinheiro de uma conta bancária ou usando um cartão de crédito (neste caso, podendo dividir em parcelas).

## Pontos de Entrada no Sistema

- `/lancamentos`, formulário "Registrar Fluxo".

## Regras de Negócio Observadas

- Campos obrigatórios antes de salvar: descrição, valor, categoria e conta/cartão (`if (!descricao || !valor || !categoriaId || !contaId) ...`).
- O nome de quem está lançando é obtido automaticamente a partir do e-mail do usuário logado (parte antes do "@"), via `supabase.auth.getUser()`; se não houver usuário, usa "Usuário Local".
- Se o tipo é RECEITA, o meio de pagamento é forçado para CONTA (`useEffect` zera a opção CARTÃO).
- Se o meio de pagamento escolhido é CARTÃO, o tipo é forçado para DESPESA.
- Ao salvar, o sistema sempre cria primeiro um registro "mestre" na tabela `lancamentos` e, em seguida, um ou mais registros específicos na tabela `transacoes`:
  - Pagamento por CONTA: cria uma única transação com `status: 'pago'`.
  - Pagamento por CARTÃO: aciona a lógica de parcelamento (ver feature própria "Parcelamento de Compra no Cartão"), criando uma transação por parcela com `status: 'pendente'`.
- Após salvar com sucesso, o formulário é limpo e a listagem de lançamentos é recarregada.
- Em caso de falha ao criar o lançamento mestre ou qualquer transação, o sistema exibe uma mensagem de erro com detalhe técnico retornado pelo Supabase.

## Limitações Observadas

- Não existe funcionalidade de edição de um lançamento já criado — apenas criação e exclusão total (ver **Exclusão de Lançamento**).
- Não há campo para anexar comprovante, nota fiscal ou imagem.
- O campo de valor é um input numérico simples, sem máscara monetária (não formata como "R$ 1.234,56" durante a digitação).
- Não há validação de que o valor seja maior que zero além da checagem de campo vazio.

## Relação com Outras Features

- Gera dados consumidos pelo **Histórico de Movimentações**.
- Quando o meio de pagamento é CARTÃO, aciona o **Parcelamento de Compra no Cartão**, que por sua vez alimenta o **Painel de Faturas**.
- Consome dados da **Gestão de Categorias**, da **Gestão de Contas Bancárias** e da **Gestão de Cartões de Crédito**.
- Pode ser alimentado automaticamente pelo **Preenchimento Automático via SMS**.
- Permite, no próprio formulário, o **Cadastro Rápido de Categoria**.

## Pergunta Central Relacionada

Conecta-se com "Quanto ainda posso gastar este mês?" e "Quanto dinheiro realmente temos disponível?", pois é a porta de entrada dos dados brutos necessários para responder a essas perguntas. Vale notar que o sistema, nesta tela, apenas registra o dado — não realiza nenhum cálculo de saldo restante, orçamento ou disponibilidade (a página inicial `/` é, segundo o próprio código, um placeholder para um futuro painel).

## Relação com o Backlog

Não há item específico em `03_backlog.md` chamado exatamente "Registro de Lançamento" — o item mais próximo, F06 ("Lançamento Inteligente por Copiar/Colar"), refere-se à funcionalidade documentada separadamente em "Preenchimento Automático via SMS".

## Questões em Aberto

Nenhuma lacuna de arquivo identificada — o fluxo completo está contido em `src/app/lancamentos/page.tsx`.
