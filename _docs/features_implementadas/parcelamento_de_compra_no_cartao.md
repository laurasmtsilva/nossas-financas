# Parcelamento de Compra no Cartão de Crédito

## O que o Usuário Consegue Fazer

Ao registrar uma despesa paga no cartão de crédito, o usuário pode escolher dividir o valor em até 12 parcelas. O sistema calcula sozinho em qual fatura mensal cada parcela deve entrar, com base no dia de fechamento do cartão escolhido, e organiza automaticamente essas faturas — mesmo que ainda não existam.

## Pontos de Entrada no Sistema

- `/lancamentos`, ao escolher "Cartão de Crédito" como forma de pagamento, aparece o campo "Parcelamento".
- Lógica de cálculo implementada nas funções `calcularMesAnoFatura` e dentro de `handleSalvar`, em `src/app/lancamentos/page.tsx`.

## Regras de Negócio Observadas

- O valor de cada parcela é calculado dividindo o valor total pelo número de parcelas, arredondado para duas casas decimais (`(valorTotal / totalParcelas).toFixed(2)`).
- Se o dia da compra for maior que o dia de fechamento do cartão, a primeira parcela já entra na fatura do mês seguinte.
- Cada parcela subsequente avança um mês em relação à parcela anterior, com virada de ano quando o mês ultrapassa 12.
- Para cada parcela, o sistema verifica se já existe uma fatura para aquele cartão, ano e mês (a tabela `faturas` possui uma restrição de unicidade por `cartao_credito_id + ano + mes`); se não existir, cria uma nova fatura com status inicial `ABERTA`; se já existir, reaproveita a fatura encontrada.
- Cada parcela é registrada como uma linha própria na tabela `transacoes`, vinculada à fatura correspondente, com `status: 'pendente'`, número da parcela e total de parcelas.
- Quando há mais de uma parcela, a descrição de cada transação recebe o sufixo "(número/total)" (ex.: "Mercado Central (2/5)").
- A data de competência de cada transação usa o dia de vencimento cadastrado no cartão.
- A tela mostra uma prévia do valor de cada parcela (de 1x a 12x) antes de o usuário confirmar.

## Limitações Observadas

- O número máximo de parcelas oferecido é 12 (valor fixo no código, sem opção de mais parcelas).
- Não há qualquer tratamento de juros ou encargos de parcelamento — a divisão é sempre linear (valor total ÷ número de parcelas).
- Não há verificação do limite disponível do cartão (campo `limite`, cadastrado em **Gestão de Cartões de Crédito**) no momento de gerar as parcelas — o sistema não impede nem alerta sobre estouro de limite.
- Se ocorrer um erro no meio do processo de criação das parcelas (por exemplo, na parcela 3 de 5), as parcelas e faturas já criadas anteriormente no mesmo lançamento não são desfeitas — apenas uma mensagem de erro é exibida.

## Relação com Outras Features

- É acionado a partir do **Registro de Lançamento**, quando o meio de pagamento é cartão.
- Os dados gerados (faturas e transações) alimentam diretamente o **Painel de Faturas**.

## Pergunta Central Relacionada

Conecta-se com "Qual cartão é mais adequado para esta compra?" e "Quanto ainda posso gastar este mês?", pois organiza o impacto futuro da compra ao longo dos meses. No entanto, o sistema não emite nenhuma recomendação, comparação entre cartões ou alerta de limite durante esse processo — apenas distribui e registra os dados.

## Relação com o Backlog

Não há item específico e isolado em `03_backlog.md` para esta capacidade; ela está implícita no item F02 ("Painel de Faturas de Cartão de Crédito"), cujo pré-requisito declarado é justamente "Lançamentos com parcelas ativos" — coerente com o que foi observado, já que o parcelamento é o mecanismo que alimenta as faturas.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada — toda a lógica está contida em `src/app/lancamentos/page.tsx` e no schema `supabase/schema.sql`.
