# Database Module Overview

## Objetivo

A responsabilidade arquitetural deste módulo é definir a estrutura persistente de dados utilizada pelo sistema.

O módulo é representado pelo schema PostgreSQL localizado em `/supabase/schema.sql`, que define tipos, tabelas, chaves, relacionamentos, políticas de acesso e permissões do banco de dados.

---

## O que Existe

### Estrutura do banco

O banco utiliza o schema `public` do PostgreSQL. O arquivo configura extensões utilizadas pelo ambiente, incluindo:

* `pg_stat_statements`;
* `pgcrypto`;
* `supabase_vault`;
* `uuid-ossp`.

Também define tipos enumerados utilizados pelas entidades:

* `frequencia_recorrencia`, com valores:

  * `semanal`;
  * `mensal`;
  * `anual`.

* `status_transacao`, com valores:

  * `pendente`;
  * `pago`.

* `tipo_pessoa_enum`, com valores:

  * `PF`;
  * `PJ`.

* `tipo_transacao`, com valores:

  * `receita`;

  * `despesa`.

---

## Entidades de Dados

### cartoes_credito

Tabela responsável pelo armazenamento de cartões de crédito.

Campos observados:

* `id`;
* `nome`;
* `dia_fechamento`;
* `dia_vencimento`;
* `conta_pagamento_padrao_id`;
* `limite`.

Possui validações para que os dias de fechamento e vencimento estejam entre 1 e 31.

---

### categorias

Tabela responsável pelo armazenamento de categorias.

Campos observados:

* `id`;
* `nome`;
* `tipo`;
* `parent_id`;
* `icone`;
* `criado_em`.

O campo `tipo` aceita apenas os valores:

* `RECEITA`;
* `DESPESA`.

A estrutura permite categorias hierárquicas através do campo `parent_id`.

---

### contas_bancarias

Tabela responsável pelo armazenamento de contas bancárias.

Campos observados:

* `id`;
* `banco`;
* `tipo_pessoa`;
* `titularidade`;
* `apelido`;
* `saldo_inicial`;
* `criado_em`.

O campo `titularidade` aceita os valores:

* `I`;
* `C`.

---

### faturas

Tabela responsável pelo armazenamento de faturas de cartões.

Campos observados:

* `id`;
* `cartao_credito_id`;
* `ano`;
* `mes`;
* `status`;
* `data_pagamento`;
* `conta_pagamento_id`;
* `created_at`.

Existe uma restrição de unicidade para impedir múltiplas faturas do mesmo cartão no mesmo período (`cartao_credito_id`, `ano`, `mes`).

---

### lancamentos

Tabela responsável pelo armazenamento de lançamentos.

Campos observados:

* `id`;
* `descricao`;
* `valor`;
* `data`;
* `tipo_pessoa`;
* `conta_id`;
* `categoria_id`;
* `criado_em`;
* `tipo`;
* `meio_pagamento`;
* `parcelas`;
* `criado_por_nome`.

Possui restrições para:

* `meio_pagamento`: `CONTA` ou `CARTAO`;
* `tipo`: `RECEITA` ou `DESPESA`;
* `tipo_pessoa`: `PF` ou `PJ`.

---

### recorrencias

Tabela responsável pelo armazenamento de recorrências.

Campos observados:

* `id`;
* `descricao`;
* `valor`;
* `categoria_id`;
* `frequencia`;
* `dia_vencimento`;
* `ativa`;
* `criado_por`;
* `criado_em`.

O campo `frequencia` utiliza o tipo `frequencia_recorrencia`.

Existe validação para `dia_vencimento` entre 1 e 31.

---

### transacoes

Tabela responsável pelo armazenamento de transações.

Campos observados:

* `id`;
* `descricao`;
* `valor`;
* `tipo`;
* `status`;
* `data_competencia`;
* `data_pagamento`;
* `categoria_id`;
* `conta_bancaria_id`;
* `cartao_credito_id`;
* `recorrencia_origem_id`;
* `numero_parcela`;
* `total_parcelas`;
* `criado_por`;
* `criado_em`;
* `atualizado_em`;
* `lancamento_id`;
* `fatura_id`;
* `criado_por_nome`.

---

## Relacionamentos Observados

### Cartões e contas bancárias

`cartoes_credito.conta_pagamento_padrao_id` referencia `contas_bancarias.id`.

A exclusão da conta relacionada define o campo como `NULL`.

---

### Faturas

`faturas.cartao_credito_id` referencia `cartoes_credito.id`.

A exclusão do cartão remove as faturas relacionadas.

`faturas.conta_pagamento_id` referencia `contas_bancarias.id`.

---

### Categorias

`categorias.parent_id` referencia outra categoria através da combinação:

* `parent_id`;
* `tipo`.

A exclusão da categoria pai remove as categorias filhas relacionadas.

---

### Lançamentos

`lancamentos.categoria_id` referencia `categorias.id`.

---

### Transações

A tabela `transacoes` possui referências para:

* cartões de crédito;
* categorias;
* contas bancárias;
* faturas;
* lançamentos;
* recorrências.

Relacionamentos observados:

* `cartao_credito_id` → `cartoes_credito.id`;
* `categoria_id` → `categorias.id`;
* `conta_bancaria_id` → `contas_bancarias.id`;
* `fatura_id` → `faturas.id`;
* `lancamento_id` → `lancamentos.id`;
* `recorrencia_origem_id` → `recorrencias.id`.

---

## Como Funciona

O banco organiza os dados financeiros em entidades separadas:

* contas bancárias armazenam informações das contas;
* cartões de crédito armazenam informações dos cartões;
* categorias classificam registros financeiros;
* lançamentos armazenam registros financeiros básicos;
* recorrências armazenam configurações de lançamentos recorrentes;
* faturas representam períodos de cartões de crédito;
* transações relacionam eventos financeiros às demais entidades.

Os relacionamentos entre entidades são mantidos através de chaves estrangeiras definidas no schema.

---

## Relação com o Restante do Sistema

O banco é utilizado como camada persistente para as funcionalidades financeiras registradas no projeto.

As entidades observadas no schema correspondem às áreas funcionais registradas no contexto do sistema:

* contas;
* cartões;
* categorias;
* lançamentos;
* recorrências;
* transações;
* faturas.

O acesso às tabelas é configurado através do Supabase.

As tabelas possuem Row Level Security habilitado:

* `cartoes_credito`;
* `categorias`;
* `contas_bancarias`;
* `faturas`;
* `lancamentos`;
* `recorrencias`;
* `transacoes`.

Foram definidas políticas permitindo acesso para usuários autenticados nessas tabelas.

---

## Questões em Aberto

Não foram identificadas questões em aberto a partir do arquivo analisado.

O schema permite observar a estrutura das entidades e seus relacionamentos, mas não permite determinar:

* quais telas utilizam cada entidade;
* quais serviços ou componentes acessam cada tabela;
* quais fluxos de negócio são executados pela aplicação;
* como os dados são transformados antes da persistência.

Essas informações dependem da análise das camadas de aplicação.