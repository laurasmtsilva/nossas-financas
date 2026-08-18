# Painel de Faturas de Cartão de Crédito

## O que o Usuário Consegue Fazer

O usuário consegue escolher um dos seus cartões de crédito e ver todas as faturas mensais já geradas para ele, selecionar uma fatura específica e visualizar o extrato detalhado de tudo que caiu naquele período — cada compra ou parcela, com descrição, quem lançou, categoria, data da compra original e valor — além do valor total consolidado daquela fatura.

## Pontos de Entrada no Sistema

- `/faturas`.

## Regras de Negócio Observadas

- Ao carregar a tela, o primeiro cartão da lista (ordenado por nome) é selecionado automaticamente.
- Dentro do cartão selecionado, a fatura mais recente (ordenada por ano e mês decrescente) é selecionada automaticamente.
- Cada item do extrato mostra a data da compra original (obtida através do lançamento vinculado) separadamente da data de competência da fatura.
- O total consolidado exibido é a soma dos valores de todas as parcelas/transações da fatura selecionada, calculado no momento da exibição (não é um valor armazenado no banco).
- Categoria e data de compra são obtidas por relacionamento direto no Supabase (`categoria:categoria_id(nome)` e `lancamento:lancamento_id(data)`).
- Quando uma transação faz parte de um parcelamento, é exibida a posição da parcela (ex.: "2/5").

## Limitações Observadas

- Não há edição ou exclusão de itens da fatura a partir desta tela.
- Não há criação manual de uma fatura — faturas só existem como efeito colateral do **Registro de Lançamento**/**Parcelamento de Compra no Cartão**.
- Não há indicação, nesta tela, do limite do cartão nem de quanto dele já foi comprometido pela fatura em exibição.

## Relação com Outras Features

- Consome diretamente os dados gerados pelo **Registro de Lançamento** e pelo **Parcelamento de Compra no Cartão**.
- Conecta-se com o **Controle de Pagamento de Fatura**, cujo botão de alternância de status está na mesma tela.

## Pergunta Central Relacionada

Conecta-se com "Quanto ainda posso gastar este mês?" e "Estamos dentro do orçamento?", ao consolidar o valor total de uma fatura. Contudo, o sistema não compara esse total contra o limite do cartão nem contra qualquer orçamento definido pelo usuário — a comparação, se desejada, precisa ser feita mentalmente por quem está olhando a tela.

## Relação com o Backlog

O item F02 ("Painel de Faturas de Cartão de Crédito") está marcado como "✅ Concluída" em `03_backlog.md`. Isso é coerente com o observado: a visualização de faturas por cartão, com seleção e extrato detalhado, está implementada e funcional.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
