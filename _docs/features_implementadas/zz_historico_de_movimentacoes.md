# Histórico de Movimentações Recentes

## O que o Usuário Consegue Fazer

O usuário consegue ver, logo depois de registrar um lançamento, uma lista com as movimentações mais recentes da família — mostrando se é receita ou despesa, quem lançou, qual categoria, se foi PF ou PJ, e se foi pago com conta ou cartão (e em quantas parcelas).

## Pontos de Entrada no Sistema

- `/lancamentos`, coluna "Últimas Movimentações".

## Regras de Negócio Observadas

- A lista traz apenas os 15 lançamentos mais recentes, ordenados por data decrescente (`order('data', { ascending: false }).limit(15)`).
- Cada item mostra um ícone de seta para cima em verde para receitas e seta para baixo em cor neutra/vermelha para despesas.
- Exibe uma etiqueta indicando se o lançamento é PF ou PJ.
- Exibe o nome de quem criou o lançamento (`criado_por_nome`), ou "Sistema" caso esse dado esteja vazio.
- Exibe a categoria vinculada, ou "Sem Cat." se não houver.
- Exibe o meio de pagamento (ícone de cartão ou de carteira) e o nome da conta ou cartão usado, além da quantidade de parcelas quando maior que 1.

## Limitações Observadas

- Não há paginação — apenas os 15 lançamentos mais recentes são exibidos, sem forma de ver os anteriores nesta tela.
- Não há filtro por período, categoria, conta, cartão ou palavra-chave.
- Não é possível editar um lançamento a partir desta lista — apenas excluí-lo (ver **Exclusão de Lançamento**).
- Não há nenhum total ou soma calculada sobre os itens exibidos.

## Relação com Outras Features

- Consome diretamente os dados criados pelo **Registro de Lançamento**.
- Conecta-se com a **Exclusão de Lançamento**, cujo botão está presente em cada item da lista.

## Pergunta Central Relacionada

Apoia parcialmente "Quanto dinheiro realmente temos disponível?" e "Estamos dentro do orçamento?", ao dar visibilidade recente sobre o que está sendo gasto ou recebido. Porém, o sistema não realiza nenhum cálculo agregado nesta tela (não soma totais por período, não compara com orçamento).

## Relação com o Backlog

O item F08 ("Filtros Avançados e Paginação no Extrato") está listado como "A Fazer" em `03_backlog.md`. Isso é coerente com o observado: a listagem atual não possui filtros nem paginação, apenas um limite fixo de 15 itens.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
